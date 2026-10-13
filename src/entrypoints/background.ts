import { flashBadge } from '@/lib/badge';
import { writeClipboard } from '@/lib/clipboard';
import { copyPr, type CopyPrResult } from '@/lib/copy-pr';
import { extractPr } from '@/lib/extract-pr';
import { fetchPrDetails } from '@/lib/github-api';
import { t, type MessageKey } from '@/lib/i18n';
import { githubTokenSetting, templateSetting } from '@/lib/settings';

const ERROR_MESSAGES: Record<Exclude<CopyPrResult, { ok: true }>['reason'], MessageKey> = {
  'not-a-pr': 'errorNotAPr',
  'details-not-found': 'errorDetailsNotFound',
  'needs-token': 'errorNeedsToken',
  'copy-failed': 'errorCopyFailed',
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
    fetchDetails: async (ref) => fetchPrDetails(ref, await githubTokenSetting.getValue()),
    getTemplate: () => templateSetting.getValue(),
    writeClipboard,
  });

  if (tab.id === undefined) return;
  await (result.ok
    ? flashBadge(tab.id, 'success', t('badgeCopied', result.text))
    : flashBadge(tab.id, 'error', t(ERROR_MESSAGES[result.reason])));
}
