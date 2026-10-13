import type { PrData } from '@/types';
import { canonicalPrUrl } from './pr-url';

export const DEFAULT_TEMPLATE = ':github: `+{added} -{removed}` [{title}]({url})';

export const PLACEHOLDERS = [
  'title',
  'url',
  'added',
  'removed',
  'repo',
  'owner',
  'number',
] as const;

/** Example PR used to preview templates. */
export const SAMPLE_PR: PrData = {
  owner: 'acme',
  repo: 'widgets',
  number: 42,
  title: 'Add dark mode to the settings page',
  additions: 120,
  deletions: 30,
};

export type Placeholder = (typeof PLACEHOLDERS)[number];

function isPlaceholder(key: string): key is Placeholder {
  return (PLACEHOLDERS as readonly string[]).includes(key);
}

export function placeholderValues(pr: PrData): Record<Placeholder, string> {
  return {
    title: pr.title,
    url: canonicalPrUrl(pr),
    added: String(pr.additions),
    removed: String(pr.deletions),
    repo: `${pr.owner}/${pr.repo}`,
    owner: pr.owner,
    number: String(pr.number),
  };
}

/**
 * Replaces `{placeholder}` tokens with values from the PR.
 * Unknown tokens are left untouched so typos are visible in the output.
 */
export function renderTemplate(template: string, pr: PrData): string {
  const values = placeholderValues(pr);
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    isPlaceholder(key) ? values[key] : token,
  );
}
