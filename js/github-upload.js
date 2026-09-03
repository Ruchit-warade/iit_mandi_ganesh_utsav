/**
 * GitHub Auto-Upload
 *
 * Pushes image files from the dashboard straight into the repo via the
 * GitHub Contents API. The Personal Access Token is stored in the user's
 * browser localStorage only — it is NEVER baked into the public source,
 * so site visitors cannot read it.
 */

const GITHUB_REPO_OWNER = 'Ruchit-warade';
const GITHUB_REPO_NAME = 'iit_mandi_ganesh_utsav';
const TOKEN_KEY = 'gh_token';

export function getGitHubToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
}

export function setGitHubToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function hasGitHubToken() {
    return !!getGitHubToken();
}

/**
 * Upload a file to the repo at the given path (e.g. assets/images/gallery/x.jpg)
 * @param {File} file
 * @param {string} path - repo-relative path
 * @returns {Promise<string>} the path
 */
export async function uploadToGitHub(file, path) {
    const token = getGitHubToken();
    if (!token) throw new Error('GitHub token not set.');

    const base64 = await fileToBase64(file);

    const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github+json',
            },
            body: JSON.stringify({
                message: `Add ${path.split('/').pop()}`,
                content: base64,
            }),
        }
    );

    if (!res.ok) {
        let msg = `GitHub error ${res.status}`;
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { /* ignore */ }
        throw new Error(msg);
    }

    return path;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
