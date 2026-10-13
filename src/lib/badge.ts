import { t } from './i18n';

const RESET_AFTER_MS = 2500;

const STYLES = {
  success: { text: '✓', color: '#1a7f37' },
  error: { text: '!', color: '#cf222e' },
} as const;

/** Briefly shows a badge on the toolbar icon, with `title` as its tooltip. */
export async function flashBadge(
  tabId: number,
  kind: keyof typeof STYLES,
  title: string,
): Promise<void> {
  const { text, color } = STYLES[kind];
  await Promise.all([
    browser.action.setBadgeText({ tabId, text }),
    browser.action.setBadgeBackgroundColor({ tabId, color }),
    browser.action.setTitle({ tabId, title }),
  ]);

  setTimeout(() => {
    void browser.action.setBadgeText({ tabId, text: '' });
    void browser.action.setTitle({ tabId, title: t('actionTitle') });
  }, RESET_AFTER_MS);
}
