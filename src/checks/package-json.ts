import type { Finding, MaintainerConfig } from "../types.js";
import { fileExists, readTextSafe } from "../lib/file-utils.js";

export function checkPackageJson(config: MaintainerConfig): Finding[] {
  const findings: Finding[] = [];

  if (!fileExists("package.json")) {
    findings.push({
      type: "missing-package-json",
      severity: "medium",
      title: "Missing package.json",
      message: "package.json was not found."
    });
    return findings;
  }

  const parsed = JSON.parse(readTextSafe("package.json")) as {
    scripts?: Record<string, string>;
  };

  const scripts = parsed.scripts ?? {};

  for (const scriptName of config.requiredPackageScripts) {
    if (!scripts[scriptName]) {
      findings.push({
        type: "missing-package-script",
        severity: scriptName === "test" ? "medium" : "low",
        title: "Missing package script: " + scriptName,
        message: "package.json does not include a " + scriptName + " script."
      });
    }
  }

  return findings;
}
