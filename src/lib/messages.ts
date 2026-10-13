/** Sent from the background service worker to the offscreen document. */
export interface CopyMessage {
  type: 'pr-clip:copy';
  text: string;
}

export function isCopyMessage(message: unknown): message is CopyMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === 'pr-clip:copy' &&
    'text' in message &&
    typeof message.text === 'string'
  );
}
