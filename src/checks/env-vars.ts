import type { Finding, MaintainerConfig } from "../types.js";
import { readTextSafe, walkFiles } from "../lib/file-utils.js";

const ENV_REGEXES = [
  /process\.env\.([A-Z0-9_]+)/g,
  /process\.env\[['"]([A-Z0-9_]+)['"]\]/g
];

export function checkEnvVars(config: MaintainerConfig): {
  findings: Finding[];
  envVarsUsed: string[];
} {
  const files = walkFiles(config.sourceDirs, config);
  const envVars = new Set<string>();

  for (const file of files) {
    const text = readTextSafe(file);

    for (const regex of ENV_REGEXES) {
      for (const match of text.matchAll(regex)) {
        const name = match[1];
        if (name && !config.allowedUndocumentedEnvVars.includes(name)) {
          envVars.add(name);
        }
      }
    }
  }

  const envExample = readTextSafe(".env.example");
  const readme = readTextSafe("README.md");
  const findings: Finding[] = [];

  for (const envVar of Array.from(envVars).sort()) {
    if (!envExample.includes(envVar)) {
      findings.push({
        type: "missing-env-example-entry",
        severity: "medium",
        title: "Environment variable missing from .env.example",
        message: `\`${envVar}\` is used in code but was not found in \`.env.example\`.`
      });
    }

    if (readme && !readme.includes(envVar)) {
      findings.push({
        type: "env-var-not-mentioned-in-readme",
        severity: "low",
        title: "Environment variable not mentioned in README",
        message: `\`${envVar}\` is used in code but was not mentioned in \`README.md\`.`
      });
    }
  }

  return {
    findings,
    envVarsUsed: Array.from(envVars).sort()
  };
}
