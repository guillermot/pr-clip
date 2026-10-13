import { describe, expect, it } from 'vitest';
import { canonicalPrUrl, parsePrUrl } from '@/lib/pr-url';

describe('parsePrUrl', () => {
  const expected = { owner: 'facebook', repo: 'react', number: 123 };

  it.each([
    'https://github.com/facebook/react/pull/123',
    'https://github.com/facebook/react/pull/123/',
    'https://github.com/facebook/react/pull/123/files',
    'https://github.com/facebook/react/pull/123/commits/abc123',
    'https://github.com/facebook/react/pull/123?w=1#discussion_r1',
  ])('parses %s', (url) => {
    expect(parsePrUrl(url)).toEqual(expected);
  });

  it.each([
    undefined,
    '',
    'not a url',
    'chrome://extensions',
    'http://github.com/facebook/react/pull/123',
    'https://gist.github.com/facebook/react/pull/123',
    'https://github.com/facebook/react',
    'https://github.com/facebook/react/pulls',
    'https://github.com/facebook/react/issues/123',
    'https://github.com/facebook/react/pull/abc',
    'https://github.com/facebook/react/pull/123abc',
  ])('rejects %s', (url) => {
    expect(parsePrUrl(url)).toBeNull();
  });
});

describe('canonicalPrUrl', () => {
  it('builds the conversation URL', () => {
    expect(canonicalPrUrl({ owner: 'facebook', repo: 'react', number: 123 })).toBe(
      'https://github.com/facebook/react/pull/123',
    );
  });
});
