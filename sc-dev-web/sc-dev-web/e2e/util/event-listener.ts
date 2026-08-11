import { Locator } from '@playwright/test';

/**
 * Two-phase event capture that guarantees the listener is registered BEFORE
 * the triggering action fires the event, avoiding the race condition where
 * the event fires during or immediately after an action.
 *
 * A unique capture key is generated per call so that concurrent captures of
 * the same event name on different elements never collide in `window.__capturedEvents`.
 *
 * Phase 1 — call `captureEvent` to register the listener.
 * Phase 2 — trigger the action, then call the returned function to await the
 *            captured detail (polls via `waitForFunction` until it arrives).
 *
 * @param locator   Playwright `Locator` pointing to the element to listen on.
 * @param eventName Custom event name (e.g. `'sc-sort'`).
 *
 * @example
 *   const awaitSort = await captureEvent(page.locator('sc-data-grid'), 'sc-sort');
 *   await sortIcon.click();
 *   const detail = await awaitSort();
 */
export const captureEvent = async <T = unknown>(locator: Locator, eventName: string) => {
  const page = locator.page();
  // Unique key per call — prevents collisions when the same event name is
  // captured concurrently on different elements.
  const captureKey = `${eventName}_${Math.random().toString(36).slice(2)}`;

  await locator.evaluate(
    (el, { name, key }: { name: string; key: string }) => {
      (window as any).__capturedEvents ??= {};
      el.addEventListener(
        name,
        (e: Event) => {
          (window as any).__capturedEvents[key] = (e as CustomEvent).detail ?? true;
        },
        { once: true },
      );
    },
    { name: eventName, key: captureKey },
  );

  return (): Promise<T> =>
    page
      .waitForFunction(
        (key: string) => key in ((window as any).__capturedEvents ?? {}),
        captureKey,
        { timeout: 10_000 },
      )
      .then(() =>
        page.evaluate(
          (key: string) => (window as any).__capturedEvents[key],
          captureKey,
        ) as Promise<T>,
      );
};
