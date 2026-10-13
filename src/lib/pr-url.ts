import type { PrRef } from '@/types';

const PR_PATH = /^\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/pull\/(?<number>\d+)(?:\/|$)/;

/**
 * Parses any github.com pull request URL, including sub-pages such as
 * `/files` or `/commits`. Returns `null` for anything that isn't a PR.
 */
export function parsePrUrl(url: string | undefined): PrRef | null {
  if (!url || !URL.canParse(url)) return null;

  const { protocol, hostname, pathname } = new URL(url);
  if (protocol !== 'https:' || hostname !== 'github.com') return null;

  const groups = PR_PATH.exec(pathname)?.groups;
  if (!groups?.owner || !groups.repo || !groups.number) return null;

  return { owner: groups.owner, repo: groups.repo, number: Number(groups.number) };
}

/** The canonical conversation URL of a PR, without sub-page, query or hash. */
export function canonicalPrUrl({ owner, repo, number }: PrRef): string {
  return `https://github.com/${owner}/${repo}/pull/${String(number)}`;
}
