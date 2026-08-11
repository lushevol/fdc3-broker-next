import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

if (!HTMLElement.prototype.getAnimations) {
  HTMLElement.prototype.getAnimations = () => [];
}

if (!HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = () =>
    ({
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type !== 'finish') return;
        queueMicrotask(() => {
          if (typeof listener === 'function') listener(new Event('finish'));
          else listener.handleEvent(new Event('finish'));
        });
      },
      cancel: () => undefined,
      finished: Promise.resolve(),
    }) as unknown as Animation;
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  });
}

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class TestIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ target, intersectionRatio: 1, isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
  root = null;
  rootMargin = '0px';
  thresholds = [0];
}

Object.assign(globalThis, {
  ResizeObserver: TestResizeObserver,
  IntersectionObserver: TestIntersectionObserver,
});

await import('@scdevkit/webkit/elements');

// Existing test helpers use the Jest-compatible spy surface. Keep the test
// vocabulary stable while Vitest is the runner and assertion engine.
Object.assign(globalThis, { jest: vi });
