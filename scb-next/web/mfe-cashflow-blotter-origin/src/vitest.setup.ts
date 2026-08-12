import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import "./cashflow-ratan/ratanstatic";
import * as ReactRouterDom from "react-router-dom";
import { vi } from "vitest";
globalThis.jest = vi as unknown as typeof jest;

Object.assign(vi, {
  requireActual: (specifier: string) =>
    specifier === "react-router-dom" ? ReactRouterDom : {},
  setTimeout: (timeout: number) => vi.setConfig({ testTimeout: timeout }),
});
if (!(vi as typeof vi & { replaceProperty?: unknown }).replaceProperty) {
  Object.assign(vi, {
    replaceProperty: (target: Record<string, unknown>, key: string, value: unknown) => {
      const previous = target[key];
      target[key] = value;
      return { restore: () => { target[key] = previous; } };
    },
  });
}
Object.assign(globalThis, {
  requestIdleCallback: (callback: IdleRequestCallback) =>
    window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 0),
  cancelIdleCallback: (id: number) => window.clearTimeout(id),
});
await import("../jest.setup.tsx");
