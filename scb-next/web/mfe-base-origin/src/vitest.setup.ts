import "@testing-library/jest-dom";
import { vi } from "vitest";

globalThis.jest = vi as unknown as typeof jest;
window.open = vi.fn();
window.blur = vi.fn();
Object.assign(vi, {
  setTimeout: (timeout: number) => vi.setConfig({ testTimeout: timeout }),
});
await import("../jest.setup.tsx");
