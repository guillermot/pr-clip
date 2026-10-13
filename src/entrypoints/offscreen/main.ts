import { isCopyMessage } from '@/lib/messages';

browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isCopyMessage(message)) return;
  sendResponse(copy(message.text));
});

function copy(text: string): boolean {
  const textarea = document.querySelector('textarea');
  if (!textarea) return false;

  textarea.value = text;
  textarea.select();
  // navigator.clipboard needs a focused document, which offscreen documents never
  // are; execCommand is what Chrome's own offscreen clipboard sample uses.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const copied = document.execCommand('copy');
  textarea.value = '';
  return copied;
}
