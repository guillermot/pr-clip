import { flashBadge } from '@/lib/badge';
import { writeClipboard } from '@/lib/clipboard';
import { copyPr, type CopyPrResult } from '@/lib/copy-pr';
import { extractPr } from '@/lib/extract-pr';
import { templateSetting } from '@/lib/settings';

const ERROR_MESSAGES: Record<Exclude<CopyPrResult, { ok: true }>['reason'], string> = {
  'not-a-pr': 'Open a GitHub pull request to copy it.',
  'details-not-found':
    "Couldn't read the pull request details. Wait for the page to load and try again.",
  'copy-failed': "Couldn't write to the clipboard.",
};

export default defineBackground(() => {
  // Fired by both the toolbar icon and the `_execute_action` keyboard shortcut.
  browser.action.onClicked.addListener((tab) => {
    void handleClick(tab);
  });
});

async function handleClick(tab: Browser.tabs.Tab): Promise<void> {
  const result = await copyPr(tab, {
    extract: async (tabId) => {
      const [injection] = await browser.scripting.executeScript({
        target: { tabId },
        func: extractPr,
      });
      return injection?.result;
    },
    getTemplate: () => templateSetting.getValue(),
    writeClipboard,
  });

  if (tab.id === undefined) return;
  await (result.ok
    ? flashBadge(tab.id, 'success', `Copied: ${result.text}`)
    : flashBadge(tab.id, 'error', ERROR_MESSAGES[result.reason]));
}
