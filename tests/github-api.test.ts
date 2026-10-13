import { describe, expect, it, vi } from 'vitest';
import { fetchPrDetails, GitHubApiError } from '@/lib/github-api';

const REF = { owner: 'acme', repo: 'widgets', number: 42 };

function mockFetch(status: number, body: unknown = {}) {
  return vi.fn<typeof fetch>(() => Promise.resolve(Response.json(body, { status })));
}

describe('fetchPrDetails', () => {
  it('returns title, additions and deletions', async () => {
    const fetchFn = mockFetch(200, { title: 'Add dark mode', additions: 7, deletions: 3, id: 1 });
    expect(await fetchPrDetails(REF, null, fetchFn)).toEqual({
      title: 'Add dark mode',
      additions: 7,
      deletions: 3,
    });

    const [url, init] = fetchFn.mock.calls[0] ?? [];
    expect(url).toBe('https://api.github.com/repos/acme/widgets/pulls/42');
    expect(init?.headers).not.toHaveProperty('Authorization');
  });

  it('sends the token when provided', async () => {
    const fetchFn = mockFetch(200, { title: 't', additions: 0, deletions: 0 });
    await fetchPrDetails(REF, 'github_pat_123', fetchFn);
    expect(fetchFn.mock.calls[0]?.[1]?.headers).toHaveProperty(
      'Authorization',
      'Bearer github_pat_123',
    );
  });

  it('throws GitHubApiError on non-2xx responses', async () => {
    const error = await fetchPrDetails(REF, null, mockFetch(404)).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error).toMatchObject({ status: 404, needsToken: true });
  });

  it('does not ask for a token on server errors', () => {
    expect(new GitHubApiError(502).needsToken).toBe(false);
  });
});
