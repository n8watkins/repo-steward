export type Severity = "info" | "low" | "medium" | "high";

export interface MaintainerConfig {
  projectType: string;
  sourceDirs: string[];
  ignorePaths: string[];
  docsFiles: string[];
  docsPathPatterns: string[];
  apiRoutePatterns: string[];
  architectureRelevantPatterns: string[];
  riskFilePatterns: string[];
  todoKeywords: string[];
  requiredPackageScripts: string[];
  maxFileLines: {
    component: number;
    apiRoute: number;
    default: number;
  };
  allowedUndocumentedEnvVars: string[];
  aiProviderKeywords: string[];
  guardrailKeywords: string[];
}

export interface Finding {
  type: string;
  severity: Severity;
  title: string;
  message: string;
  file?: string;
  line?: number;
}

export interface TodoItem {
  keyword: string;
  file: string;
  line: number;
  text: string;
}

export interface ApiRouteSignal {
  file: string;
  hasValidationSignal: boolean;
  hasErrorHandlingSignal: boolean;
  hasAuthSignal: boolean;
  hasAiProviderSignal: boolean;
  hasGuardrailSignal: boolean;
  lineCount: number;
}

export interface HealthReport {
  generatedAt: string;
  findings: Finding[];
  todoItems: TodoItem[];
  apiRoutes: ApiRouteSignal[];
  envVarsUsed: string[];
  changedFiles?: string[];
}
