import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import setupLegacyTestEnvironment from "../jest.setup";

Object.assign(globalThis, { jest: vi });
window.open = vi.fn();
window.blur = vi.fn();
setupLegacyTestEnvironment(vi);
