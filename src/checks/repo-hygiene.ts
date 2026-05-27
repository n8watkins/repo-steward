import type { Finding, MaintainerConfig } from "../types.js";
import { fileExists } from "../lib/file-utils.js";

export function checkRepoHygiene(config: MaintainerConfig): Finding[] {
  const findings: Finding[] = [];

  for (const docsFile of config.docsFiles) {
    if (!fileExists(docsFile)) {
      findings.push({
        type: "missing-doc-file",
        severity: docsFile === "README.md" ? "high" : "medium",
        title: `Missing ${docsFile}`,
        message: `${docsFile} was not found.`
      });
    }
  }

  if (!fileExists("tsconfig.json")) {
    findings.push({
      type: "missing-tsconfig",
      severity: "low",
      title: "Missing tsconfig.json",
      message: "tsconfig.json was not found. This may be fine for non-TypeScript repos."
    });
  }

  if (!fileExists(".github/workflows")) {
    findings.push({
      type: "missing-github-workflows",
      severity: "low",
      title: "No GitHub Actions workflows found",
      message: ".github/workflows was not found."
    });
  }

  return findings;
}
