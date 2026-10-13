import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractPr } from '@/lib/extract-pr';

function loadFixture(name: string): void {
  const html = readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8');
  document.documentElement.innerHTML = new DOMParser().parseFromString(
    html,
    'text/html',
  ).documentElement.innerHTML;
}

afterEach(() => {
  document.documentElement.innerHTML = '';
});

describe('extractPr', () => {
  it('reads the React PR UI conversation tab', () => {
    loadFixture('pr-conversation.html');
    expect(extractPr()).toEqual({
      title:
        '[compiler] Remove OXC and SWC plugins in favor of them being handled by those projects',
      additions: 2724,
      deletions: 19722,
    });
  });

  it('uses the header totals, not per-file counts, on the changes tab', () => {
    loadFixture('pr-changes.html');
    expect(extractPr()).toEqual({
      title: 'Convert ReactFreshMultipleRenderer to createRoot',
      additions: 7,
      deletions: 3,
    });
  });

  it('reads the classic PR UI', () => {
    loadFixture('pr-classic.html');
    expect(extractPr()).toEqual({ title: 'Add dark mode', additions: 1024, deletions: 56 });
  });

  it('falls back to the document title and returns null counts while loading', () => {
    loadFixture('pr-loading.html');
    expect(extractPr()).toEqual({ title: 'Fix login redirect', additions: null, deletions: null });
  });

  it('returns nulls on an unrelated page', () => {
    document.title = 'GitHub';
    expect(extractPr()).toEqual({ title: null, additions: null, deletions: null });
  });

  it('is self-contained so it can be injected with chrome.scripting', () => {
    // executeScript serializes the function source; it must run without closures.
    loadFixture('pr-changes.html');
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- mimics executeScript
    const injected = new Function(`return (${extractPr.toString()})();`) as typeof extractPr;
    expect(injected()).toEqual({
      title: 'Convert ReactFreshMultipleRenderer to createRoot',
      additions: 7,
      deletions: 3,
    });
  });
});
