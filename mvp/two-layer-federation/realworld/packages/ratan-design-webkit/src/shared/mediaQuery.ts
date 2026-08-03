import { LitElement } from 'lit';
import { throttle } from './util.js';

type HandlerFn = (...matches: boolean[]) => void;

type NonUndefined<A> = A extends undefined ? never : A;

type PublicHandlerFunction<T extends object> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends HandlerFn ? K : never;
}[keyof T];

interface MediaQueryOptions {
  /** If true, will also call `requestUpdate()` whenever mediaQuery changes */
  shouldUpdate?: boolean;
  /** If true, will also call `requestUpdate()` whenever mediaQuery changes
   * and will wait for the update to complete before calling the handler. */
  waitAfterUpdate?: boolean;
}

type MediaQueryName = keyof MediaQueries;

/**
 * Decorator that runs when mediaQuery changes for `mobileSm`, `mobileLg`, `tablet` or `desktop`.
 * Use options for lit lifecycle control.
 *
 * Usage:
 * ```
 *⠀@mediaQuery('tablet')
 * handleTabletChange(isTablet: boolean) {
 *   //...
 * }
 *⠀@mediaQuery(['mobileSm', 'mobileLg'], { waitAfterUpdate: true })
 * handleMobileSmChange(isMobileSm: boolean, isMobileLg: boolean) {
 *   //...
 * }
 * ```
 */
export function mediaQuery(name: MediaQueryName | MediaQueryName[], options?: MediaQueryOptions) {
  const { shouldUpdate, waitAfterUpdate } = {
    shouldUpdate: false,
    waitAfterUpdate: false,
    ...options,
  };
  return <E extends LitElement>(element: E, decoratedFnName: PublicHandlerFunction<E>) => {
    const { connectedCallback, disconnectedCallback } = element;
    const names = Array.isArray(name) ? name : [name];
    let cleanup: () => void;

    element.connectedCallback = function (this: E) {
      const mediaQuery = getGlobalMediaQuery() ?? createMediaQuery(element);
      // invoke original
      connectedCallback.call(this);
      const fn = throttle(
        async function (this: E) {
          if (shouldUpdate || waitAfterUpdate) {
            if (!this.isUpdatePending) this.requestUpdate();
            if (waitAfterUpdate) await this.updateComplete;
          }
          const handler = this[decoratedFnName] as unknown as HandlerFn;
          handler.apply(
            this,
            names.map((n) => mediaQuery[n].matches),
          );
        },
        this,
        10,
      );
      names.forEach((n) => mediaQuery[n].addEventListener('change', fn));
      cleanup = () => names.forEach((n) => mediaQuery[n].removeEventListener('change', fn));
    };
    element.disconnectedCallback = function (this: E) {
      // invoke original
      disconnectedCallback.call(this);
      cleanup();
    };
  };
}

export type MediaQueries = Readonly<{
  mobileSm: MediaQueryList;
  mobileLg: MediaQueryList;
  tablet: MediaQueryList;
  portrait: MediaQueryList;
  desktop: MediaQueryList;
}>;

export const mediaQueryKey = Symbol('screen-media-query');

export function createMediaQuery(target: Element): MediaQueries {
  if (!(mediaQueryKey in target) || !target[mediaQueryKey]) {
    function cssVal(name: string, defVal: number) {
      return parseInt(getComputedStyle(target).getPropertyValue(name)) || defVal;
    }
    function media(...conds: string[]) {
      return window.matchMedia(conds.join(' and '));
    }
    Object.defineProperty(target, mediaQueryKey, {
      writable: true,
      value: Object.freeze({
        /// using https://caniuse.com/css-media-range-syntax for scaled displays that misreport fractional widths
        mobileSm: media('screen', `(width < ${cssVal('--sc-screen-mobile-sm', 320) + 1}px)`),
        mobileLg: media(
          'screen',
          `(${cssVal('--sc-screen-mobile-sm', 320)}px < width < ${
            cssVal('--sc-screen-mobile-lg', 414) + 1
          }px)`,
        ),
        tablet: media(
          'screen',
          `(${cssVal('--sc-screen-mobile-lg', 414)}px < width < ${
            cssVal('--sc-screen-tablet', 834) + 1
          }px)`,
        ),
        portrait: media('screen', '(orientation: portrait)'),
        desktop: media('screen', `(${cssVal('--sc-screen-tablet', 834)}px < width)`),
      }),
    });
  }
  return (target as any)[mediaQueryKey];
}

export function getGlobalMediaQuery() {
  return document?.body instanceof HTMLElement ? createMediaQuery(document.body) : null;
}
