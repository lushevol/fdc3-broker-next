import '@webcomponents/scoped-custom-element-registry';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (!HTMLElement.prototype.getAnimations) {
  HTMLElement.prototype.getAnimations = () => [];
}

if (!HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = () => ({
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type !== 'finish') return;
      queueMicrotask(() => {
        if (typeof listener === 'function') listener(new Event('finish'));
        else listener.handleEvent(new Event('finish'));
      });
    },
    cancel: () => undefined,
    finished: Promise.resolve(),
  }) as Animation;
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

afterEach(cleanup);
