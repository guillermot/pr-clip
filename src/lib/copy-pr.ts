import type { PrData } from '@/types';
import type { ExtractedPr } from './extract-pr';
import { parsePrUrl } from './pr-url';
import { renderTemplate } from './template';

export interface CopyPrDeps {
  extract: (tabId: number) => Promise<ExtractedPr | undefined>;
  getTemplate: () => Promise<string>;
  writeClipboard: (text: string) => Promise<void>;
}

export type CopyPrResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'not-a-pr' | 'details-not-found' | 'copy-failed' };

/** Builds the message for the PR open in `tab` and copies it. Never throws. */
export async function copyPr(
  tab: { id?: number | undefined; url?: string | undefined },
  deps: CopyPrDeps,
): Promise<CopyPrResult> {
  const ref = parsePrUrl(tab.url);
  if (!ref || tab.id === undefined) return { ok: false, reason: 'not-a-pr' };

  const extracted = await deps.extract(tab.id).catch(() => undefined);
  if (!extracted?.title || extracted.additions === null || extracted.deletions === null) {
    return { ok: false, reason: 'details-not-found' };
  }

  const pr: PrData = {
    ...ref,
    title: extracted.title,
    additions: extracted.additions,
    deletions: extracted.deletions,
  };
  const text = renderTemplate(await deps.getTemplate(), pr);

  try {
    await deps.writeClipboard(text);
    return { ok: true, text };
  } catch {
    return { ok: false, reason: 'copy-failed' };
  }
}
