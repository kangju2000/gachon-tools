import { expect, test } from './fixtures.js';

test('popup page test', async ({ page, extensionId }) => {
  console.log(`chrome-extension://${extensionId}/src/pages/popup/index.html`);
  await page.goto(`chrome-extension://${extensionId}/src/pages/popup/index.html`);

  await expect(page.locator('p')).toHaveText('가천대학교 사이버캠퍼스 확장 프로그램');
});
