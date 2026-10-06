import { mkdir, writeFile } from 'node:fs/promises';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './base-ui-parity.fixture';

const storageKey = 'portal.dev.style-preview.v1';
const evidenceDirectory = '/tmp/portal-styling-console';
const viewports = [
  { name: 'desktop', width: 1512, height: 982 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
test.setTimeout(90_000);

async function metrics(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      fontSize: parseFloat(style.fontSize),
      lineHeight: parseFloat(style.lineHeight),
      fontFamily: style.fontFamily,
      background: style.backgroundColor,
      radius: parseFloat(style.borderRadius),
      width: bounds.width,
      height: bounds.height,
    };
  });
}

async function openPortal(page: Page, theme: 'light' | 'dark', signIn = true, newStyles = true) {
  await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
  await page.addInitScript(() => {
    if (sessionStorage.getItem('styling-console-browser-initialized')) return;
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('styling-console-browser-initialized', 'true');
  });
  await page.goto(`/?show_normal_login=Y&survey=no&new-styles=${newStyles}&login-theme=${theme}`);
  if (!signIn) {
    await expect(page.getByRole('button', { name: 'Styling console', exact: true })).toBeVisible();
    return;
  }
  await page.getByLabel('Username', { exact: true }).fill('mock.cashflow');
  await page.getByLabel('Password', { exact: true }).fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(theme === 'light');
  await expect(page.getByTestId('portal-prototype-empty')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function openConsole(page: Page) {
  await page.getByRole('button', { name: 'Styling console', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Styling console', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('transform', 'none');
  return dialog;
}

async function closeConsole(dialog: Locator) {
  await dialog.getByRole('button', { name: 'Close styling console', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(
    dialog.page().getByRole('button', { name: 'Styling console', exact: true }),
  ).toBeFocused();
}

async function capture(page: Page, name: string) {
  await mkdir(evidenceDirectory, { recursive: true });
  await page.screenshot({ path: `${evidenceDirectory}/${name}.png`, fullPage: true });
}

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of viewports) {
    test(`${theme} ${viewport.name} preview changes Portal and package styles without resizing the editor`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await openPortal(page, theme);
      const empty = page.getByTestId('portal-prototype-empty');
      const baselineBody = await metrics(empty.locator('p'));
      const baselineHeading = await metrics(empty.locator('h1'));
      expect(baselineBody.fontSize).toBe(14);
      expect(baselineBody.lineHeight).toBe(20);
      expect(baselineHeading.fontSize).toBe(20);
      expect(
        await page.evaluate(() => sessionStorage.getItem('portal.dev.style-preview.v1')),
      ).toBeNull();

      const dialog = await openConsole(page);
      const editorHeading = dialog.getByRole('heading', { name: 'Styling console', exact: true });
      const fontInput = dialog.getByRole('spinbutton', { name: 'Font size (px)', exact: true });
      const previewBody = dialog.getByText('Settlement instruction', { exact: true });
      const previewCaption = dialog.getByText('Updated today', { exact: true });
      const previewSave = dialog.getByRole('button', { name: 'Save', exact: true });
      const baselineEditor = await metrics(editorHeading);
      const baselineField = await metrics(fontInput);
      const baselineEditorRadius = await fontInput.evaluate(
        (element) => getComputedStyle(element.closest('.MuiOutlinedInput-root')!).borderRadius,
      );
      const baselinePreviewBody = await metrics(previewBody);
      const baselineCaption = await metrics(previewCaption);
      const previewLabel = dialog.locator('label').filter({ hasText: /^Reference$/ });
      const baselinePreviewLabel = await metrics(previewLabel);
      const baselineButtonPixels = await previewSave.screenshot();
      await dialog
        .getByRole('button', { name: theme === 'light' ? 'Dark' : 'Light', exact: true })
        .click();
      await fontInput.fill('');
      await fontInput.pressSequentially('18');
      await fontInput.blur();
      await dialog.getByRole('spinbutton', { name: 'Radius (px)', exact: true }).fill('2');
      await dialog.getByRole('textbox', { name: 'Primary color', exact: true }).fill('#b21868');
      await dialog
        .getByRole('combobox', { name: 'Font family', exact: true })
        .selectOption('arial');
      await expect
        .poll(async () => (await metrics(previewSave)).background)
        .toBe('rgb(178, 24, 104)');
      expect((await metrics(previewSave)).radius).toBe(2);
      expect((await metrics(previewBody)).fontSize).toBeCloseTo(
        (baselinePreviewBody.fontSize * 18) / 14,
        2,
      );
      expect((await metrics(previewCaption)).fontSize).toBeCloseTo(
        (baselineCaption.fontSize * 18) / 14,
        2,
      );
      expect((await metrics(previewLabel)).fontSize).toBeCloseTo(
        (baselinePreviewLabel.fontSize * 18) / 14,
        2,
      );
      expect((await metrics(previewBody)).fontFamily).toContain('Arial');
      expect(await previewSave.screenshot()).not.toEqual(baselineButtonPixels);
      expect(await metrics(editorHeading)).toEqual(baselineEditor);
      expect(await metrics(fontInput)).toEqual(baselineField);
      expect((await metrics(empty.locator('p'))).fontSize).toBe(14);

      await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
      await expect(page.locator('html')).toHaveAttribute(
        'data-mode',
        theme === 'light' ? 'dark' : 'light',
      );
      await expect.poll(async () => (await metrics(empty.locator('p'))).fontSize).toBe(18);
      expect(await metrics(editorHeading)).toEqual(baselineEditor);
      expect(await metrics(fontInput)).toEqual(baselineField);
      expect(
        await fontInput.evaluate(
          (element) => getComputedStyle(element.closest('.MuiOutlinedInput-root')!).borderRadius,
        ),
      ).toEqual(baselineEditorRadius);
      expect((await metrics(empty.locator('p'))).lineHeight).toBeCloseTo((20 * 18) / 14, 2);
      expect((await metrics(empty.locator('h1'))).fontSize).toBeCloseTo((20 * 18) / 14, 2);
      await expect
        .poll(
          async () =>
            (await metrics(empty.getByRole('button', { name: 'Find Tile', exact: true })))
              .background,
        )
        .toBe('rgb(178, 24, 104)');
      await capture(page, `${theme}-${viewport.name}-webkit-preview`);
      await writeFile(
        `${evidenceDirectory}/${theme}-${viewport.name}-metrics.json`,
        JSON.stringify(
          {
            viewport,
            baseline: {
              editor: baselineEditor,
              field: baselineField,
              body: baselineBody,
              heading: baselineHeading,
            },
            preview: {
              editor: await metrics(editorHeading),
              field: await metrics(fontInput),
              body: await metrics(empty.locator('p')),
              heading: await metrics(empty.locator('h1')),
              packageBody: await metrics(previewBody),
              packageCaption: await metrics(previewCaption),
              packageLabel: await metrics(previewLabel),
              packageButton: await metrics(previewSave),
            },
          },
          null,
          2,
        ),
      );
      await closeConsole(dialog);
      await capture(page, `${theme}-${viewport.name}-portal-preview`);
      await openConsole(page);

      const webkitButtonPixels = await previewSave.screenshot();
      await dialog.getByRole('button', { name: 'Legacy', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('data-generation', 'legacy');
      await expect(dialog.locator('.ratan-design-root').last()).toHaveAttribute(
        'data-generation',
        'legacy',
      );
      expect(await previewSave.screenshot()).not.toEqual(webkitButtonPixels);
      expect((await metrics(previewSave)).radius).toBe(2);
      await previewSave.hover();
      await expect
        .poll(async () => (await metrics(previewSave)).background)
        .toBe('rgb(124, 16, 72)');
      await dialog.getByRole('button', { name: 'WebKit', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('data-generation', 'webkit');
      await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).uncheck();
      await expect(page.locator('html')).toHaveAttribute('data-mode', theme);
      await expect.poll(async () => (await metrics(empty.locator('p'))).fontSize).toBe(14);
      expect(await metrics(empty.locator('p'))).toEqual(baselineBody);
      expect(await metrics(empty.locator('h1'))).toEqual(baselineHeading);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      await dialog.getByRole('button', { name: 'Reset styles', exact: true }).click();
      await expect(fontInput).toHaveValue('14');
      await expect(dialog.getByRole('textbox', { name: 'Primary color', exact: true })).toHaveValue(
        '#0473ea',
      );
      await expect
        .poll(() => page.evaluate((key) => sessionStorage.getItem(key), storageKey))
        .toBeNull();
      await capture(page, `${theme}-${viewport.name}-reset`);
      await closeConsole(dialog);
      await capture(page, `${theme}-${viewport.name}-portal-default`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    });
  }
}

test('styling settings reload from separate session storage and reset restores defaults', async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await openPortal(page, 'light', false);
  let dialog = await openConsole(page);
  await dialog.getByRole('spinbutton', { name: 'Font size (px)', exact: true }).fill('18');
  await dialog.getByRole('spinbutton', { name: 'Radius (px)', exact: true }).fill('3');
  await dialog.getByRole('button', { name: 'Dark', exact: true }).click();
  await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
  const applicationStorage = await page.evaluate(() => ({
    theme: localStorage.getItem('SET_THEME'),
    workspaces: localStorage.getItem('SET_WORKSPACES'),
  }));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  dialog = await openConsole(page);
  await expect(dialog.getByRole('spinbutton', { name: 'Font size (px)', exact: true })).toHaveValue(
    '18',
  );
  await expect(dialog.getByRole('spinbutton', { name: 'Radius (px)', exact: true })).toHaveValue(
    '3',
  );
  await expect(
    dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }),
  ).toBeChecked();
  expect(
    await page.evaluate(() => ({
      theme: localStorage.getItem('SET_THEME'),
      workspaces: localStorage.getItem('SET_WORKSPACES'),
    })),
  ).toEqual(applicationStorage);
  await dialog.getByRole('button', { name: 'Reset styles', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'light');
  await expect
    .poll(() => page.evaluate((key) => sessionStorage.getItem(key), storageKey))
    .toBeNull();
  await closeConsole(dialog);
  await page.reload();
  dialog = await openConsole(page);
  await expect(dialog.getByRole('spinbutton', { name: 'Font size (px)', exact: true })).toHaveValue(
    '14',
  );
  await expect(
    dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }),
  ).not.toBeChecked();
});

test('console preserves the login, real Cashflow tile, and workspace removal workflow', async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await openPortal(page, 'light');
  const dialog = await openConsole(page);
  await dialog.getByRole('spinbutton', { name: 'Font size (px)', exact: true }).fill('16');
  await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
  await closeConsole(dialog);
  await page.getByRole('button', { name: 'Add Workspace', exact: true }).click();
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText('CF-ACCEPT-002', { exact: true })).toBeVisible();
  await capture(page, 'real-cashflow-preview');
  await page
    .getByRole('tab', { selected: true })
    .getByRole('button', { name: 'delete', exact: true })
    .click();
  await expect(page.locator('.ag-root')).toHaveCount(0);
  await expect(page.getByTestId('portal-prototype-empty')).toBeVisible();
});

test('console can preview both design generations on the existing legacy Portal', async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await openPortal(page, 'dark', false, false);
  const dialog = await openConsole(page);
  const save = dialog.getByRole('button', { name: 'Save', exact: true });
  await dialog.getByRole('textbox', { name: 'Primary color', exact: true }).fill('#b21868');
  await dialog.getByRole('spinbutton', { name: 'Radius (px)', exact: true }).fill('3');
  await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-generation', 'webkit');
  const webkitPixels = await save.screenshot();
  await dialog.getByRole('button', { name: 'Legacy', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-generation', 'legacy');
  expect((await metrics(save)).radius).toBe(3);
  expect(await save.screenshot()).not.toEqual(webkitPixels);
  await save.hover();
  await expect.poll(async () => (await metrics(save)).background).toBe('rgb(124, 16, 72)');
  await capture(page, 'legacy-portal-console');
  await dialog.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).uncheck();
  await expect(page.locator('html')).not.toHaveAttribute('data-generation', /.+/);
});
