"""Evaluator for the restricted expression language used by `slot.ask_if` and `red_flag.when`
in packages/ontology (module.schema.json). Deterministic, no model — CLAUDE.md rule 3: red
flags are evaluated by this, never by an LLM. No `eval()` anywhere in this file, on purpose —
these expressions are patient-adjacent clinical logic, not a place for arbitrary code execution.

This is a line-for-line port of services/gateway/src/ontology/expression.ts. Two independent
implementations of the same restricted grammar, one per language runtime — kept honest by both
being tested against the same real modules (packages/ontology/modules/*.yaml), not by sharing
code across the TS/Python boundary.

Grammar (informal), matching what the existing modules actually use:
  expr       := or_expr
  or_expr    := and_expr ("or" and_expr)*
  and_expr   := not_expr ("and" not_expr)*
  not_expr   := "not" not_expr | comparison
  comparison := operand (("in" | "==" | "!=" | ">=" | "<=" | ">" | "<") operand)?
  operand    := "(" expr ")" | identifier | string | number | "[" (operand ("," operand)*)? "]"

Evaluation is total: a slot referenced by an expression that hasn't been filled yet resolves to
None, and every operator treats None as "condition not met" rather than raising.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Union

ExpressionContext = dict[str, Any]

_KEYWORD_OPS = {"and", "or", "not", "in"}
_COMPARE_OPS = {"in", "==", "!=", ">=", "<=", ">", "<"}

_TOKEN_RE = re.compile(
    r"""
    (?P<ws>\s+)
    |(?P<punct>[()\[\],])
    |(?P<string>'[^']*'|"[^"]*")
    |(?P<number>-?\d+(?:\.\d+)?)
    |(?P<op>==|!=|>=|<=|>|<)
    |(?P<ident>[a-zA-Z_][a-zA-Z0-9_]*)
    """,
    re.VERBOSE,
)


@dataclass(frozen=True)
class _Token:
    kind: str
    value: Any


def _tokenize(source: str) -> list[_Token]:
    tokens: list[_Token] = []
    pos = 0
    while pos < len(source):
        match = _TOKEN_RE.match(source, pos)
        if not match:
            raise ValueError(f"Unexpected character {source[pos]!r} in expression: {source}")
        pos = match.end()
        if match.lastgroup == "ws":
            continue
        if match.lastgroup == "punct":
            tokens.append(_Token("punct", match.group("punct")))
        elif match.lastgroup == "string":
            tokens.append(_Token("string", match.group("string")[1:-1]))
        elif match.lastgroup == "number":
            tokens.append(_Token("number", float(match.group("number"))))
        elif match.lastgroup == "op":
            tokens.append(_Token("op", match.group("op")))
        elif match.lastgroup == "ident":
            word = match.group("ident")
            tokens.append(_Token("op" if word in _KEYWORD_OPS else "ident", word))
    return tokens


# --- AST -----------------------------------------------------------------------------------

@dataclass(frozen=True)
class _Or:
    left: "Node"
    right: "Node"


@dataclass(frozen=True)
class _And:
    left: "Node"
    right: "Node"


@dataclass(frozen=True)
class _Not:
    operand: "Node"


@dataclass(frozen=True)
class _Compare:
    op: str
    left: "Node"
    right: "Node"


@dataclass(frozen=True)
class _List:
    items: list["Node"]


@dataclass(frozen=True)
class _Ident:
    name: str


@dataclass(frozen=True)
class _Literal:
    value: Union[str, float]


Node = Union[_Or, _And, _Not, _Compare, _List, _Ident, _Literal]


class _Parser:
    def __init__(self, tokens: list[_Token]):
        self._tokens = tokens
        self._pos = 0

    def _peek(self) -> _Token | None:
        return self._tokens[self._pos] if self._pos < len(self._tokens) else None

    def _next(self) -> _Token:
        token = self._peek()
        if token is None:
            raise ValueError("Unexpected end of expression")
        self._pos += 1
        return token

    def parse_expr(self) -> Node:
        return self._parse_or()

    def _parse_or(self) -> Node:
        left = self._parse_and()
        while (t := self._peek()) and t.kind == "op" and t.value == "or":
            self._next()
            left = _Or(left, self._parse_and())
        return left

    def _parse_and(self) -> Node:
        left = self._parse_not()
        while (t := self._peek()) and t.kind == "op" and t.value == "and":
            self._next()
            left = _And(left, self._parse_not())
        return left

    def _parse_not(self) -> Node:
        t = self._peek()
        if t and t.kind == "op" and t.value == "not":
            self._next()
            return _Not(self._parse_not())
        return self._parse_comparison()

    def _parse_comparison(self) -> Node:
        left = self._parse_operand()
        t = self._peek()
        if t and t.kind == "op" and t.value in _COMPARE_OPS:
            self._next()
            right = self._parse_operand()
            return _Compare(t.value, left, right)
        return left

    def _parse_operand(self) -> Node:
        t = self._next()
        if t.kind == "punct" and t.value == "(":
            inner = self.parse_expr()
            self._expect_punct(")")
            return inner
        if t.kind == "punct" and t.value == "[":
            items: list[Node] = []
            nxt = self._peek()
            if not (nxt and nxt.kind == "punct" and nxt.value == "]"):
                items.append(self._parse_operand())
                while (c := self._peek()) and c.kind == "punct" and c.value == ",":
                    self._next()
                    items.append(self._parse_operand())
            self._expect_punct("]")
            return _List(items)
        if t.kind == "ident":
            return _Ident(t.value)
        if t.kind == "string":
            return _Literal(t.value)
        if t.kind == "number":
            return _Literal(t.value)
        raise ValueError(f"Unexpected token in expression: {t}")

    def _expect_punct(self, value: str) -> None:
        t = self._next()
        if t.kind != "punct" or t.value != value:
            raise ValueError(f"Expected {value!r}")


def _truthy(value: Any) -> bool:
    if isinstance(value, list):
        return len(value) > 0
    return bool(value)


def _eval_compare(op: str, left: Any, right: Any) -> bool:
    if op == "in":
        if isinstance(right, list):
            return left in right
        if isinstance(left, list):
            return right in left
        return False
    if left is None or right is None:
        return False
    if op == "==":
        return left == right
    if op == "!=":
        return left != right
    if op == ">=":
        return float(left) >= float(right)
    if op == "<=":
        return float(left) <= float(right)
    if op == ">":
        return float(left) > float(right)
    if op == "<":
        return float(left) < float(right)
    raise ValueError(f"Unknown operator: {op}")


def _eval_node(node: Node, ctx: ExpressionContext) -> Any:
    if isinstance(node, _Or):
        return _truthy(_eval_node(node.left, ctx)) or _truthy(_eval_node(node.right, ctx))
    if isinstance(node, _And):
        return _truthy(_eval_node(node.left, ctx)) and _truthy(_eval_node(node.right, ctx))
    if isinstance(node, _Not):
        return not _truthy(_eval_node(node.operand, ctx))
    if isinstance(node, _List):
        return [_eval_node(item, ctx) for item in node.items]
    if isinstance(node, _Ident):
        return ctx.get(node.name)
    if isinstance(node, _Literal):
        return node.value
    if isinstance(node, _Compare):
        return _eval_compare(node.op, _eval_node(node.left, ctx), _eval_node(node.right, ctx))
    raise ValueError(f"Unknown node: {node}")


def evaluate_expression(source: str, ctx: ExpressionContext) -> bool:
    """Parses and evaluates in one call. Never raises on a missing context value — only on a
    genuinely malformed expression, which ontology validation should already have caught."""
    ast = _Parser(_tokenize(source)).parse_expr()
    return _truthy(_eval_node(ast, ctx))
