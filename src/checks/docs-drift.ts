import type { Finding, MaintainerConfig } from "../types.js";
import { matchesAny } from "../lib/file-utils.js";

export function checkDocsDrift(config: MaintainerConfig, changedFiles: string[]): Finding[] {
  const findings: Finding[] = [];

  const codeFilesChanged = changedFiles.filter((file) => matchesAny(file, config.architectureRelevantPatterns));
  const docsChanged = changedFiles.filter((file) => {
    return config.docsFiles.includes(file) || matchesAny(file, config.docsPathPatterns);
  });

  if (codeFilesChanged.length > 0 && docsChanged.length === 0) {
    findings.push({
      type: "possible-docs-drift",
      severity: "medium",
      title: "Possible documentation drift",
      message: `Architecture/setup-relevant files changed, but no docs files were updated. Changed files: ${codeFilesChanged.join(", ")}.`
    });
  }

  const packageChanged = changedFiles.includes("package.json");
  const readmeChanged = changedFiles.includes("README.md");

  if (packageChanged && !readmeChanged) {
    findings.push({
      type: "package-json-changed-readme-not-changed",
      severity: "low",
      title: "package.json changed without README update",
      message: "package.json changed, but README.md did not. Check whether setup/scripts docs need updates."
    });
  }

  const riskyFiles = changedFiles.filter((file) => matchesAny(file, config.riskFilePatterns));
  if (riskyFiles.length > 0) {
    findings.push({
      type: "risky-files-changed",
      severity: "medium",
      title: "Risky files changed",
      message: `This PR touches files configured as risky/review-sensitive: ${riskyFiles.join(", ")}.`
    });
  }

  return findings;
}
