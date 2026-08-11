/**
 * SC-IDP Authentication Setup
 *
 * Runs once before all business tests. Performs a real SC-IDP OIDC login
 * in CI and saves the session to auth-state.json for reuse.
 *
 * In local mode (localhost) the login is skipped — the local dev server
 * proxy injects the ACCESS_TOKEN header automatically.
 *
 * Environment variables:
 *   TEST_ACCOUNT  — Bank ID  (ADO pipeline: $(test_account))
 *   TEST_PWD      — Password (ADO pipeline: $(test_pwd))
 *   E2E_ENV       — Target environment
 *   E2E_BASE_URL  — Explicit base URL override
 */

import { test as setup, expect } from '@playwright/test';
import * as fs   from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../helpers/env.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE  = path.join(__dirname, 'auth-state.json');

setup('authenticate', async ({ page, baseURL }) => {
  // ── Local mode: skip real login ─────────────────────────────────────────────
  if (!baseURL || baseURL.startsWith('http://localhost')) {
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    console.log('[setup] Local mode — skipping SC-IDP login, wrote empty auth-state.json');
    return;
  }

  // ── CI / remote mode: real SC-IDP OIDC login ────────────────────────────────
  const { account, pwd } = env.requireCIVars();
  console.log(`[setup] Authenticating against ${baseURL} (account: ${account.slice(0, 3)}***)`);

  // 1. Navigate to the plugin entry point — triggers SC-IDP redirect
  await page.goto(`${baseURL}<??= pluginEntryPath ??>`, { waitUntil: 'domcontentloaded' });

  // 2. Wait for SC-IDP login page
  await page.waitForURL(/idp.*openid-connect/, { timeout: 30_000 });

  // 3. Fill credentials
  await page.getByLabel('Bank ID').fill(account);
  await page.getByLabel('Password').fill(pwd);

  // 4. Submit
  await page.getByRole('button', { name: 'Sign in' }).click();

  // 5. Wait for redirect back to Service Bench
  await page.waitForURL(`${baseURL}/**`, { timeout: 30_000 });

  // 6. Verify the Service Bench shell loaded
  await expect(page.locator('service-bench, service-bench-app')).toBeAttached({ timeout: 15_000 });

  // 7. Persist session for all subsequent tests
  await page.context().storageState({ path: AUTH_FILE });
  console.log('[setup] Session saved to auth-state.json');
});
