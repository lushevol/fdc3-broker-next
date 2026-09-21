import { expect, test, type Locator } from '@playwright/test';

const consumerUrl = process.env.RATAN_DESIGN_CONSUMER_URL;
test.skip(!consumerUrl, 'Requires the verified independent tarball consumer');

async function measuredContrast(
  locator: Locator,
  options: {
    property?: 'color' | 'outlineColor';
    pseudo?: '::placeholder';
    outside?: boolean;
  } = {},
) {
  return locator.evaluate((element, { property = 'color', pseudo, outside = false }) => {
    const parseColor = (value: string) => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0, channels[3] ?? 1];
    };
    const composite = (foreground: number[], background: number[]) => {
      const alpha = foreground[3];
      return foreground.slice(0, 3).map((channel, index) =>
        channel * alpha + background[index] * (1 - alpha),
      );
    };
    const backgroundAt = (start: Element | null): number[] => {
      let current = start;
      const layers: number[][] = [];
      while (current) {
        const color = parseColor(getComputedStyle(current).backgroundColor);
        if (color[3] > 0) layers.push(color);
        if (color[3] >= 1) break;
        current = current.parentElement;
      }
      let result = [255, 255, 255];
      for (const layer of layers.reverse()) result = composite(layer, result);
      return result;
    };
    const luminance = (color: number[]) => {
      const [red, green, blue] = color.slice(0, 3).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const style = getComputedStyle(element, pseudo);
    const background = backgroundAt(outside ? element.parentElement : element);
    const foreground = parseColor(style[property]);
    foreground[3] *= Number(style.opacity || 1);
    const renderedForeground = composite(foreground, background);
    const values = [luminance(renderedForeground), luminance(background)].sort(
      (left, right) => right - left,
    );
    return (values[0] + 0.05) / (values[1] + 0.05);
  }, options);
}

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
        const reference = page.getByRole('textbox', { name: 'Reference' });
        await expect
          .poll(() => measuredContrast(reference, { pseudo: '::placeholder' }), {
            message: 'placeholder must meet WCAG 2.2 SC 1.4.3 after its theme transition',
          })
          .toBeGreaterThanOrEqual(4.5);
        await reference.focus();
        const referenceControl = reference.locator('..');
        await expect(referenceControl).toHaveCSS('outline-style', 'solid');
        await expect(referenceControl).toHaveCSS('outline-width', '2px');
        expect(
          await measuredContrast(referenceControl, {
            property: 'outlineColor',
            outside: true,
          }),
          'input focus indicator must meet WCAG 2.2 SC 1.4.11',
        ).toBeGreaterThanOrEqual(3);
        await reference.fill('REF-123');
        await page.getByRole('combobox', { name: 'Currency' }).click();
        await expect(root.getByRole('listbox')).toBeVisible();
        await page.getByRole('option', { name: 'SGD' }).click();
        await expect(page.getByLabel('Selected currency')).toHaveText('SGD');
        await expect(page.getByRole('textbox', { name: 'Amount' })).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        expect(
          await measuredContrast(page.getByText('Enter a positive amount')),
          'error helper text must meet WCAG 2.2 SC 1.4.3',
        ).toBeGreaterThanOrEqual(4.5);
        await expect(page.getByRole('textbox', { name: 'Approved by' })).toBeDisabled();
        const submit = page.getByRole('button', { name: 'Submit', exact: true });
        await submit.click();
        await expect(submit).toBeDisabled();
        await expect(submit.locator('[role="progressbar"][aria-hidden="true"]')).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
        if (generation === 'webkit') {
          const resolveToken = (name: string) =>
            root.evaluate((element, tokenName) => {
              const probe = document.createElement('span');
              probe.style.color = `var(${tokenName})`;
              element.append(probe);
              const value = getComputedStyle(probe).color;
              probe.remove();
              return value;
            }, name);
          const searchAction = page.getByTestId('search-action');
          const searchError = page.getByTestId('search-error');
          const loadingSearch = page.getByRole('button', { name: 'Search trades' });
          const resetAction = page.getByTestId('reset-action');
          const resetError = page.getByTestId('reset-error');
          const resetDisabled = page.getByTestId('reset-disabled');
          const toggleAction = page.getByTestId('toggle-action');
          const toggleSelected = page.getByTestId('toggle-selected');

          await expect(searchAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-background-color'),
          );
          await searchAction.hover();
          await expect(searchAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-hover-background-color'),
          );
          const searchBox = await searchAction.boundingBox();
          expect(searchBox).not.toBeNull();
          await page.mouse.move(
            searchBox!.x + searchBox!.width / 2,
            searchBox!.y + searchBox!.height / 2,
          );
          await page.mouse.down();
          await expect(searchAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-press-background-color'),
          );
          await page.mouse.up();
          await submit.focus();
          await page.keyboard.press('Tab');
          await expect(searchAction).toBeFocused();
          await expect(searchAction).toHaveCSS(
            'outline-color',
            await resolveToken('--sc-focus-ring-color'),
          );
          expect(
            await measuredContrast(searchAction, {
              property: 'outlineColor',
              outside: true,
            }),
            'button focus indicator must meet WCAG 2.2 SC 1.4.11',
          ).toBeGreaterThanOrEqual(3);
          await expect(loadingSearch).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-disabled-background-color'),
          );
          await expect(searchError).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-error-background-color'),
          );
          await searchError.hover();
          await expect(searchError).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-primary-error-hover-background-color'),
          );

          await expect(resetAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-background-color'),
          );
          await resetAction.hover();
          await expect(resetAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-hover-background-color'),
          );
          await expect(resetDisabled).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-disabled-background-color'),
          );
          await expect(resetError).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-error-background-color'),
          );
          await expect(toggleAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-background-color'),
          );
          await toggleAction.hover();
          await expect(toggleAction).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-hover-background-color'),
          );
          await expect(toggleSelected).toHaveCSS(
            'background-color',
            await resolveToken('--sc-button-secondary-select-background-color'),
          );
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
          await expect(page.getByTestId('search-action')).toHaveCSS(
            'background-color',
            'rgb(44, 63, 94)',
          );
          await expect(page.getByTestId('reset-action')).toHaveCSS(
            'background-color',
            mode === 'dark' ? 'rgb(41, 49, 58)' : 'rgb(237, 237, 237)',
          );
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

