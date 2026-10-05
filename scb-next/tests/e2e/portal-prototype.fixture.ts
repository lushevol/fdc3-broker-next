import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test as base, type Page } from '@playwright/test';
import {
  buildPrototypeAuth,
  buildPrototypeStorage,
  expandedRole,
  expandedSubject,
  prototypeClock,
  type PrototypeState,
  type PrototypeTheme,
} from '../fixtures/portal-prototype';

export { expect } from '@playwright/test';

const fontsDirectory = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url),
);
const portrait = fileURLToPath(
  new URL(
    '../../web/mfe-base-origin/src/new-styles/assets/profile-portrait-reference.png',
    import.meta.url,
  ),
);

interface PortalPrototype {
  open(state: PrototypeState, theme: PrototypeTheme, stress?: boolean): Promise<void>;
  openDrawer(): Promise<void>;
  openProfile(): Promise<void>;
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            }),
        ),
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

/** Supplies real HTTP contracts to the current standalone host; no source modules are replaced. */
export const test = base.extend<{ portal: PortalPrototype }>({
  portal: async ({ page }, use) => {
    const openDrawer = async () => {
      await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
      const paper = page.locator('.MuiDrawer-paper');
      await expect(paper).toBeVisible();
      await expect(paper).toHaveCSS('transform', 'none');
      await expect(paper.getByText('Trade Processing', { exact: true })).toBeVisible();
      await settle(page);
    };
    const openProfile = async () => {
      await page.getByRole('button', { name: 'User Profiles', exact: true }).click();
      await page.getByText(/Click to view user profile/i).click();
      const dialog = page.getByRole('dialog').filter({ hasText: 'User Profile' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText(new RegExp(`${expandedRole}.*FMO_COO_SUP`))).toBeVisible();
      await settle(page);
    };
    await use({
      openDrawer,
      openProfile,
      open: async (state, theme, stress = false) => {
        const clock = state.startsWith('profile') ? 'profile' : 'shell';
        const auth = buildPrototypeAuth(clock, stress);
        await page.clock.setFixedTime(new Date(prototypeClock[clock]));
        await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
          route.fulfill({
            path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
          }),
        );
        await page.route('https://axess.sc.net/**/photo', (route) =>
          route.fulfill({ path: portrait }),
        );
        await page.route('https://leap.standardchartered.com/**/photo_lg.jpg', (route) =>
          route.fulfill({ path: portrait }),
        );
        await page.route(
          /\/api\/auth\/v[23]\/sso\/(login|relogin|validate|extend)(\?.*)?$/,
          (route) =>
            route.fulfill({
              json: {
                ...auth.body,
                ...(route.request().url().includes('/validate') ? { result: true } : {}),
              },
              headers: { 'single-ui-authorization': `Bearer ${auth.token}` },
            }),
        );
        await page.addInitScript(
          (storage: Record<string, string>) => {
            localStorage.clear();
            sessionStorage.clear();
            for (const [key, value] of Object.entries(storage)) {
              localStorage.setItem(key, value);
              sessionStorage.setItem(key, value);
            }
          },
          buildPrototypeStorage(theme, stress),
        );
        // Keep the preview flag while Stage 2 centralizes the complete appearance decision.
        await page.goto('/?show_normal_login=Y&survey=no&new-styles=true&new-layout=true');
        await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
        if (state !== 'login') {
          await page.getByPlaceholder('Enter Username').fill('portal.prototype');
          await page.getByPlaceholder('Enter Password').fill('prototype-fixture');
          await page.getByRole('button', { name: 'Sign In', exact: true }).click();
          await expect(
            page.getByRole('button', { name: 'User Profiles', exact: true }),
          ).toBeVisible();
          await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(theme === 'light');
          await expect(page.locator('html')).toHaveClass(`${theme} sc-mode-${theme}`);
          await page
            .getByRole('tab')
            .nth(state === 'empty' ? 2 : state === 'workspace' ? 0 : 1)
            .click();
          if (state === 'drawer') await openDrawer();
          if (state === 'avatar') {
            await page.getByRole('button', { name: 'User Profiles', exact: true }).click();
            await expect(page.getByRole('menu')).toBeVisible();
          }
          if (state.startsWith('profile')) {
            await openProfile();
            const dialog = page.getByRole('dialog').filter({ hasText: 'User Profile' });
            if (state !== 'profile') {
              await dialog.getByText(new RegExp(`${expandedRole}.*FMO_COO_SUP`)).click();
              await expect(dialog.getByText(expandedSubject, { exact: true })).toBeVisible();
            }
            if (state === 'profile-actions') {
              await dialog.getByText(expandedSubject, { exact: true }).click();
              await expect(dialog.getByText('F_Export_Data', { exact: true })).toBeVisible();
            }
          }
        }
        await settle(page);
      },
    });
  },
});
