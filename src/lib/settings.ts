import { DEFAULT_TEMPLATE } from './template';

/** Message template; synced across the user's Chrome profiles. */
export const templateSetting = storage.defineItem<string>('sync:template', {
  fallback: DEFAULT_TEMPLATE,
});

/** Optional GitHub token for private repos. Kept in local storage: never synced. */
export const githubTokenSetting = storage.defineItem<string | null>('local:githubToken', {
  fallback: null,
});
