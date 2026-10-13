import type { PrData, PrDetails, PrRef } from '@/types';
import type { ExtractedPr } from './extract-pr';
import { GitHubApiError } from './github-api';
import { parsePrUrl } from './pr-url';
import { renderTemplate } from './template';

export interface CopyPrDeps {
  extract: (tabId: number) => Promise<ExtractedPr | undefined>;
  fetchDetails: (ref: PrRef) => Promise<PrDetails>;
  getTemplate: () => Promise<string>;
  writeClipboard: (text: string) => Promise<void>;
}

export type CopyPrResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'not-a-pr' | 'details-not-found' | 'needs-token' | 'copy-failed' };

/** Builds the message for the PR open in `tab` and copies it. Never throws. */
export async function copyPr(
  tab: { id?: number | undefined; url?: string | undefined },
  deps: CopyPrDeps,
): Promise<CopyPrResult> {
  const ref = parsePrUrl(tab.url);
  if (!ref || tab.id === undefined) return { ok: false, reason: 'not-a-pr' };

  const extracted = await deps.extract(tab.id).catch(() => undefined);
  let details = completeDetails(extracted);

  // The page may still be loading, or GitHub may have changed its markup.
  if (!details) {
    try {
      const fetched = await deps.fetchDetails(ref);
      details = { ...fetched, title: extracted?.title || fetched.title };
    } catch (error) {
      const needsToken = error instanceof GitHubApiError && error.needsToken;
      return { ok: false, reason: needsToken ? 'needs-token' : 'details-not-found' };
    }
  }

  const pr: PrData = { ...ref, ...details };
  const text = renderTemplate(await deps.getTemplate(), pr);

  try {
    await deps.writeClipboard(text);
    return { ok: true, text };
  } catch {
    return { ok: false, reason: 'copy-failed' };
  }
}

function completeDetails(extracted: ExtractedPr | undefined): PrDetails | null {
  if (!extracted?.title || extracted.additions === null || extracted.deletions === null) {
    return null;
  }
  return { title: extracted.title, additions: extracted.additions, deletions: extracted.deletions };
}
