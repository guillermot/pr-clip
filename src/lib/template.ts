import type { PrData } from '@/types';
import { canonicalPrUrl } from './pr-url';

export const DEFAULT_TEMPLATE = ':github: `+{added} -{removed}` [{title}]({url})';

export const PLACEHOLDERS = {
  title: 'Pull request title',
  url: 'Link to the pull request',
  added: 'Lines added',
  removed: 'Lines removed',
  repo: 'Repository, as owner/name',
  owner: 'Repository owner (user or organization)',
  number: 'Pull request number',
} as const;

export type Placeholder = keyof typeof PLACEHOLDERS;

function isPlaceholder(key: string): key is Placeholder {
  return Object.hasOwn(PLACEHOLDERS, key);
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
