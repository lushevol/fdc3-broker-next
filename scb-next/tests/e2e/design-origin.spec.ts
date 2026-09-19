import { expect, test } from '@playwright/test';

const consumerUrl = process.env.RATAN_DESIGN_CONSUMER_URL;
test.skip(!consumerUrl, 'Requires the verified independent tarball consumer');

for (const width of [390, 1280]) {
  for (const mode of ['light', 'dark']) {
    for (const generation of ['legacy', 'webkit']) {
      test(`independent controls ${width}px ${generation}/${mode}`, async ({ page }, testInfo) => {
        const errors: Error[] = [];
        page.on('pageerror', (error) => errors.push(error));
        await page.setViewportSize({ width, height: 844 });
        await page.goto(consumerUrl!);
        await page.getByLabel('Mode', { exact: true }).selectOption(mode);
        await page.getByLabel('Design', { exact: true }).selectOption(generation);
        const root = page.locator('.ratan-design-root');
        await expect(root).toHaveAttribute('data-mode', mode);
        await expect(root).toHaveCSS('color-scheme', mode);
        await page.getByRole('textbox', { name: 'Reference' }).fill('REF-123');
        await page.getByRole('combobox', { name: 'Currency' }).click();
        await expect(root.getByRole('listbox')).toBeVisible();
        await page.getByRole('option', { name: 'SGD' }).click();
        await expect(page.getByLabel('Selected currency')).toHaveText('SGD');
        await expect(page.getByRole('textbox', { name: 'Amount' })).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        await expect(page.getByRole('textbox', { name: 'Approved by' })).toBeDisabled();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
        await expect(page.getByRole('progressbar')).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
        if (generation === 'webkit') {
          await expect(root).toHaveCSS('font-family', /SC Prosper Sans/);
          await expect(page.getByRole('button', { name: 'Submit' })).toHaveCSS(
            'background-color',
            'rgb(4, 115, 234)',
          );
          await expect(page.getByRole('button', { name: 'Submit' })).toHaveCSS('height', '32px');
          await expect(page.getByRole('textbox', { name: 'Reference' }).locator('..')).toHaveCSS(
            'height',
            '32px',
          );
          const token = await root.evaluate((element) =>
            getComputedStyle(element).getPropertyValue('--sc-layout-text-color'),
          );
          expect(token.trim()).not.toBe('');
          expect(
            await page.evaluate(() =>
              document.fonts.load('12px "Inter"').then((fonts) => fonts.length),
            ),
          ).toBeGreaterThan(0);
        } else {
          await expect(root).toHaveCSS('font-family', /Poppins/);
          await expect(page.getByRole('button', { name: 'Submit' })).toHaveCSS(
            'background-color',
            mode === 'dark' ? 'rgb(47, 130, 255)' : 'rgb(44, 63, 94)',
          );
        }
        const layout = await page.evaluate(() => ({
          width: innerWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(layout.content).toBeLessThanOrEqual(layout.width);
        const controls = await page.locator('form > div').evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom };
          }),
        );
        for (let index = 1; index < controls.length; index++)
          expect(controls[index].top).toBeGreaterThanOrEqual(controls[index - 1].bottom);
        await page.screenshot({
          path: testInfo.outputPath('controls.png'),
          fullPage: true,
        });
        expect(errors).toEqual([]);
      });
    }
  }
}

test('keyboard users can see the focused action', async ({ page }) => {
  await page.goto(consumerUrl!);
  await page.getByRole('textbox', { name: 'Amount' }).focus();
  await page.keyboard.press('Tab');
  const button = page.getByRole('button', { name: 'Submit' });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button).toHaveCSS('outline-width', '2px');
});

test('closed loading overlay releases its underlying action', async ({ page }) => {
  await page.goto(consumerUrl!);
  const target = page.getByRole('button', { name: 'Underlying overlay action' });
  const count = page.getByLabel('Underlying overlay action count');
  const overlay = page.getByTestId('consumer-loading-overlay');

  await expect(overlay).toHaveCSS('pointer-events', 'none');
  await page.getByRole('button', { name: 'Start loading overlay' }).click();
  await expect(overlay.getByRole('status')).toHaveText(/Processing overlay demo/);
  await expect(overlay).toHaveCSS('pointer-events', 'auto');
  expect(
    await target.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return document.elementFromPoint(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2,
      ) === element;
    }),
  ).toBe(false);

  await page.getByRole('button', { name: 'Finish loading' }).click();
  await expect(overlay.getByRole('status')).toHaveCount(0);
  await expect(overlay).toHaveCSS('pointer-events', 'none');
  await target.click();
  await expect(count).toHaveText('1');
  await target.focus();
  await page.keyboard.press('Enter');
  await expect(count).toHaveText('2');
});
