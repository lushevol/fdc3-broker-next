/**
 * SPA-aware wait utilities for Service Bench.
 *
 * Service Bench uses an internal SPA router that does NOT fire browser
 * navigation events (popstate / load). Standard page.waitForURL() will
 * time out after SPA route changes — use these helpers instead.
 *
 * IMPORTANT: All waitForFunction() calls use FUNCTION form (CSP-safe).
 * String form is blocked by the SIT/UAT Content Security Policy (no unsafe-eval).
 */

import type { Page } from '@playwright/test';

/**
 * Waits until window.location.pathname contains the given fragment.
 * Use this after any navigateViaSPA() or page.goto() call.
 *
 * @param pathFragment  Substring to look for in the pathname
 * @param timeout       Maximum wait in milliseconds (default 15 s)
 */
export async function waitForRoute(
  page:         Page,
  pathFragment: string,
  timeout = 15_000,
): Promise<void> {
  await page.waitForFunction(
    (fragment: string) => window.location.pathname.includes(fragment),
    pathFragment,
    { timeout },
  );
}

/**
 * Waits until the pathname contains `include` but NOT `exclude`.
 * Useful for "navigated back to list, but not still on detail page" checks.
 */
export async function waitForRouteExcluding(
  page:            Page,
  pathFragment:    string,
  excludeFragment: string,
  timeout = 15_000,
): Promise<void> {
  await page.waitForFunction(
    ([include, exclude]: [string, string]) =>
      window.location.pathname.includes(include) &&
      !window.location.pathname.includes(exclude),
    [pathFragment, excludeFragment] as [string, string],
    { timeout },
  );
}

/**
 * Waits until an element whose tag contains tagFragment has a specific
 * attribute value anywhere in the Shadow DOM.
 *
 * Useful for polling custom-element state changes not visible via
 * standard Playwright locator APIs.
 */
export async function waitForShadowAttribute(
  page:        Page,
  tagFragment: string,
  attrName:    string,
  attrValue?:  string,
  timeout = 10_000,
): Promise<void> {
  await page.waitForFunction(
    ([tagFrag, attr, val]: [string, string, string | undefined]) => {
      function find(root: Document | ShadowRoot, depth: number): boolean {
        if (depth > 10) return false;
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.tagName.toLowerCase().includes(tagFrag)) {
            const match = val !== undefined
              ? el.getAttribute(attr) === val
              : el.hasAttribute(attr);
            if (match) return true;
          }
          if (el.shadowRoot && find(el.shadowRoot, depth + 1)) return true;
        }
        return false;
      }
      return find(document, 0);
    },
    [tagFragment, attrName, attrValue] as [string, string, string | undefined],
    { timeout },
  );
}
