import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Existing test helpers use the Jest-compatible spy surface. Keep the test
// vocabulary stable while Vitest is the runner and assertion engine.
Object.assign(globalThis, { jest: vi });
