import { readFileSync, existsSync } from "node:fs";
import type { MaintainerConfig } from "../types.js";

const defaultConfig: MaintainerConfig = {
  projectType: "generic",
  sourceDirs: ["src", "app", "pages", "lib", "components"],
  ignorePaths: ["node_modules", ".git", ".next", "dist", "build", "coverage"],
  docsFiles: ["README.md", "ARCHITECTURE.md", ".env.example", "CHANGELOG.md"],
  docsPathPatterns: ["docs/**"],
  apiRoutePatterns: ["src/app/api/**/route.ts", "app/api/**/route.ts", "pages/api/**/*.ts"],
  architectureRelevantPatterns: ["src/app/api/**", "app/api/**", "pages/api/**", "src/lib/**", "lib/**", "middleware.ts", "package.json"],
  riskFilePatterns: ["middleware.ts", "src/lib/auth/**", "src/lib/payments/**", "src/lib/ai/**", "src/app/api/**"],
  todoKeywords: ["TODO", "FIXME", "HACK", "TEMP"],
  requiredPackageScripts: ["lint", "test"],
  maxFileLines: { component: 300, apiRoute: 200, default: 500 },
  allowedUndocumentedEnvVars: ["NODE_ENV", "CI"],
  aiProviderKeywords: ["openai", "anthropic", "gemini", "generateContent", "chat.completions", "embeddings", "claude"],
  guardrailKeywords: ["rateLimit", "rate-limit", "timeout", "AbortController", "maxLength", "maxTokens", "max input", "safeParse", "zod"]
};

export function loadConfig(): MaintainerConfig {
  const path = "maintainer.config.json";
  if (!existsSync(path)) return defaultConfig;

  const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<MaintainerConfig>;

  return {
    ...defaultConfig,
    ...parsed,
    maxFileLines: {
      ...defaultConfig.maxFileLines,
      ...parsed.maxFileLines
    }
  };
}
