/**
 * Shadow DOM traversal utilities for Service Bench Shell.
 *
 * Service Bench renders its navigation through nested Shadow DOM layers.
 * Standard Playwright locators cannot pierce Shadow DOM boundaries —
 * these helpers use CDP (Chrome DevTools Protocol) function injection,
 * which is CSP-safe on SIT/UAT/PROD (no unsafe-eval required).
 *
 * Shell structure (SIT/UAT/PROD):
 *   service-bench-app
 *     └─ service-bench (shadowRoot)
 *          └─ service-bench-container (shadowRoot)
 *               └─ service-bench-navigator (shadowRoot)
 *                    └─ div.nav-item[aria-label="<plugin>"]
 *
 * Local dev omits the service-bench-app wrapper layer.
 *
 * IMPORTANT: Always use FUNCTION form for page.evaluate() and
 * page.waitForFunction(). String form is blocked by the CSP on remote
 * environments (no unsafe-eval). Function form is injected via CDP.
 */

import type { Page } from '@playwright/test';

// ── Shell readiness ───────────────────────────────────────────────────────────

/**
 * Waits until the Service Bench Shell is fully initialised
 * (all Shadow DOM levels rendered, navigator available).
 * Works in both local (service-bench root) and remote (service-bench-app) mode.
 */
export async function waitForShell(page: Page, timeout = 30_000): Promise<void> {
  await page.waitForFunction(
    () => {
      function getNavRoot(): ShadowRoot | null {
        // Remote: service-bench-app wraps service-bench
        const app = document.querySelector('service-bench-app');
        if (app?.shadowRoot) {
          const sb  = app.shadowRoot.querySelector('service-bench');
          const c1  = sb?.shadowRoot?.querySelector('service-bench-container');
          const nav = c1?.shadowRoot?.querySelector('service-bench-navigator');
          return nav?.shadowRoot ?? null;
        }
        // Local: service-bench directly on document
        const sb  = document.querySelector('service-bench');
        const c1  = sb?.shadowRoot?.querySelector('service-bench-container');
        const nav = c1?.shadowRoot?.querySelector('service-bench-navigator');
        return nav?.shadowRoot ?? null;
      }
      return !!getNavRoot();
    },
    { timeout },
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────

/**
 * Clicks a nav item in the Service Bench sidebar by its aria-label.
 *
 * @param ariaLabel  The aria-label of the nav item (e.g. "Integration Hub")
 */
export async function clickNavItem(page: Page, ariaLabel: string): Promise<void> {
  await page.evaluate((label: string) => {
    function findAndClick(root: Document | ShadowRoot, depth: number): boolean {
      if (depth > 8) return false;
      for (const el of Array.from(root.querySelectorAll('*'))) {
        if (el.getAttribute('aria-label') === label &&
            typeof (el as HTMLElement).click === 'function') {
          (el as HTMLElement).click();
          return true;
        }
        if (el.shadowRoot && findAndClick(el.shadowRoot, depth + 1)) return true;
      }
      return false;
    }
    findAndClick(document, 0);
  }, ariaLabel);
}

// ── SPA navigation ────────────────────────────────────────────────────────────

/**
 * Navigates to a plugin SPA route without a full page reload.
 *
 * Strategy 1: Sets __nextPath on the plugin app element (fastest, no reload).
 * Strategy 2: Falls back to page.goto() if the element is not found.
 *
 * @param appTagFragment  Substring of the plugin app element tag name
 *                        e.g. 'integration-hub' matches <sb-app-integration-hub>
 * @param path            Absolute plugin path, e.g. '/my-plugin/section/42'
 */
export async function navigateViaSPA(
  page:           Page,
  appTagFragment: string,
  path:           string,
): Promise<void> {
  const navigated = await page.evaluate(
    ([tagFrag, targetPath]: [string, string]) => {
      function findAndNavigate(root: Document | ShadowRoot, depth: number): boolean {
        if (depth > 8) return false;
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.tagName.toLowerCase().includes(tagFrag)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const app = el as any;
            if ('__nextPath' in app) {
              app.__nextPath = targetPath;
              return true;
            }
          }
          if (el.shadowRoot && findAndNavigate(el.shadowRoot, depth + 1)) return true;
        }
        return false;
      }
      return findAndNavigate(document, 0);
    },
    [appTagFragment, path] as [string, string],
  );

  if (!navigated) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

// ── Lit reactive properties ───────────────────────────────────────────────────

/**
 * Sets a Lit reactive property on a Web Component anywhere in the Shadow DOM.
 *
 * Tries string-key assignment first (works in all builds), then Symbol-key
 * search (Lit dev mode with standard decorators).
 *
 * @param tagNameFragment  Substring of the element tag name
 * @param propertyName     Lit property name, e.g. '_showModal'
 * @param value            Value to set
 */
export async function setLitReactiveProperty(
  page:            Page,
  tagNameFragment: string,
  propertyName:    string,
  value:           unknown,
): Promise<void> {
  await page.evaluate(
    ([tagFrag, propName, val]: [string, string, unknown]) => {
      function findAndSet(root: Document | ShadowRoot, depth: number): boolean {
        if (depth > 10) return false;
        for (const el of Array.from(root.querySelectorAll('*'))) {
          if (el.tagName.toLowerCase().includes(tagFrag)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyEl = el as any;
            for (const key of [propName, `_${propName}`]) {
              if (key in anyEl) {
                anyEl[key] = val;
                if (typeof anyEl.requestUpdate === 'function') anyEl.requestUpdate();
                return true;
              }
            }
            // Symbol-key fallback (Lit dev mode only)
            for (const sym of Object.getOwnPropertySymbols(el)) {
              if (sym.toString().includes(propName)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (el as any)[sym] = val;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof (el as any).requestUpdate === 'function') (el as any).requestUpdate();
                return true;
              }
            }
          }
          if (el.shadowRoot && findAndSet(el.shadowRoot, depth + 1)) return true;
        }
        return false;
      }
      findAndSet(document, 0);
    },
    [tagNameFragment, propertyName, value] as [string, string, unknown],
  );
}
