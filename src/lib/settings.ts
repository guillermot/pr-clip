import { DEFAULT_TEMPLATE } from './template';

/** Message template; synced across the user's Chrome profiles. */
export const templateSetting = storage.defineItem<string>('sync:template', {
  fallback: DEFAULT_TEMPLATE,
});
