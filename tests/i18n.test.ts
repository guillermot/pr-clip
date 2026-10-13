import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

const LOCALES_DIR = join(import.meta.dirname, '../public/_locales');

type Messages = Record<string, { message: string; placeholders?: Record<string, unknown> }>;

function load(locale: string): Messages {
  return JSON.parse(readFileSync(join(LOCALES_DIR, locale, 'messages.json'), 'utf8')) as Messages;
}

const english = load('en');
const locales = readdirSync(LOCALES_DIR).filter((locale) => locale !== 'en');

describe.each(locales)('locale %s', (locale) => {
  const messages = load(locale);

  it('has exactly the same keys as English', () => {
    expect(Object.keys(messages).sort()).toEqual(Object.keys(english).sort());
  });

  it('keeps the same placeholders as English', () => {
    for (const [key, { placeholders }] of Object.entries(english)) {
      expect(Object.keys(messages[key]?.placeholders ?? {}), key).toEqual(
        Object.keys(placeholders ?? {}),
      );
    }
  });

  it('has no empty messages', () => {
    for (const [key, { message }] of Object.entries(messages)) {
      expect(message.trim(), key).not.toBe('');
    }
  });
});

describe('Chrome Web Store limits', () => {
  it.each(['en', ...locales])('%s: name ≤ 75 and description ≤ 132 characters', (locale) => {
    const { extName, extDescription } = load(locale);
    expect(extName?.message.length).toBeLessThanOrEqual(75);
    expect(extDescription?.message.length).toBeLessThanOrEqual(132);
  });
});

describe('localizeDocument', () => {
  it('translates text and attributes from data-i18n markers', async () => {
    const { fakeBrowser } = await import('wxt/testing/fake-browser');
    const { localizeDocument } = await import('@/lib/i18n');
    vi.spyOn(fakeBrowser.i18n, 'getMessage').mockImplementation((key: string) => `<${key}>`);

    document.body.innerHTML = `
      <h1 data-i18n="optionsTitle">fallback</h1>
      <input data-i18n-placeholder="tokenPlaceholder" data-i18n-aria-label="tokenLabel" />`;
    localizeDocument();

    expect(document.querySelector('h1')?.textContent).toBe('<optionsTitle>');
    const input = document.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('<tokenPlaceholder>');
    expect(input?.getAttribute('aria-label')).toBe('<tokenLabel>');
  });
});
