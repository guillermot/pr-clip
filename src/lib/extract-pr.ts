export interface ExtractedPr {
  title: string | null;
  additions: number | null;
  deletions: number | null;
}

/**
 * Reads the PR title and diffstat from the live GitHub page.
 *
 * Runs inside the page via `chrome.scripting.executeScript`, which serializes
 * the function: it must stay self-contained (no imports, no outer references).
 * Fields that can't be found are `null` so the caller can fall back to the API.
 */
export function extractPr(): ExtractedPr {
  const textOf = (element: Element | null): string | null => element?.textContent.trim() || null;

  // "+2,724" / "-19,722" / "−3" → number
  const parseCount = (element: Element): number | null => {
    const match = /^[+\-−]\s*([\d,]+)$/.exec(element.textContent.trim());
    return match?.[1] ? Number(match[1].replaceAll(',', '')) : null;
  };

  const firstCount = (scope: ParentNode, selector: string): number | null => {
    for (const element of scope.querySelectorAll(selector)) {
      const count = parseCount(element);
      if (count !== null) return count;
    }
    return null;
  };

  // "<title> by <author> · Pull Request #<n> · <owner>/<repo>"
  const titleFromDocument = (): string | null =>
    /^(?<title>.+) by \S+ · Pull Request #\d+ · /.exec(document.title)?.groups?.title ?? null;

  const title =
    textOf(document.querySelector('h1 .markdown-title')) ??
    textOf(document.querySelector('.js-issue-title')) ??
    titleFromDocument();

  // Most specific scope first: the PR header holds the PR-wide totals, while the
  // "Files changed" tab also renders per-file counts further down the page.
  const scopes = [
    document.querySelector('[class*="PageHeader-Navigation"]'),
    document.querySelector('[class*="PageHeader"]'),
    document.querySelector('#diffstat'),
  ].filter((scope): scope is Element => scope !== null);

  for (const scope of scopes) {
    const additions = firstCount(scope, '.fgColor-success, .color-fg-success');
    const deletions = firstCount(scope, '.fgColor-danger, .color-fg-danger');
    if (additions !== null && deletions !== null) return { title, additions, deletions };
  }

  return { title, additions: null, deletions: null };
}
