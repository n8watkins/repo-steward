import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { MaintainerConfig } from "../types.js";

const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".md", ".yml", ".yaml", ".env", ".txt",
  ".css", ".scss", ".html"
]);

export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "");
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function readTextSafe(path: string): string {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

export function shouldIgnore(path: string, config: MaintainerConfig): boolean {
  const normalized = normalizePath(path);
  return config.ignorePaths.some((ignore) => {
    const candidate = normalizePath(ignore);
    return normalized === candidate || normalized.startsWith(candidate + "/");
  });
}

export function isLikelyTextFile(path: string): boolean {
  const normalized = normalizePath(path);
  if (normalized.endsWith(".env.example")) return true;
  const dotIndex = normalized.lastIndexOf(".");
  if (dotIndex === -1) return false;
  return TEXT_EXTENSIONS.has(normalized.slice(dotIndex));
}

export function walkFiles(startDirs: string[], config: MaintainerConfig): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    if (!existsSync(dir) || shouldIgnore(dir, config)) return;

    const stat = statSync(dir);
    if (stat.isFile()) {
      const normalized = normalizePath(relative(process.cwd(), dir));
      if (!shouldIgnore(normalized, config) && isLikelyTextFile(normalized)) {
        results.push(normalized);
      }
      return;
    }

    if (!stat.isDirectory()) return;

    for (const entry of readdirSync(dir)) {
      walk(join(dir, entry));
    }
  }

  for (const dir of startDirs) {
    walk(dir);
  }

  return Array.from(new Set(results)).sort();
}

function escapeRegexChar(char: string): string {
  return /[.+^${}()|[\]\\]/.test(char) ? "\\" + char : char;
}

export function globToRegex(pattern: string): RegExp {
  const normalized = normalizePath(pattern);
  let regex = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const nextChar = normalized[index + 1];

    if (char === "*" && nextChar === "*") {
      regex += ".*";
      index += 1;
    } else if (char === "*") {
      regex += "[^/]*";
    } else {
      regex += escapeRegexChar(char);
    }
  }

  return new RegExp("^" + regex + "$");
}

export function matchesAny(path: string, patterns: string[]): boolean {
  const normalized = normalizePath(path);
  return patterns.some((pattern) => globToRegex(pattern).test(normalized));
}

export function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}
