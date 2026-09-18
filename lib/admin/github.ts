// Reads/writes repo files via the GitHub Contents API so admin edits persist as real
// commits (Vercel's git integration then auto-deploys). Requires GITHUB_TOKEN/OWNER/REPO.
const GITHUB_API = 'https://api.github.com'

interface GithubConfig {
  owner: string
  repo: string
  token: string
  branch: string
}

function getConfig(): GithubConfig {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!owner || !repo || !token) {
    throw new Error('GitHub integration is not configured (GITHUB_OWNER / GITHUB_REPO / GITHUB_TOKEN)')
  }
  return { owner, repo, token, branch }
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

export interface GithubFile {
  content: string
  sha: string
}

export async function getFile(path: string): Promise<GithubFile | null> {
  const { owner, repo, token, branch } = getConfig()
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub read failed for ${path}: ${res.status} ${await res.text()}`)

  const json = await res.json()
  const content = Buffer.from(json.content, 'base64').toString('utf-8')
  return { content, sha: json.sha }
}

export async function putFile(path: string, content: string, message: string, sha?: string): Promise<string> {
  const { owner, repo, token, branch } = getConfig()
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch,
      sha,
    }),
  })
  if (!res.ok) {
    if (res.status === 409) throw new Error('This file changed since you loaded it. Please refresh and try again.')
    throw new Error(`GitHub write failed for ${path}: ${res.status} ${await res.text()}`)
  }
  const json = await res.json()
  return json.content.sha as string
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  const { owner, repo, token, branch } = getConfig()
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch }),
  })
  if (!res.ok) throw new Error(`GitHub delete failed for ${path}: ${res.status} ${await res.text()}`)
}
