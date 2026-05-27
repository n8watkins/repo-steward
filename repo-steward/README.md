# Repo Steward

Repo Steward is a **free, deterministic GitHub Actions repo-maintenance bot**.

It does **not** call OpenAI, Claude, Gemini, Codex, GitHub Models, or any LLM API. V1 is intentionally boring: it scans your repo, compares changed files, checks patterns, and posts useful maintenance feedback.

## What it does

Repo Steward checks for:

- Environment variables used in code but missing from `.env.example`
- Possible documentation drift when important code changes but docs do not
- API routes without obvious validation/error-handling/auth keywords
- AI-provider usage without obvious cost guardrails like timeouts, rate limits, or max input length
- TODO/FIXME/HACK/TEMP debt
- Missing repo hygiene files like `README.md`, `.env.example`, and `ARCHITECTURE.md`
- Missing `lint` / `test` scripts
- Risky files touched in a PR
- Large files creeping into the codebase

## Why no AI in v1?

The goal of v1 is to be useful without any model usage or API credits.

The pattern is:

```txt
GitHub Actions
  ↓
TypeScript scanner scripts
  ↓
Deterministic findings
  ↓
Markdown report / PR comment
```

V2 can optionally add AI later as an explanation layer. See [`docs/v2-ai-outline.md`](docs/v2-ai-outline.md).

## Install in a repo

Copy these files/folders into the repo you want to monitor:

```txt
.github/workflows/repo-steward-health.yml
.github/workflows/repo-steward-pr.yml
src/
maintainer.config.json
package.json additions
```

Then install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run steward:health
npm run steward:pr
```

## GitHub Actions workflows

### Weekly/manual health report

`.github/workflows/repo-steward-health.yml`

- Runs weekly
- Can be run manually
- Generates `reports/repo-health.md`
- Commits the updated report back to the repo if it changed

### PR check

`.github/workflows/repo-steward-pr.yml`

- Runs on pull requests
- Gets changed files using `git diff`
- Posts a deterministic PR comment using `GITHUB_TOKEN`

## Cost model

V1 uses:

- GitHub Actions minutes
- The built-in `GITHUB_TOKEN`
- Node/TypeScript scripts

V1 does **not** use:

- OpenAI API
- Anthropic API
- Gemini API
- GitHub Models
- Codex API calls
- Paid third-party actions
- Artifact uploads by default
- Dependency caching by default

For the full cost breakdown, see [`docs/costs-and-limits.md`](docs/costs-and-limits.md).

## Important limitations

Repo Steward v1 is not a human reviewer and not an LLM.

It says things like:

- “Validation keyword not found”
- “Possible documentation drift”
- “Environment variable may be undocumented”

It should not say:

- “This code is insecure”
- “The architecture is wrong”
- “The docs are definitely stale”

The findings are maintenance signals, not absolute judgments.

## Recommended v1 workflow

Use Repo Steward as a checklist:

1. AI/human writes code.
2. Pull request opens.
3. Repo Steward checks deterministic maintenance signals.
4. You fix the obvious misses.
5. Human review handles judgment calls.

## Project status

This is a starter scaffold. The checks are intentionally simple so you can understand, modify, and extend them.
