import type messages from '../../public/_locales/en/messages.json';

export type MessageKey = keyof typeof messages;

/** Typed wrapper around chrome.i18n; English is the source of truth for keys. */
export function t(key: MessageKey, substitutions?: string | string[]): string {
  // WXT types getMessage with one overload per key, which rejects a key union.
  const i18n = browser.i18n as { getMessage(key: string, subs?: string | string[]): string };
  return i18n.getMessage(key, substitutions);
}

/**
 * Translates static markup: `data-i18n` sets the text, `data-i18n-<attr>` sets
 * the attribute (e.g. `data-i18n-placeholder="tokenPlaceholder"`).
 */
export function localizeDocument(root: ParentNode = document): void {
  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    for (const [name, key] of Object.entries(element.dataset)) {
      if (!key) continue;
      if (name === 'i18n') {
        element.textContent = t(key as MessageKey);
      } else if (name.startsWith('i18n')) {
        const attribute = name.slice('i18n'.length).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        element.setAttribute(attribute.slice(1), t(key as MessageKey));
      }
    }
  }
}
