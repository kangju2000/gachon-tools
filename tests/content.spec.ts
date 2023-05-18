import { test as base, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(path.resolve(), './dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--headless=new`,
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

test('popup page', async ({ page, extensionId }) => {
  console.log(`chrome-extension://${extensionId}/src/pages/popup/index.html`);
  await page.goto(`chrome-extension://${extensionId}/src/pages/popup/index.html`);

  await expect(page.locator('p')).toHaveText('가천대학교 사이버캠퍼스 확장 프로그램');
});
