/**
 * Evaluator for the restricted expression language used by `slot.ask_if` and
 * `red_flag.when` in packages/ontology (module.schema.json). Deterministic, no model —
 * CLAUDE.md rule 3: red flags are evaluated by this, never by an LLM.
 *
 * Grammar (informal), matching what the existing modules actually use:
 *   expr       := or_expr
 *   or_expr    := and_expr ("or" and_expr)*
 *   and_expr   := not_expr ("and" not_expr)*
 *   not_expr   := "not" not_expr | comparison
 *   comparison := operand (("in" | "==" | "!=" | ">=" | "<=" | ">" | "<") operand)?
 *   operand    := "(" expr ")" | identifier | string | number | "[" (operand ("," operand)*)? "]"
 *
 * Evaluation is total: a slot referenced by an expression that hasn't been filled yet resolves
 * to `undefined`, and every operator treats `undefined` as "condition not met" rather than
 * throwing — expressions run after every partial fill, well before every slot exists.
 */

type Token =
  | { kind: "ident"; value: string }
  | { kind: "string"; value: string }
  | { kind: "number"; value: number }
  | { kind: "op"; value: string }
  | { kind: "punct"; value: "(" | ")" | "[" | "]" | "," };

const KEYWORD_OPS = new Set(["and", "or", "not", "in"]);

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "(" || ch === ")" || ch === "[" || ch === "]" || ch === ",") {
      tokens.push({ kind: "punct", value: ch });
      i++;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let j = i + 1;
      let value = "";
      while (j < source.length && source[j] !== quote) {
        value += source[j];
        j++;
      }
      tokens.push({ kind: "string", value });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(source[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < source.length && /[0-9.]/.test(source[j])) j++;
      tokens.push({ kind: "number", value: Number(source.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[=!><]/.test(ch)) {
      if (source[i + 1] === "=") {
        tokens.push({ kind: "op", value: source.slice(i, i + 2) });
        i += 2;
      } else if (ch === ">" || ch === "<") {
        tokens.push({ kind: "op", value: ch });
        i += 1;
      } else {
        throw new Error(`Unexpected token '${ch}' in expression: ${source}`);
      }
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[a-zA-Z0-9_]/.test(source[j])) j++;
      const word = source.slice(i, j);
      tokens.push(
        KEYWORD_OPS.has(word)
          ? { kind: "op", value: word }
          : { kind: "ident", value: word },
      );
      i = j;
      continue;
    }
    throw new Error(`Unexpected character '${ch}' in expression: ${source}`);
  }
  return tokens;
}

class Parser {
  private pos = 0;
  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new Error("Unexpected end of expression");
    this.pos++;
    return t;
  }

  private expectOp(value: string) {
    const t = this.next();
    if (t.kind !== "op" || t.value !== value)
      throw new Error(`Expected '${value}'`);
  }

  parseExpr(): Node {
    return this.parseOr();
  }

  private parseOr(): Node {
    let left = this.parseAnd();
    while (this.peek()?.kind === "op" && this.peek()?.value === "or") {
      this.next();
      left = { type: "or", left, right: this.parseAnd() };
    }
    return left;
  }

  private parseAnd(): Node {
    let left = this.parseNot();
    while (this.peek()?.kind === "op" && this.peek()?.value === "and") {
      this.next();
      left = { type: "and", left, right: this.parseNot() };
    }
    return left;
  }

  private parseNot(): Node {
    if (this.peek()?.kind === "op" && this.peek()?.value === "not") {
      this.next();
      return { type: "not", operand: this.parseNot() };
    }
    return this.parseComparison();
  }

  private parseComparison(): Node {
    const left = this.parseOperand();
    const t = this.peek();
    if (
      t?.kind === "op" &&
      ["in", "==", "!=", ">=", "<=", ">", "<"].includes(t.value)
    ) {
      this.next();
      const right = this.parseOperand();
      return { type: "compare", op: t.value as CompareOp, left, right };
    }
    return left;
  }

  private parseOperand(): Node {
    const t = this.next();
    if (t.kind === "punct" && t.value === "(") {
      const inner = this.parseExpr();
      this.expectPunct(")");
      return inner;
    }
    if (t.kind === "punct" && t.value === "[") {
      const items: Node[] = [];
      if (!(this.peek()?.kind === "punct" && this.peek()?.value === "]")) {
        items.push(this.parseOperand());
        while (this.peek()?.kind === "punct" && this.peek()?.value === ",") {
          this.next();
          items.push(this.parseOperand());
        }
      }
      this.expectPunct("]");
      return { type: "list", items };
    }
    if (t.kind === "ident") return { type: "ident", name: t.value };
    if (t.kind === "string") return { type: "literal", value: t.value };
    if (t.kind === "number") return { type: "literal", value: t.value };
    throw new Error(`Unexpected token in expression: ${JSON.stringify(t)}`);
  }

  private expectPunct(value: ")" | "]") {
    const t = this.next();
    if (t.kind !== "punct" || t.value !== value)
      throw new Error(`Expected '${value}'`);
  }
}

type CompareOp = "in" | "==" | "!=" | ">=" | "<=" | ">" | "<";

type Node =
  | { type: "or"; left: Node; right: Node }
  | { type: "and"; left: Node; right: Node }
  | { type: "not"; operand: Node }
  | { type: "compare"; op: CompareOp; left: Node; right: Node }
  | { type: "list"; items: Node[] }
  | { type: "ident"; name: string }
  | { type: "literal"; value: string | number };

export type ExpressionContext = Record<string, unknown>;

function evalNode(node: Node, ctx: ExpressionContext): unknown {
  switch (node.type) {
    case "or":
      return (
        truthy(evalNode(node.left, ctx)) || truthy(evalNode(node.right, ctx))
      );
    case "and":
      return (
        truthy(evalNode(node.left, ctx)) && truthy(evalNode(node.right, ctx))
      );
    case "not":
      return !truthy(evalNode(node.operand, ctx));
    case "list":
      return node.items.map((item) => evalNode(item, ctx));
    case "ident":
      return ctx[node.name];
    case "literal":
      return node.value;
    case "compare":
      return evalCompare(
        node.op,
        evalNode(node.left, ctx),
        evalNode(node.right, ctx),
      );
  }
}

function evalCompare(op: CompareOp, left: unknown, right: unknown): boolean {
  if (op === "in") {
    if (Array.isArray(right)) return right.includes(left as never);
    if (Array.isArray(left)) return left.includes(right as never);
    return false;
  }
  if (left === undefined || right === undefined) return false;
  switch (op) {
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    case ">=":
      return Number(left) >= Number(right);
    case "<=":
      return Number(left) <= Number(right);
    case ">":
      return Number(left) > Number(right);
    case "<":
      return Number(left) < Number(right);
  }
}

function truthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

/** Parses and evaluates in one call. Never throws on missing context values — only on a
 * genuinely malformed expression, which should have been caught by ontology validation. */
export function evaluateExpression(
  source: string,
  ctx: ExpressionContext,
): boolean {
  const ast = new Parser(tokenize(source)).parseExpr();
  return truthy(evalNode(ast, ctx));
}
