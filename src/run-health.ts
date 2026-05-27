import { mkdirSync, writeFileSync } from "node:fs";
import { loadConfig } from "./lib/config.js";
import { checkEnvVars } from "./checks/env-vars.js";
import { checkTodos } from "./checks/todos.js";
import { checkApiRoutes } from "./checks/api-routes.js";
import { checkPackageJson } from "./checks/package-json.js";
import { checkRepoHygiene } from "./checks/repo-hygiene.js";
import { checkLargeFiles } from "./checks/large-files.js";
import { renderHealthReport } from "./report/markdown.js";
import type { HealthReport } from "./types.js";

const config = loadConfig();

const envResult = checkEnvVars(config);
const todoResult = checkTodos(config);
const apiResult = checkApiRoutes(config);

const findings = [
  ...checkRepoHygiene(config),
  ...checkPackageJson(config),
  ...envResult.findings,
  ...todoResult.findings,
  ...apiResult.findings,
  ...checkLargeFiles(config)
];

const report: HealthReport = {
  generatedAt: new Date().toISOString(),
  findings,
  todoItems: todoResult.todoItems,
  apiRoutes: apiResult.apiRoutes,
  envVarsUsed: envResult.envVarsUsed
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/repo-health.md", renderHealthReport(report), "utf8");

console.log(`Repo Steward health report generated with ${findings.length} findings.`);
