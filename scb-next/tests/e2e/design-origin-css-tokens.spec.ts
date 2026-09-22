import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const packageRoot = new URL('../../packages/ratan-design-origin/', import.meta.url);
const globalCss = readFileSync(new URL('assets/tokens.css', packageRoot), 'utf8');
const scopedCss = readFileSync(new URL('assets/styles.css', packageRoot), 'utf8');

test('plain application CSS inherits tokens and updates with every document appearance', async ({
  page,
}) => {
  await page.setContent(`
    <style>
      .card { background: var(--theme-color-body-background); }
      .webkit { color: var(--sc-layout-text-color); padding: var(--sc-spacing-16);
        border-radius: var(--sc-radius-md); background: var(--sc-panel-background-color); }
    </style>
    <main><article class="card">Application card</article><div class="webkit">WebKit</div></main>
    <aside class="card">Body overlay</aside>
  `);
  await page.addStyleTag({ content: globalCss });
  const cards = page.locator('.card');
  await expect(cards.first()).toHaveCSS('background-color', 'rgba(242, 242, 242, 0.5)');
  await expect(page.locator('.webkit')).toHaveCSS('padding', '16px');
  await expect(page.locator('.webkit')).toHaveCSS('border-radius', '8px');
  await expect(page.locator('.webkit')).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  for (const [generation, mode, background] of [
    ['webkit', 'dark', 'rgb(26, 26, 26)'],
    ['webkit', 'light', 'rgba(242, 242, 242, 0.5)'],
    ['legacy', 'dark', 'rgb(51, 51, 51)'],
    ['legacy', 'light', 'rgb(247, 249, 253)'],
  ]) {
    await page.locator('html').evaluate(
      (root, appearance) => {
        root.setAttribute('data-generation', appearance.generation);
        root.setAttribute('data-mode', appearance.mode);
      },
      { generation, mode },
    );
    for (const card of await cards.all())
      await expect(card).toHaveCSS('background-color', background);
  }
  await page.locator('html').evaluate((root) => {
    root.removeAttribute('data-generation');
    root.removeAttribute('data-mode');
  });
  await expect(cards.first()).toHaveCSS('background-color', 'rgba(242, 242, 242, 0.5)');
});

test('responsive tokens and provider scopes remain live alongside global tokens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.setContent(`
    <style>
      .responsive { display: var(--sc-data-view-col-display, flex); }
      .surface { background: var(--sc-panel-background-color); }
    </style>
    <div class="responsive">Responsive layout</div>
    <div class="surface" id="global">Global light</div>
    <div class="ratan-design-root" data-generation="webkit" data-mode="dark">
      <div class="surface" id="scoped">Scoped dark</div>
    </div>
  `);
  // Load global CSS last to prove it cannot override declarations in provider roots.
  await page.addStyleTag({ content: scopedCss });
  await page.addStyleTag({ content: globalCss });
  await expect(page.locator('#global')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#scoped')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(page.locator('.responsive')).toHaveCSS('display', 'flex');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.responsive')).toHaveCSS('display', 'block');
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(page.locator('.responsive')).toHaveCSS('display', 'flex');
  await page.addStyleTag({ content: ':root { --sc-panel-background-color: rebeccapurple; }' });
  await expect(page.locator('#global')).toHaveCSS('background-color', 'rgb(102, 51, 153)');
});
