# Implementation Checklist

Use this to install Repo Steward in a target repo.

## 1. Copy files

Copy the following into your target repo:

```txt
.github/workflows/repo-steward-health.yml
.github/workflows/repo-steward-pr.yml
src/
maintainer.config.json
docs/
```

If the target repo already has a `package.json`, merge the scripts and devDependencies from this scaffold instead of replacing the file.

## 2. Add npm scripts

```json
{
  "scripts": {
    "steward:health": "tsx src/run-health.ts",
    "steward:pr": "tsx src/run-pr-check.ts"
  },
  "devDependencies": {
    "@types/node": "^22.15.3",
    "tsx": "^4.19.4",
    "typescript": "^5.8.3"
  }
}
```

## 3. Install dependencies

```bash
npm install
```

## 4. Run locally

```bash
npm run steward:health
```

Check:

```txt
reports/repo-health.md
```

## 5. Open a PR

The PR workflow should post a Repo Steward comment.

If it does not, check:

- GitHub Actions is enabled
- Workflow permissions allow issue comments
- PR is not from a fork with restricted token permissions
- `permissions` block includes `issues: write`

## 6. Tune the config

Edit:

```txt
maintainer.config.json
```

Good things to customize:

- `riskFilePatterns`
- `apiRoutePatterns`
- `architectureRelevantPatterns`
- `allowedUndocumentedEnvVars`
- `maxFileLines`
