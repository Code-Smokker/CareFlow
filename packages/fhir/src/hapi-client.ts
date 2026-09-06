/** Validates a bundle against the local HAPI server (docs/08-abdm-fhir.md: "Validate every
 * bundle against the local HAPI server in CI"). Uses HAPI's `$validate` operation, which
 * returns an `OperationOutcome` — never throws on a *reachable* server; the caller decides
 * what a non-empty error/fatal outcome means (VisitsService.sign() rejects the sign; the CI
 * job fails the build). */

export interface ValidationIssue {
  severity: "fatal" | "error" | "warning" | "information";
  diagnostics?: string;
  details?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export async function validateBundleAgainstHapi(bundle: unknown, fhirBaseUrl: string): Promise<ValidationResult> {
  const response = await fetch(`${fhirBaseUrl.replace(/\/$/, "")}/Bundle/$validate`, {
    method: "POST",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(bundle),
  });

  const outcome = (await response.json()) as {
    issue?: { severity: ValidationIssue["severity"]; diagnostics?: string; details?: { text?: string } }[];
  };
  const issues: ValidationIssue[] = (outcome.issue ?? []).map((i) => ({
    severity: i.severity,
    diagnostics: i.diagnostics,
    details: i.details?.text,
  }));
  const valid = !issues.some((i) => i.severity === "fatal" || i.severity === "error");
  return { valid, issues };
}
