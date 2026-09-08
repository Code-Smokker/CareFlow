import Link from "next/link";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const dynamic = "force-dynamic";

/** Reads packages/ontology's YAML modules directly — the version-controlled source of truth,
 * not a database copy. Read-only by construction: this page has no write path at all, which is
 * the actual safety guarantee (CLAUDE.md rules 1 and 3), not a UI convention. */
async function loadModules() {
  const modulesDir = path.join(process.cwd(), "..", "..", "packages", "ontology", "modules");
  const entries = await readdir(modulesDir, { withFileTypes: true, recursive: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".yaml"));

  return Promise.all(
    files.map(async (entry) => {
      const filePath = path.join(entry.parentPath ?? entry.path, entry.name);
      const raw = await readFile(filePath, "utf-8");
      const parsed = YAML.parse(raw) as {
        id: string;
        label: string;
        framework?: string;
        slots?: unknown[];
        red_flags?: Array<{ id: string; severity: number; rationale: string }>;
      };
      return { file: path.relative(path.join(modulesDir, ".."), filePath), ...parsed };
    }),
  );
}

export default async function RulesPage() {
  const modules = await loadModules();

  return (
    <div>
      <div className="flex items-center justify-between mb-space-md">
        <h1 className="font-page-title text-page-title text-on-surface">Rules &amp; Red Flags</h1>
        <Link href="/rules/predicates" className="font-clinical-data text-primary underline">
          Red-flag predicates →
        </Link>
      </div>
      <p className="font-clinical-data text-on-surface-variant mb-space-lg">
        Read-only. These modules are version-controlled in <code>packages/ontology</code> — the LLM
        never decides what to ask, and red flags are deterministic rules evaluated over filled
        slots (CLAUDE.md rules 1 &amp; 3). Editing happens in a PR, not here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {modules.map((mod) => (
          <div key={mod.file} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-body-strong text-body-strong text-on-surface">{mod.label ?? mod.id}</span>
              {mod.framework && (
                <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                  {mod.framework}
                </span>
              )}
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mb-space-sm">{mod.file}</p>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant">
              {mod.slots?.length ?? 0} slots · {mod.red_flags?.length ?? 0} red-flag rule(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
