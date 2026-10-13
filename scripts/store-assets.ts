/**
 * Generates the Chrome Web Store images into store/assets/:
 *
 *   - promo-small-440x280.png   small promo tile
 *   - screenshot-1-hero.png     illustrated flow (1280x800)
 *   - screenshot-2-options.png  the real options page, with the built extension loaded
 *
 * Usage: pnpm store:assets  (builds the extension first)
 */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, type Page } from 'playwright';

const root = join(import.meta.dirname, '..');
const templates = join(root, 'store/templates');
const assets = join(root, 'store/assets');
const extensionDir = join(root, '.output/chrome-mv3');

async function capture(page: Page, template: string, output: string): Promise<void> {
  await page.goto(pathToFileURL(join(templates, template)).href);
  await page.screenshot({ path: join(assets, output) });
  console.log(`✔ store/assets/${output}`);
}

const browser = await chromium.launch();
const promo = await browser.newPage({ viewport: { width: 440, height: 280 } });
await capture(promo, 'promo.html', 'promo-small-440x280.png');
const hero = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await capture(hero, 'hero.html', 'screenshot-1-hero.png');
await browser.close();

// The options page needs real extension APIs, so load the built extension.
const profile = await mkdtemp(join(tmpdir(), 'pr-clip-'));
const context = await chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  viewport: { width: 1280, height: 800 },
  args: [`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`],
});
try {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  const extensionId = new URL(worker.url()).host;
  const options = await context.newPage();
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await options.locator('#preview').filter({ hasText: 'acme/widgets' }).waitFor();
  // The page is sized for a browser tab; enlarge it to fill the 1280x800 frame.
  await options.evaluate(() => {
    document.body.style.zoom = '1.25';
  });
  await options.screenshot({ path: join(assets, 'screenshot-2-options.png') });
  console.log('✔ store/assets/screenshot-2-options.png');
} finally {
  await context.close();
  await rm(profile, { recursive: true, force: true });
}
