import type { ApiRouteSignal, Finding, MaintainerConfig } from "../types.js";
import { containsAny, countLines, matchesAny, readTextSafe, walkFiles } from "../lib/file-utils.js";

const VALIDATION_KEYWORDS = ["zod", "schema", "safeParse", "validate"];
const ERROR_KEYWORDS = ["try", "catch", "NextResponse.json", "Response.json", "status:"];
const AUTH_KEYWORDS = ["auth", "session", "currentUser", "getServerSession", "user"];

export function checkApiRoutes(config: MaintainerConfig): {
  findings: Finding[];
  apiRoutes: ApiRouteSignal[];
} {
  const files = walkFiles(config.sourceDirs, config);
  const routeFiles = files.filter((file) => matchesAny(file, config.apiRoutePatterns));
  const apiRoutes: ApiRouteSignal[] = [];
  const findings: Finding[] = [];

  for (const file of routeFiles) {
    const text = readTextSafe(file);
    const signal: ApiRouteSignal = {
      file,
      hasValidationSignal: containsAny(text, VALIDATION_KEYWORDS),
      hasErrorHandlingSignal: containsAny(text, ERROR_KEYWORDS),
      hasAuthSignal: containsAny(text, AUTH_KEYWORDS),
      hasAiProviderSignal: containsAny(text, config.aiProviderKeywords),
      hasGuardrailSignal: containsAny(text, config.guardrailKeywords),
      lineCount: countLines(text)
    };

    apiRoutes.push(signal);

    if (!signal.hasValidationSignal) {
      findings.push({
        type: "api-route-validation-not-detected",
        severity: "medium",
        title: "API route validation keyword not found",
        message: `${file} does not contain an obvious validation keyword such as zod, schema, safeParse, or validate.`,
        file
      });
    }

    if (!signal.hasErrorHandlingSignal) {
      findings.push({
        type: "api-route-error-handling-not-detected",
        severity: "medium",
        title: "API route error handling keyword not found",
        message: `${file} does not contain obvious error-handling/status-response keywords.`,
        file
      });
    }

    if (!signal.hasAuthSignal) {
      findings.push({
        type: "api-route-auth-not-detected",
        severity: "low",
        title: "API route auth keyword not found",
        message: `${file} does not contain an obvious auth/session/user keyword. This may be fine for public endpoints.`,
        file
      });
    }

    if (signal.hasAiProviderSignal && !signal.hasGuardrailSignal) {
      findings.push({
        type: "ai-cost-guardrails-not-detected",
        severity: "high",
        title: "AI provider usage without obvious cost guardrails",
        message: `${file} appears to reference an AI provider, but no obvious timeout, rate limit, max input, or validation guardrail keyword was found.`,
        file
      });
    }

    if (signal.lineCount > config.maxFileLines.apiRoute) {
      findings.push({
        type: "large-api-route",
        severity: "low",
        title: "Large API route file",
        message: `${file} is ${signal.lineCount} lines. Consider splitting complex logic into smaller helpers.`,
        file
      });
    }
  }

  return { findings, apiRoutes };
}
