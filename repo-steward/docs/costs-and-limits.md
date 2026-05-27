# Costs and Limits

Repo Steward v1 is designed to avoid model/API costs entirely.

## What costs money?

Potentially, only GitHub Actions usage.

Repo Steward v1 does not call any LLM API and does not require OpenAI, Anthropic, Gemini, Codex, or GitHub Models.

## Expected monthly cost

For a small personal repo, expected cost is usually **$0**.

Typical usage:

```txt
Weekly health report:
4 runs/month × ~1-2 minutes = ~4-8 minutes/month

PR checks:
20 PRs/month × ~1-2 minutes = ~20-40 minutes/month

Likely total:
~25-50 GitHub Actions minutes/month
```

That is far below the included private-repo minutes on GitHub Free.

## GitHub Actions free tier notes

As of the GitHub docs checked when this scaffold was created:

- Standard GitHub-hosted runners are free for public repositories.
- Private repositories get included monthly minutes and storage depending on account plan.
- GitHub Free includes 2,000 minutes/month, 500 MB artifact storage, and 10 GB cache storage.
- GitHub Pro includes 3,000 minutes/month, 1 GB artifact storage, and 10 GB cache storage.
- Larger runners are charged even when public repos or included quota would otherwise apply.

## How this project avoids surprise costs

Repo Steward v1:

- Uses standard `ubuntu-latest` runners
- Does not use larger runners
- Does not upload artifacts by default
- Does not enable dependency caching by default
- Does not call AI/model APIs
- Uses the built-in `GITHUB_TOKEN`
- Runs short scripts only

## GitHub API limits

The PR workflow may post one PR comment using `GITHUB_TOKEN`.

The `GITHUB_TOKEN` is automatically created by GitHub Actions for each workflow job and is scoped to the repository. For this project, the token only needs read access plus issue-comment write access for PR comments.

## Recommended billing safety settings

To stay free:

1. Keep the repo public when possible.
2. Use standard runners only.
3. Do not enable larger runners.
4. Do not upload large artifacts.
5. Avoid dependency caches unless you actually need them.
6. Do not add LLM API keys to this v1 workflow.
7. Monitor GitHub Actions usage from your GitHub billing/settings page.

## V2 cost warning

If you later enable AI summarization, issue drafting, or PR analysis through an LLM, that becomes a separate cost surface.

The safe V2 rule should be:

```txt
AI disabled by default.
AI only receives compact scanner findings.
No full repo uploads by default.
No model call unless an explicit API key/provider is configured.
```
