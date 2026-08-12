import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import "./ratanstatic";
import * as ReactRouterDom from "react-router-dom";
import { vi } from "vitest";
globalThis.jest = vi as unknown as typeof jest;
Object.assign(vi, {
  requireActual: (specifier: string) =>
    specifier === "react-router-dom" ? ReactRouterDom : {},
  setTimeout: (timeout: number) => vi.setConfig({ testTimeout: timeout }),
});

Object.assign(globalThis, {
  System: { import: async () => ({ default: () => null }) },
});
await import("../jest.setup.tsx");
vi.setConfig({ testTimeout: 20_000 });
