export async function postPrComment(body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  if (!token || !repo || !prNumber) {
    console.log("GITHUB_TOKEN, GITHUB_REPOSITORY, or PR_NUMBER not set. Printing comment instead:\n");
    console.log(body);
    return;
  }

  const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ body })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed to post PR comment: ${response.status} ${response.statusText}`);
    console.error(text);
    console.log("\nComment body was:\n");
    console.log(body);
    process.exitCode = 1;
  }
}
