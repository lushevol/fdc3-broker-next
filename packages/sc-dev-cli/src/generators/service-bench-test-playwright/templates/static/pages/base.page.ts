/**
 * BasePage — shared utilities for all Page Object classes.
 *
 * Provides a thin wrapper around the Playwright Page object with helpers
 * specific to the Service Bench SPA environment.
 *
 * Extend this class for each section of your plugin:
 *
 *   export class MyFeaturePage extends BasePage {
 *     readonly myButton = this.page.getByRole('button', { name: 'Submit' });
 *
 *     async assertLoaded(): Promise<void> {
 *       await expect(this.myButton).toBeVisible({ timeout: 15_000 });
 *     }
 *   }
 */

import type { Page } from '@playwright/test';
import { waitForShell } from '../helpers/shadow-dom.ts';
import { waitForRoute } from '../helpers/wait.ts';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a Service Bench path and wait for the shell to mount.
   * All three Shadow DOM layers (service-bench-app → service-bench →
   * service-bench-container → service-bench-navigator) must be ready
   * before any plugin content is accessible.
   */
  protected async loadShell(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await waitForShell(this.page);
  }

  /**
   * Navigate within an already-loaded Service Bench shell via SPA routing.
   * Skips the full page reload — just pushes the URL and waits for the route.
   * Falls back to loadShell() if the shell is not yet present.
   *
   * Use this for the 2nd+ navigation within a test suite to avoid repeated
   * full page loads (each full reload costs ~15-25s on SIT/UAT).
   */
  protected async navigateInShell(path: string): Promise<void> {
    const currentUrl = this.page.url();
    const isInShell  = currentUrl.includes('servicebench');
    if (isInShell) {
      await this.page.evaluate((p: string) => window.history.pushState({}, '', p), path);
      await waitForRoute(this.page, path);
    } else {
      await this.loadShell(path);
    }
  }

  /**
   * Wait for the SPA pathname to contain the given fragment.
   * Use instead of page.waitForURL() — the SPA router does not fire
   * browser navigation events.
   */
  protected async waitForRoute(fragment: string, timeout?: number): Promise<void> {
    await waitForRoute(this.page, fragment, timeout);
  }

  /** Returns the current page URL. */
  url(): string {
    return this.page.url();
  }
}
