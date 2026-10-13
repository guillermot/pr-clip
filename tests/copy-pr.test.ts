import { describe, expect, it, vi } from 'vitest';
import { copyPr, type CopyPrDeps } from '@/lib/copy-pr';

const PR_TAB = { id: 1, url: 'https://github.com/acme/widgets/pull/42/files' };

function deps(overrides: Partial<CopyPrDeps> = {}): CopyPrDeps {
  return {
    extract: vi.fn(() =>
      Promise.resolve({ title: 'Add dark mode', additions: 120, deletions: 30 }),
    ),
    getTemplate: () => Promise.resolve('`+{added} -{removed}` [{title}]({url})'),
    writeClipboard: vi.fn(() => Promise.resolve()),
    ...overrides,
  };
}

describe('copyPr', () => {
  it('copies the rendered message', async () => {
    const d = deps();
    const result = await copyPr(PR_TAB, d);

    const text = '`+120 -30` [Add dark mode](https://github.com/acme/widgets/pull/42)';
    expect(result).toEqual({ ok: true, text });
    expect(d.extract).toHaveBeenCalledWith(1);
    expect(d.writeClipboard).toHaveBeenCalledWith(text);
  });

  it.each([
    { url: 'https://github.com/acme/widgets' },
    { url: undefined },
    { id: undefined, url: PR_TAB.url },
  ])('rejects tabs that are not a PR: %o', async (tab) => {
    const d = deps();
    expect(await copyPr({ id: 1, ...tab }, d)).toEqual({ ok: false, reason: 'not-a-pr' });
    expect(d.extract).not.toHaveBeenCalled();
  });

  it.each([
    { title: null, additions: 1, deletions: 1 },
    { title: 'x', additions: null, deletions: 1 },
    { title: 'x', additions: 1, deletions: null },
    undefined,
  ])('reports missing details: %o', async (extracted) => {
    const d = deps({ extract: () => Promise.resolve(extracted) });
    expect(await copyPr(PR_TAB, d)).toEqual({ ok: false, reason: 'details-not-found' });
    expect(d.writeClipboard).not.toHaveBeenCalled();
  });

  it('treats a failed injection as missing details', async () => {
    const d = deps({ extract: () => Promise.reject(new Error('Cannot access contents of url')) });
    expect(await copyPr(PR_TAB, d)).toEqual({ ok: false, reason: 'details-not-found' });
  });

  it('reports clipboard failures', async () => {
    const d = deps({ writeClipboard: () => Promise.reject(new Error('denied')) });
    expect(await copyPr(PR_TAB, d)).toEqual({ ok: false, reason: 'copy-failed' });
  });
});
