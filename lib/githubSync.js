// lib/githubSync.js
// Direct Git Database API integration for seamless cloud persistence on Vercel and GitHub

const GITHUB_OWNER = 'alielsayed2004';
const GITHUB_REPO = 'fb-company';
const GITHUB_BRANCH = 'main';

/**
 * Validates a GitHub Personal Access Token against the repository
 */
export async function verifyGitHubToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'Token is empty' };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FB-Company-Admin'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      const hasPush = data.permissions ? data.permissions.push : true;
      return {
        valid: true,
        repoName: data.full_name,
        canPush: hasPush,
        message: hasPush ? 'Token verified with write permissions' : 'Token verified but lacks write permissions'
      };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      valid: false,
      status: res.status,
      message: errData.message || res.statusText
    };
  } catch (err) {
    return { valid: false, message: err.message };
  }
}

/**
 * Commits multiple files atomically directly to GitHub main branch
 * Works in any serverless environment (e.g. Vercel) without filesystem write access.
 * 
 * @param {Object} options
 * @param {string} options.token - GitHub Personal Access Token
 * @param {Array<{path: string, content: string, encoding?: 'utf-8'|'base64'}>} options.files - Files to create/update
 * @param {Array<string>} [options.deletedPaths] - Files to delete
 * @param {string} options.commitMessage - Commit message
 */
export async function commitFilesToGitHub({ token, files = [], deletedPaths = [], commitMessage }) {
  const cleanToken = token.trim();
  const headers = {
    'Authorization': `Bearer ${cleanToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'FB-Company-Admin',
    'Content-Type': 'application/json'
  };

  // 1. Get latest commit SHA on main branch
  const refRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`,
    { headers, cache: 'no-store' }
  );

  if (!refRes.ok) {
    const errData = await refRes.json().catch(() => ({}));
    throw new Error(`GitHub Ref Error (${refRes.status}): ${errData.message || refRes.statusText}`);
  }

  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Get the commit tree SHA
  const commitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
    { headers, cache: 'no-store' }
  );

  if (!commitRes.ok) {
    const errData = await commitRes.json().catch(() => ({}));
    throw new Error(`GitHub Commit Read Error: ${errData.message || commitRes.statusText}`);
  }

  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for each file
  const treeItems = [];

  for (const file of files) {
    const blobRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: file.encoding || 'utf-8'
        })
      }
    );

    if (!blobRes.ok) {
      const errData = await blobRes.json().catch(() => ({}));
      throw new Error(`Failed to create blob for ${file.path}: ${errData.message || blobRes.statusText}`);
    }

    const blobData = await blobRes.json();
    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });
  }

  // Add deletions if any (Git Tree API deletion uses sha: null)
  if (Array.isArray(deletedPaths)) {
    for (const delPath of deletedPaths) {
      treeItems.push({
        path: delPath,
        mode: '100644',
        type: 'blob',
        sha: null
      });
    }
  }

  // 4. Create new tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    }
  );

  if (!treeRes.ok) {
    const errData = await treeRes.json().catch(() => ({}));
    throw new Error(`GitHub Tree Error: ${errData.message || treeRes.statusText}`);
  }

  const treeData = await treeRes.json();
  const newTreeSha = treeData.sha;

  // 5. Create new commit
  const newCommitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeSha,
        parents: [latestCommitSha]
      })
    }
  );

  if (!newCommitRes.ok) {
    const errData = await newCommitRes.json().catch(() => ({}));
    throw new Error(`GitHub Commit Creation Error: ${errData.message || newCommitRes.statusText}`);
  }

  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // 6. Point main branch to new commit
  const updateRefRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommitSha,
        force: false
      })
    }
  );

  if (!updateRefRes.ok) {
    const errData = await updateRefRes.json().catch(() => ({}));
    throw new Error(`GitHub Branch Update Error: ${errData.message || updateRefRes.statusText}`);
  }

  return {
    success: true,
    commitSha: newCommitSha,
    commitUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${newCommitSha}`
  };
}