for (const mode of ['light', 'dark']) {
  test(`legacy portal grid exposes keyboard focus in ${mode} mode`, async ({ page }) => {
    await page.goto(`${consumerUrl!.replace(/\/$/, '')}/portal.html`);
    await page.getByLabel('Portal mode').click();
    await page.getByRole('option', { name: mode, exact: true }).click();

    const symbolHeader = page.getByRole('columnheader', { name: 'Symbol' });
    const quantityHeader = page.getByRole('columnheader', { name: 'Quantity' });
    await symbolHeader.focus();
    await page.keyboard.press('ArrowRight');
    await expect(quantityHeader).toBeFocused();
    await expect(quantityHeader).toHaveCSS('outline-style', 'solid');
    await expect(quantityHeader).toHaveCSS('outline-width', '2px');
    expect(
      await measuredContrast(quantityHeader, {
        property: 'outlineColor',
        outside: true,
      }),
      'grid header focus indicator must meet WCAG 2.2 SC 1.4.11',
    ).toBeGreaterThanOrEqual(3);

    const symbolCell = page.locator('.MuiDataGrid-cell[data-field="symbol"]').first();
    const quantityCell = page.locator('.MuiDataGrid-cell[data-field="quantity"]').first();
    await symbolCell.focus();
    await page.keyboard.press('ArrowRight');
    await expect(quantityCell).toBeFocused();
    await expect(quantityCell).toHaveCSS('outline-style', 'solid');
    await expect(quantityCell).toHaveCSS('outline-width', '2px');
    expect(
      await measuredContrast(quantityCell, {
        property: 'outlineColor',
        outside: true,
      }),
      'grid cell focus indicator must meet WCAG 2.2 SC 1.4.11',
    ).toBeGreaterThanOrEqual(3);
  });
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

  await expect(page.getByRole('button', { name: 'Clear disabled trade search' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Clear read-only trade search' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Disabled trade search' })).toHaveValue('Locked');
  await expect(page.getByRole('textbox', { name: 'Read-only trade search' })).toHaveValue(
    'Retained',
  );

  expect(
    await page
      .locator('button')
      .evaluateAll(
        (buttons) =>
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
    await page.locator('[role="combobox"], select').evaluateAll(
      (comboboxes) =>
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
      return (
        document.elementFromPoint(
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2,
        ) === element
      );
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
