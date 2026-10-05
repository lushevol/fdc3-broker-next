import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Browser, TestInfo } from '@playwright/test';
import { expect, test } from './portal-prototype.fixture';
import {
  prototypeReferences,
  prototypeViewports,
  referenceViewport,
  type PrototypeReference,
} from '../fixtures/portal-prototype';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
const captureEnabled = process.env.PORTAL_PROTOTYPE_CAPTURE === '1';
const compareEnabled = process.env.PORTAL_PROTOTYPE_COMPARE === '1';
const referencesRoot = new URL(
  '../../web/mfe-base-origin/docs/new-styles-prototypes/',
  import.meta.url,
);

async function attachEvidence(
  testInfo: TestInfo,
  name: string,
  body: Buffer | string,
  contentType: string,
) {
  const path = testInfo.outputPath(name);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
  await testInfo.attach(name, { path, contentType });
}

async function attachReference(
  browser: Browser,
  testInfo: TestInfo,
  reference: PrototypeReference,
) {
  const source = await readFile(fileURLToPath(new URL(reference.file, referencesRoot)));
  const context = await browser.newContext({ viewport: referenceViewport, deviceScaleFactor: 1 });
  try {
    const referencePage = await context.newPage();
    await referencePage.setContent(
      `<style>html,body{margin:0;padding:0}img{display:block}</style><img alt="Supplied prototype" width="${referenceViewport.width}" height="${referenceViewport.height}" src="data:image/png;base64,${source.toString('base64')}">`,
    );
    await referencePage.locator('img').evaluate(async (image: HTMLImageElement) => image.decode());
    const referenceRegion = await referencePage.screenshot({ clip: reference.region });
    await attachEvidence(testInfo, 'supplied-prototype-full.png', source, 'image/png');
    await attachEvidence(
      testInfo,
      'supplied-prototype-base-region.png',
      referenceRegion,
      'image/png',
    );
    await attachEvidence(
      testInfo,
      'reference-manifest.json',
      JSON.stringify(
        {
          ...reference,
          viewport: referenceViewport,
          sourceSha256: createHash('sha256').update(source).digest('hex'),
        },
        null,
        2,
      ),
      'application/json',
    );
    return referenceRegion;
  } finally {
    await context.close();
  }
}

test('fixture smoke supplies identity, nested actions and populated categories through login', async ({
  page,
  portal,
}) => {
  await page.setViewportSize(referenceViewport);
  await portal.open('profile-actions', 'light');
  const dialog = page.getByRole('dialog').filter({ hasText: 'User Profile' });
  await expect(dialog.getByText('Yating, Yang', { exact: true })).toBeVisible();
  await expect(dialog.getByText('8227715', { exact: true })).toBeVisible();
  await expect(dialog.getByText('F_Custom_Query_Builder', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close User Profile', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await portal.openDrawer();
  const drawer = page.locator('.MuiDrawer-paper');
  await expect(drawer.getByText('Settlement', { exact: true })).toBeVisible();
  await expect(drawer.getByText('Exception Management', { exact: true })).toBeVisible();
  await expect(drawer.getByText(/^Cashflow Blotter(?:\s*\[.*\])?$/)).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test.describe('supplied native prototype evidence', () => {
  test.skip(
    !captureEnabled && !compareEnabled,
    'Set PORTAL_PROTOTYPE_CAPTURE=1 for evidence; compare only after the matching UI stage.',
  );
  for (const reference of prototypeReferences) {
    test(`Frame ${reference.frame} ${reference.theme} ${reference.state}`, async ({
      page,
      portal,
      browser,
    }, testInfo) => {
      await page.setViewportSize(referenceViewport);
      await portal.open(reference.state, reference.theme);
      await attachEvidence(
        testInfo,
        'current-full.png',
        await page.screenshot({ animations: 'disabled' }),
        'image/png',
      );
      const actual = await page.screenshot({ clip: reference.region, animations: 'disabled' });
      await attachEvidence(testInfo, 'current-base-region.png', actual, 'image/png');
      const expected = await attachReference(browser, testInfo, reference);
      if (compareEnabled) {
        const name = `frame-${reference.frame}-${reference.owner.toLowerCase()}.png`;
        const expectedPath = testInfo.snapshotPath(name);
        await mkdir(dirname(expectedPath), { recursive: true });
        await writeFile(expectedPath, expected);
        expect(actual).toMatchSnapshot(name, { maxDiffPixels: 0 });
      }
    });
  }
});

test.describe('responsive adaptations and long-content evidence', () => {
  test.skip(
    !captureEnabled,
    'Adaptations have no supplied pixel reference; set PORTAL_PROTOTYPE_CAPTURE=1 to inspect evidence.',
  );
  for (const viewport of prototypeViewports) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${theme} ${viewport.name} reduced motion and long content`, async ({
        page,
        portal,
      }, testInfo) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
        await portal.open('empty', theme, true);
        await attachEvidence(
          testInfo,
          'workspace.png',
          await page.screenshot({ animations: 'disabled' }),
          'image/png',
        );
        await portal.openDrawer();
        await attachEvidence(
          testInfo,
          'drawer.png',
          await page.screenshot({ animations: 'disabled' }),
          'image/png',
        );
        await page.keyboard.press('Escape');
        await portal.openProfile();
        await attachEvidence(
          testInfo,
          'profile.png',
          await page.screenshot({ animations: 'disabled' }),
          'image/png',
        );
      });
    }
  }
});
