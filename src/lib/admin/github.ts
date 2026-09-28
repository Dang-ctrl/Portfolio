import "server-only";

/* Minimal GitHub REST client for the admin portal. The repo is the database:
   reads go through the contents API, writes become a single commit built with
   the git data API (blobs → tree → commit → move branch). */

const API = "https://api.github.com";

export function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "Dang-ctrl/Portfolio";
  const branch = process.env.GITHUB_BRANCH || "main";
  const api = (process.env.GITHUB_API_URL || API).replace(/\/$/, ""); // overridable for local testing
  return { token, repo, branch, api, configured: Boolean(token && process.env.ADMIN_PASSWORD) };
}

export class GitHubError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token, api } = githubConfig();
  if (!token) throw new GitHubError("GITHUB_TOKEN is not set", 500);
  const res = await fetch(`${api}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new GitHubError(body.message || `GitHub request failed (${res.status})`, res.status);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

const repoPath = (p: string) => {
  const { repo } = githubConfig();
  return `/repos/${repo}${p}`;
};

export interface RepoFile { path: string; sha: string; text: string; }

/* Read a text file from the branch, or null if it doesn't exist. */
export async function readFile(path: string): Promise<RepoFile | null> {
  const { branch } = githubConfig();
  try {
    const f = await gh<{ content: string; sha: string; path: string }>(
      repoPath(`/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`)
    );
    return { path: f.path, sha: f.sha, text: Buffer.from(f.content, "base64").toString("utf8") };
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return null;
    throw e;
  }
}

/* List the files directly inside a folder (empty if the folder doesn't exist). */
export async function listDir(path: string): Promise<{ name: string; path: string; type: string }[]> {
  const { branch } = githubConfig();
  try {
    return await gh(repoPath(`/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`));
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return [];
    throw e;
  }
}

/* Upload binary content as a git blob; returns its sha for a later commit. */
export async function createBlob(base64: string) {
  const blob = await gh<{ sha: string }>(repoPath("/git/blobs"), {
    method: "POST",
    body: JSON.stringify({ content: base64, encoding: "base64" }),
  });
  return blob.sha;
}

export type Change =
  | { path: string; content: string }   // write a text file
  | { path: string; blobSha: string }   // add a previously uploaded blob
  | { path: string; delete: true };     // remove a file

/* Apply all changes as one commit on the branch. Retries once if the branch
   moved underneath us (e.g. two saves at the same time). */
export async function commit(message: string, changes: Change[]) {
  const { branch } = githubConfig();
  if (!changes.length) throw new GitHubError("Nothing to commit", 400);

  const tree = changes.map((c) => {
    if ("content" in c) return { path: c.path, mode: "100644", type: "blob", content: c.content };
    if ("blobSha" in c) return { path: c.path, mode: "100644", type: "blob", sha: c.blobSha };
    return { path: c.path, mode: "100644", type: "blob", sha: null };
  });

  for (let attempt = 0; ; attempt++) {
    const ref = await gh<{ object: { sha: string } }>(repoPath(`/git/ref/heads/${branch}`));
    const parent = await gh<{ tree: { sha: string } }>(repoPath(`/git/commits/${ref.object.sha}`));
    const newTree = await gh<{ sha: string }>(repoPath("/git/trees"), {
      method: "POST",
      body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
    });
    const newCommit = await gh<{ sha: string; html_url: string }>(repoPath("/git/commits"), {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
    });
    try {
      await gh(repoPath(`/git/refs/heads/${branch}`), {
        method: "PATCH",
        body: JSON.stringify({ sha: newCommit.sha, force: false }),
      });
      return { sha: newCommit.sha, url: newCommit.html_url };
    } catch (e) {
      if (attempt === 0 && e instanceof GitHubError && e.status === 422) continue;
      throw e;
    }
  }
}

/* Where the admin can load images that are committed but maybe not deployed yet. */
export function rawBaseUrl() {
  const { repo, branch } = githubConfig();
  return process.env.GITHUB_RAW_URL || `https://raw.githubusercontent.com/${repo}/${branch}`;
}
