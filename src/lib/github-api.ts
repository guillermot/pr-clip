import type { PrDetails, PrRef } from '@/types';

export class GitHubApiError extends Error {
  constructor(readonly status: number) {
    super(`GitHub API responded with ${String(status)}`);
    this.name = 'GitHubApiError';
  }

  /** Private repos answer 404 without a token; 401/403 cover bad tokens and rate limits. */
  get needsToken(): boolean {
    return [401, 403, 404].includes(this.status);
  }
}

interface PullResponse {
  title: string;
  additions: number;
  deletions: number;
}

/**
 * Fetches PR details from the REST API. The API allows CORS from any origin,
 * so no host permission is needed. The token is only required for private repos.
 */
export async function fetchPrDetails(
  { owner, repo, number }: PrRef,
  token: string | null,
  fetchFn: typeof fetch = fetch,
): Promise<PrDetails> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const path = [owner, repo, 'pulls', String(number)].map(encodeURIComponent).join('/');
  const response = await fetchFn(`https://api.github.com/repos/${path}`, { headers });
  if (!response.ok) throw new GitHubApiError(response.status);

  const { title, additions, deletions } = (await response.json()) as PullResponse;
  return { title, additions, deletions };
}
