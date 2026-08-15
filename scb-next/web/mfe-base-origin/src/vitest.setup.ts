import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.assign(globalThis, { jest: vi });
window.open = vi.fn();
window.blur = vi.fn();
Object.assign(vi, {
  setTimeout: (timeout: number) => vi.setConfig({ testTimeout: timeout }),
});
await import("../jest.setup.tsx");
