import { describe, expect, it } from 'vitest';
import { DEFAULT_TEMPLATE, PLACEHOLDERS, renderTemplate } from '@/lib/template';
import type { PrData } from '@/types';

const pr: PrData = {
  owner: 'facebook',
  repo: 'react',
  number: 123,
  title: 'Add dark mode',
  additions: 120,
  deletions: 30,
};

describe('renderTemplate', () => {
  it('renders the default template', () => {
    expect(renderTemplate(DEFAULT_TEMPLATE, pr)).toBe(
      ':github: `+120 -30` [Add dark mode](https://github.com/facebook/react/pull/123)',
    );
  });

  it('supports every placeholder', () => {
    const template = Object.keys(PLACEHOLDERS)
      .map((key) => `{${key}}`)
      .join('|');
    expect(renderTemplate(template, pr)).toBe(
      'Add dark mode|https://github.com/facebook/react/pull/123|120|30|facebook/react|facebook|123',
    );
  });

  it('replaces repeated placeholders', () => {
    expect(renderTemplate('{number} #{number}', pr)).toBe('123 #123');
  });

  it('keeps unknown placeholders and literal braces', () => {
    expect(renderTemplate('{nope} {} { title }', pr)).toBe('{nope} {} { title }');
  });

  it('does not treat object prototype keys as placeholders', () => {
    expect(renderTemplate('{constructor} {toString}', pr)).toBe('{constructor} {toString}');
  });

  it('does not expand placeholders found inside values', () => {
    expect(renderTemplate('{title}', { ...pr, title: 'Fix {url} parsing' })).toBe(
      'Fix {url} parsing',
    );
  });

  it('renders zero additions and deletions', () => {
    expect(renderTemplate('+{added} -{removed}', { ...pr, additions: 0, deletions: 0 })).toBe(
      '+0 -0',
    );
  });
});
