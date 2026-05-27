import type { Finding, MaintainerConfig } from "../types.js";
import { countLines, matchesAny, readTextSafe, walkFiles } from "../lib/file-utils.js";

export function checkLargeFiles(config: MaintainerConfig): Finding[] {
  const findings: Finding[] = [];
  const files = walkFiles(config.sourceDirs, config);

  for (const file of files) {
    const lineCount = countLines(readTextSafe(file));
    const isComponent = file.endsWith(".tsx") && (file.includes("/components/") || file.includes("components/"));
    const isApiRoute = matchesAny(file, config.apiRoutePatterns);
    const limit = isApiRoute
      ? config.maxFileLines.apiRoute
      : isComponent
        ? config.maxFileLines.component
        : config.maxFileLines.default;

    if (lineCount > limit) {
      findings.push({
        type: "large-file",
        severity: "low",
        title: "Large file detected",
        message: `${file} is ${lineCount} lines, above the configured limit of ${limit}.`,
        file
      });
    }
  }

  return findings;
}
