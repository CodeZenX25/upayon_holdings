import type { ZodError } from "zod";

export interface ValidationIssue {
  /** Dotted field path, e.g. "progressUpdates.0.note". */
  path: string;
  message: string;
}

/** "progressUpdates.0.note" → "Progress updates #1 → note" */
function readablePath(path: PropertyKey[]): string {
  return path
    .map((part) =>
      typeof part === "number"
        ? `#${part + 1}`
        : String(part)
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(" → ");
}

/**
 * Turns a ZodError into a JSON body admins can act on:
 * a one-line message naming the field(s), plus structured issues for the form.
 */
export function validationErrorBody(error: ZodError) {
  const issues: ValidationIssue[] = error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
  const summary = error.issues
    .slice(0, 3)
    .map((issue) => `${readablePath(issue.path) || "Form"}: ${issue.message}`)
    .join(" • ");
  const more = error.issues.length > 3 ? ` (+${error.issues.length - 3} more)` : "";

  return { message: `Please fix: ${summary}${more}`, issues };
}
