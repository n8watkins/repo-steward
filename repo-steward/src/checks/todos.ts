import type { Finding, MaintainerConfig, TodoItem } from "../types.js";
import { readTextSafe, walkFiles } from "../lib/file-utils.js";

export function checkTodos(config: MaintainerConfig): {
  findings: Finding[];
  todoItems: TodoItem[];
} {
  const files = walkFiles(config.sourceDirs, config);
  const todoItems: TodoItem[] = [];

  for (const file of files) {
    const lines = readTextSafe(file).split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const keyword of config.todoKeywords) {
        const marker = keyword + ":";
        const looseMarker = keyword;
        if (line.includes(marker) || line.includes(looseMarker)) {
          todoItems.push({
            keyword,
            file,
            line: index + 1,
            text: line.trim()
          });
          break;
        }
      }
    });
  }

  const findings: Finding[] = [];
  if (todoItems.length > 0) {
    findings.push({
      type: "todo-debt",
      severity: todoItems.length > 10 ? "medium" : "low",
      title: "TODO debt found",
      message: `Found ${todoItems.length} TODO/FIXME/HACK/TEMP maintenance comments.`
    });
  }

  return { findings, todoItems };
}
