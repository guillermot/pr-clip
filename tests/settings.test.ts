import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { templateSetting } from '@/lib/settings';
import { DEFAULT_TEMPLATE } from '@/lib/template';

describe('templateSetting', () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it('falls back to the default template', async () => {
    expect(await templateSetting.getValue()).toBe(DEFAULT_TEMPLATE);
  });

  it('persists in sync storage', async () => {
    await templateSetting.setValue('{title} {url}');
    expect(await templateSetting.getValue()).toBe('{title} {url}');
    expect(await fakeBrowser.storage.sync.get('template')).toEqual({ template: '{title} {url}' });
  });
});
