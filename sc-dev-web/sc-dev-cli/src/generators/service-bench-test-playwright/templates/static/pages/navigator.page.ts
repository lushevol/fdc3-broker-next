/**
 * NavigatorPage — high-level navigation helper for your plugin.
 *
 * Wraps the most common navigation flows so spec files stay clean.
 * Customise the methods below to match your plugin's actual routes and
 * page element selectors.
 *
 * Template variables used:
 *   pluginDisplayName  — e.g. "Integration Hub"
 *   pluginEntryPath    — e.g. "/integration-hub/home"
 *
 * HOW TO CUSTOMISE:
 *   1. Update goToHome() to assert the correct heading for your plugin.
 *   2. Add goToXxx() methods for each main section of your plugin.
 *   3. Pass your plugin's tag name fragment to navigateViaSPA() if you
 *      need client-side routing (no full reload).
 */

import { expect, type Page } from '@playwright/test';
import { BasePage }            from './base.page.ts';
import { clickNavItem }        from '../helpers/shadow-dom.ts';

export class NavigatorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the plugin home page via direct URL.
   * Update the expect() assertion to match the first visible heading
   * or landmark element on your plugin's home page.
   */
  async goToHome(): Promise<void> {
    await this.loadShell('<??= pluginEntryPath ??>');
    // TODO: replace with an assertion specific to your plugin's home page
    await expect(this.page.locator('body')).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Open your plugin via the Service Bench sidebar navigation.
   * Replace '<??= pluginDisplayName ??>' with the exact aria-label of your
   * plugin's nav item if it differs.
   */
  async openViaSidebar(): Promise<void> {
    // Navigate to any Service Bench page to ensure the shell is loaded
    await this.loadShell('/');
    await clickNavItem(this.page, '<??= pluginDisplayName ??>');
    await this.waitForRoute('<??= pluginEntryPath ??>');
  }
}
