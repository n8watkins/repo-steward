import type { ApiRouteSignal, Finding, HealthReport, TodoItem } from "../types.js";

function severityRank(severity: Finding["severity"]): number {
  return { high: 0, medium: 1, low: 2, info: 3 }[severity];
}

function renderFindings(findings: Finding[]): string {
  if (findings.length === 0) {
    return "No findings. Nice.\n";
  }

  return findings
    .slice()
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .map((finding) => {
      const location = finding.file ? `\n  - File: \`${finding.file}\`` : "";
      const line = finding.line ? `:${finding.line}` : "";
      return `### ${finding.severity.toUpperCase()}: ${finding.title}\n\n${finding.message}${location}${line}\n`;
    })
    .join("\n");
}

function renderTodos(todoItems: TodoItem[]): string {
  if (todoItems.length === 0) return "No TODO/FIXME/HACK/TEMP comments found.\n";

  const rows = todoItems
    .map((item) => `| ${item.keyword} | \`${item.file}\` | ${item.line} | ${item.text.replace(/\|/g, "\\|")} |`)
    .join("\n");

  return `| Type | File | Line | Text |\n|---|---|---:|---|\n${rows}\n`;
}

function renderApiRoutes(apiRoutes: ApiRouteSignal[]): string {
  if (apiRoutes.length === 0) return "No API routes detected by configured patterns.\n";

  const yesNo = (value: boolean) => value ? "✅" : "⚠️";

  const rows = apiRoutes
    .map((route) => {
      return `| \`${route.file}\` | ${route.lineCount} | ${yesNo(route.hasValidationSignal)} | ${yesNo(route.hasErrorHandlingSignal)} | ${yesNo(route.hasAuthSignal)} | ${yesNo(route.hasAiProviderSignal)} | ${yesNo(route.hasGuardrailSignal)} |`;
    })
    .join("\n");

  return `| Route | Lines | Validation | Error handling | Auth signal | AI provider | Guardrails |\n|---|---:|---|---|---|---|---|\n${rows}\n`;
}

function statusFromFindings(findings: Finding[]): string {
  if (findings.some((finding) => finding.severity === "high")) return "Needs attention";
  if (findings.some((finding) => finding.severity === "medium")) return "Review recommended";
  if (findings.some((finding) => finding.severity === "low")) return "Mostly healthy";
  return "Healthy";
}

export function renderHealthReport(report: HealthReport): string {
  return `# Repo Steward Health Report

Generated: ${report.generatedAt}

## Status

${statusFromFindings(report.findings)}

## Summary

- Findings: ${report.findings.length}
- TODO/FIXME/HACK/TEMP comments: ${report.todoItems.length}
- API routes detected: ${report.apiRoutes.length}
- Environment variables used: ${report.envVarsUsed.length}

## Findings

${renderFindings(report.findings)}

## API Route Signals

${renderApiRoutes(report.apiRoutes)}

## TODO Debt

${renderTodos(report.todoItems)}

## Environment Variables Used

${report.envVarsUsed.length === 0 ? "No process.env usage detected." : report.envVarsUsed.map((envVar) => `- \`${envVar}\``).join("\n")}

## Notes

Repo Steward v1 uses deterministic checks only. These findings are maintenance signals, not absolute judgments.
`;
}

export function renderPrComment(report: HealthReport): string {
  return `## Repo Steward Check

Generated: ${report.generatedAt}

### Summary

- Changed files: ${report.changedFiles?.length ?? 0}
- Findings: ${report.findings.length}
- TODO/FIXME/HACK/TEMP comments in repo: ${report.todoItems.length}
- API routes detected: ${report.apiRoutes.length}

### Findings

${renderFindings(report.findings)}

### Changed Files

${report.changedFiles?.map((file) => `- \`${file}\``).join("\n") || "No changed files detected."}

---

Repo Steward v1 uses deterministic checks only. Treat this as a maintenance checklist, not a human review replacement.
`;
}
