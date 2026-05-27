import { loadConfig } from "./lib/config.js";
import { getChangedFilesFromGit } from "./lib/git.js";
import { postPrComment } from "./lib/github.js";
import { checkEnvVars } from "./checks/env-vars.js";
import { checkTodos } from "./checks/todos.js";
import { checkApiRoutes } from "./checks/api-routes.js";
import { checkDocsDrift } from "./checks/docs-drift.js";
import { checkPackageJson } from "./checks/package-json.js";
import { renderPrComment } from "./report/markdown.js";
import type { HealthReport } from "./types.js";

const config = loadConfig();
const changedFiles = getChangedFilesFromGit();

const envResult = checkEnvVars(config);
const todoResult = checkTodos(config);
const apiResult = checkApiRoutes(config);

const findings = [
  ...checkDocsDrift(config, changedFiles),
  ...checkPackageJson(config),
  ...envResult.findings,
  ...apiResult.findings,
  ...todoResult.findings
];

const report: HealthReport = {
  generatedAt: new Date().toISOString(),
  findings,
  todoItems: todoResult.todoItems,
  apiRoutes: apiResult.apiRoutes,
  envVarsUsed: envResult.envVarsUsed,
  changedFiles
};

await postPrComment(renderPrComment(report));

if (findings.some((finding) => finding.severity === "high")) {
  console.log("High-severity maintainer findings found.");
} else {
  console.log(`Repo Steward PR check completed with ${findings.length} findings.`);
}
