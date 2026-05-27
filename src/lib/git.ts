import { execFileSync } from "node:child_process";
import { normalizePath } from "./file-utils.js";

export function getChangedFilesFromGit(): string[] {
  const baseRef = process.env.BASE_REF;

  const args = baseRef
    ? ["diff", "--name-only", `${baseRef}...HEAD`]
    : ["diff", "--name-only", "HEAD~1...HEAD"];

  try {
    const output = execFileSync("git", args, { encoding: "utf8" });
    return output
      .split(/\r?\n/)
      .map((line) => normalizePath(line.trim()))
      .filter(Boolean)
      .sort();
  } catch (error) {
    console.warn("Could not determine changed files with git diff:", error);
    return [];
  }
}
