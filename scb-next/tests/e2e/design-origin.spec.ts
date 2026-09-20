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
        const submit = page.getByRole('button', { name: 'Submit', exact: true });
        await submit.click();
        await expect(submit).toBeDisabled();
        await expect(submit.locator('[role="progressbar"][aria-hidden="true"]')).toBeVisible();
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
          const responsiveTokens = await root.evaluate((element) => {
            const styles = getComputedStyle(element);
            return {
              buttonWidth: styles.getPropertyValue('--sc-button-width').trim(),
              fontSize: styles.getPropertyValue('--sc-font-size').trim(),
              mode: styles.getPropertyValue('--sc-mode').trim(),
            };
          });
          expect(responsiveTokens).toEqual({
            buttonWidth: width === 390 ? '100%' : '',
            fontSize: '1rem',
            mode,
          });
          const tokenSurface = page.getByText('Payment review');
          await expect(tokenSurface).toHaveCSS('font-size', '16px');
          await expect(tokenSurface).toHaveCSS(
            'box-shadow',
            mode === 'dark' ? /rgb\(2, 57, 117\)/ : /rgb\(129, 185, 244\)/,
          );
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

test('search clear action is named and follows editable field state', async ({ page }) => {
  await page.goto(consumerUrl!);
  const field = page.getByRole('textbox', { name: 'Trade search', exact: true });
  const clear = page.getByRole('button', { name: 'Clear trade search' });

  await field.fill('cashflow');
  await clear.click();
  await expect(field).toHaveValue('');

  await field.fill('settlement');
  await clear.focus();
  await page.keyboard.press('Enter');
  await expect(field).toHaveValue('');
  await expect(clear).toBeFocused();

  await expect(
    page.getByRole('button', { name: 'Clear disabled trade search' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Clear read-only trade search' }),
  ).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Disabled trade search' })).toHaveValue('Locked');
  await expect(page.getByRole('textbox', { name: 'Read-only trade search' })).toHaveValue('Retained');

  expect(
    await page.locator('button').evaluateAll((buttons) =>
      buttons.filter(
        (button) =>
          !button.getAttribute('aria-label') &&
          !button.getAttribute('aria-labelledby') &&
          !button.textContent?.trim(),
      ).length,
    ),
  ).toBe(0);
});

test('label and native selects expose stable accessible names', async ({ page }) => {
  await page.goto(consumerUrl!);

  await expect(page.getByRole('combobox', { name: 'Group by' })).toBeVisible();
  const generated = page.getByRole('combobox', { name: 'Settlement status', exact: true });
  await expect(generated).toHaveAttribute('id', /.+/);
  await generated.selectOption('Confirmed');
  await expect(generated).toHaveValue('Confirmed');

  const explicit = page.getByRole('combobox', {
    name: 'Explicit settlement status',
    exact: true,
  });
  await expect(explicit).toHaveAttribute('id', 'explicit-settlement-status');
  await expect(page.locator('label[for="explicit-settlement-status"]')).toHaveAttribute(
    'id',
    'explicit-settlement-status-label',
  );
  expect(
    await page.locator('[role="combobox"], select').evaluateAll((comboboxes) =>
      comboboxes.filter((combobox) => {
        if (
          combobox.getAttribute('aria-label')?.trim() ||
          combobox.getAttribute('aria-labelledby')?.trim()
        ) {
          return false;
        }
        return !(
          combobox instanceof HTMLSelectElement &&
          Array.from(combobox.labels ?? []).some((label) => label.textContent?.trim())
        );
      }).length,
    ),
  ).toBe(0);
});

test('loading actions expose one consistent busy announcement', async ({ page }) => {
  await page.goto(consumerUrl!);
  const inline = page.getByRole('button', { name: 'Submit', exact: true });
  const startIcon = page.getByRole('button', { name: 'Import trades' });
  const search = page.getByRole('button', { name: 'Search trades' });

  await expect(inline).not.toHaveAttribute('aria-busy');
  await inline.click();
  await expect(inline).toBeDisabled();
  await expect(inline).toHaveAttribute('aria-busy', 'true');
  await expect(startIcon).toBeDisabled();
  await expect(startIcon).toHaveAttribute('aria-busy', 'true');
  await expect(search).toBeDisabled();
  await expect(search).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await expect(page.locator('form [role="progressbar"][aria-hidden="true"]')).toHaveCount(3);

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(inline).toBeEnabled();
  await expect(inline).not.toHaveAttribute('aria-busy');
});

for (const width of [390, 1280]) {
  test(`collapsed criteria skip clipped rows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(consumerUrl!);
    const region = page.locator('#consumer-search-criteria');
    const expand = page.getByRole('button', { name: 'Expand search criteria' });
    const visible = region.locator(':scope > [data-criterion]:not([inert])');
    const hidden = region.locator(':scope > [data-criterion][inert]');

    await expect(expand).toHaveAttribute('aria-controls', 'consumer-search-criteria');
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    expect(await visible.count()).toBeGreaterThan(0);
    expect(await hidden.count()).toBeGreaterThan(0);
    await expect(hidden.first()).toHaveAttribute('aria-hidden', 'true');

    await visible.last().focus();
    await page.keyboard.press('Tab');
    await expect(expand).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(visible.last()).toBeFocused();

    await expand.focus();
    await page.keyboard.press('Enter');
    const collapse = page.getByRole('button', { name: 'Collapse search criteria' });
    await expect(collapse).toBeFocused();
    await expect(collapse).toHaveAttribute('aria-expanded', 'true');
    await expect(hidden).toHaveCount(0);
    await page.getByRole('textbox', { name: 'Criterion note' }).fill('Retained note');
    await page.getByRole('button', { name: 'Product FX forward' }).click();
    await expect(page.getByLabel('Criterion action count')).toHaveText('1');

    await collapse.click();
    await expect(expand).toBeFocused();
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByLabel('Criterion action count')).toHaveText('1');
    await expand.click();
    await expect(page.getByRole('textbox', { name: 'Criterion note' })).toHaveValue(
      'Retained note',
    );
  });
}

test('dialog names resolve to mounted headers in the scoped portal', async ({ page }) => {
  await page.goto(consumerUrl!);

  const titledTrigger = page.getByRole('button', { name: 'Open titled dialog' });
  await titledTrigger.click();
  let dialog = page.getByRole('dialog', { name: 'Settlement details' });
  await expect(dialog).toHaveAttribute('aria-labelledby', 'consumer-settlement-title');
  await expect(page.locator('#consumer-settlement-title')).toHaveText('Settlement details');
  const close = page.getByRole('button', { name: 'Close dialog' });
  await expect(dialog.locator('xpath=..')).toBeFocused();
  await close.click();
  await expect(titledTrigger).toBeFocused();

  await page.getByRole('button', { name: 'Open custom dialog' }).click();
  dialog = page.getByRole('dialog', { name: 'Position details' });
  await expect(dialog).toHaveAttribute('aria-labelledby', 'consumer-custom-title');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Open manual dialog' }).click();
  dialog = page.getByRole('dialog', { name: 'Manually named dialog' });
  await expect(dialog).not.toHaveAttribute('aria-labelledby');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
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
