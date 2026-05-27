# V2 AI Outline

V2 is optional. V1 should remain useful without AI.

## Goal

Add an optional AI explanation layer on top of deterministic Repo Steward findings.

The deterministic checks remain the source of truth. AI is only used to summarize, prioritize, and explain.

## Non-goals

- AI does not write code automatically.
- AI does not auto-merge PRs.
- AI does not replace tests, linting, TypeScript, or human review.
- AI output is advisory only.
- AI is disabled by default.

## Potential V2 features

### 1. AI PR Summary

Input:

```json
{
  "changedFiles": ["src/app/api/summarize/route.ts"],
  "findings": [
    {
      "type": "missing-env-doc",
      "severity": "medium",
      "message": "GEMINI_API_KEY is used but missing from .env.example"
    }
  ]
}
```

Output:

```md
This PR adds or modifies an AI-powered API route. Before merging, document the new environment variable and confirm input/cost guardrails.
```

### 2. AI Risk Prioritization

Rank deterministic findings by likely impact:

- Security
- Cost
- Reliability
- Maintainability
- Documentation

### 3. AI TODO Issue Drafting

Turn TODO findings into better GitHub issue titles and descriptions.

### 4. AI Architecture Draft

Generate a draft `ARCHITECTURE.md` update from route/file metadata.

### 5. AI Maintainer Notes

Generate `.ai/maintainer-notes.md` with project-specific conventions for future coding sessions.

## Cost controls

V2 should include:

- `AI_ENABLED=false` by default
- Provider config required
- Budget limit setting
- Max token setting
- No full-repo prompts by default
- Only compact JSON findings sent to model by default

## Safety model

- Deterministic findings are the source of truth.
- AI can explain findings but should not invent new blocking failures.
- AI output should be clearly labeled as advisory.
- Human review remains required.
