import type { CopyMessage } from './messages';

const OFFSCREEN_PATH = '/offscreen.html';

let creating: Promise<void> | null = null;

/**
 * Service workers have no clipboard access, and writing from the page fails when
 * it isn't focused (e.g. right after clicking the toolbar icon). The offscreen
 * document is Chrome's recommended way to copy from an MV3 extension.
 * Without user activation there, `execCommand('copy')` also needs the
 * `clipboardWrite` permission.
 */
export async function writeClipboard(text: string): Promise<void> {
  await ensureOffscreenDocument();
  const message: CopyMessage = { type: 'pr-clip:copy', text };
  const copied: unknown = await browser.runtime.sendMessage(message);
  if (copied !== true) throw new Error('The clipboard rejected the write.');
}

async function ensureOffscreenDocument(): Promise<void> {
  const url = browser.runtime.getURL(OFFSCREEN_PATH);
  const existing = await browser.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [url],
  });
  if (existing.length > 0) return;

  creating ??= browser.offscreen
    .createDocument({
      url,
      reasons: ['CLIPBOARD'],
      justification: 'Write the formatted pull request message to the clipboard.',
    })
    .finally(() => {
      creating = null;
    });
  await creating;
}
