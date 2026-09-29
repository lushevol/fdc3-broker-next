import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const assets = new URL('../../packages/ratan-design-origin/assets/', import.meta.url);
const read = (name: string) => readFileSync(new URL(name, assets), 'utf8');
const original = read('styles.css') + '\n' + read('tokens.css');
const combined = read('styles-and-tokens.css');

for (const width of [390, 1000]) {
  test(`combined tokens preserve all computed values and overrides at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.setContent(`
      <style id="tokens"></style>
      <main id="global">Global</main>
      <div class="ratan-design-root" data-generation="webkit" data-mode="dark">
        <section id="nested" class="ratan-design-root" data-generation="legacy" data-mode="light">Nested</section>
      </div>
      ${['legacy', 'webkit'].flatMap((generation) => ['light', 'dark'].map((mode) =>
        `<section id="${generation}-${mode}" class="ratan-design-root" data-generation="${generation}" data-mode="${mode}">Scoped</section>`,
      )).join('')}
      <style>:root { --sc-panel-background-color: rebeccapurple; }</style>
    `);
    for (const generation of [null, 'legacy', 'webkit']) {
      for (const mode of [null, 'light', 'dark']) {
        const values = async (css: string) => page.evaluate(({ css, generation, mode }) => {
          for (const [name, value] of [['generation', generation], ['mode', mode]]) {
            if (value === null) document.documentElement.removeAttribute(`data-${name}`);
            else document.documentElement.setAttribute(`data-${name}`, value);
          }
          document.getElementById('tokens')!.textContent = css;
          return [...document.querySelectorAll('main, section')].map((element) => {
            const styles = getComputedStyle(element);
            return Object.fromEntries([...styles].filter((name) => name.startsWith('--'))
              .sort().map((name) => [name, styles.getPropertyValue(name)]));
          });
        }, { css, generation, mode });
        const expected = await values(original);
        expect(Object.keys(expected[0]).length).toBeGreaterThan(100);
        expect(await values(combined)).toEqual(expected);
      }
    }
  });
}
