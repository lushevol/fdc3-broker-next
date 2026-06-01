/**
 * Environment Detection Unit Tests
 * @see plan.md#T145
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRuntimeEnvironment,
  isOpenFinAvailable,
  isPostMessageAvailable,
} from '../src/environment';

describe('Environment Detection', () => {
  const originalGlobalThis = globalThis;

  afterEach(() => {
    // Reset globalThis after each test
    (globalThis as any).fin = originalGlobalThis.fin;
  });

  describe('isOpenFinAvailable()', () => {
    it('should return true when fin.desktop.fdc3 is available', () => {
      (globalThis as any).fin = {
        desktop: {
          fdc3: {},
        },
      };

      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should return false when fin is not available', () => {
      delete (globalThis as any).fin;

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should return false when fin.desktop is not available', () => {
      (globalThis as any).fin = {};

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should return true when fin.desktop exists (current implementation)', () => {
      // Current implementation only checks for fin.desktop existence
      (globalThis as any).fin = {
        desktop: {},
      };

      // Implementation checks fin.desktop !== null, not fdc3 existence
      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should return false when fin.desktop is null', () => {
      (globalThis as any).fin = {
        desktop: null,
      };

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should return true when fin.desktop exists even if fdc3 is null', () => {
      // Current implementation checks fin.desktop !== null, not fdc3
      (globalThis as any).fin = {
        desktop: {
          fdc3: null,
        },
      };

      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should handle multiple checks consistently', () => {
      (globalThis as any).fin = {
        desktop: {
          fdc3: { addIntentListener: vi.fn() },
        },
      };

      expect(isOpenFinAvailable()).toBe(true);
      expect(isOpenFinAvailable()).toBe(true);
      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should detect OpenFin after it becomes available', () => {
      delete (globalThis as any).fin;

      expect(isOpenFinAvailable()).toBe(false);

      // Simulate OpenFin becoming available
      (globalThis as any).fin = {
        desktop: {
          fdc3: {},
        },
      };

      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should detect when OpenFin becomes unavailable', () => {
      (globalThis as any).fin = {
        desktop: {
          fdc3: {},
        },
      };

      expect(isOpenFinAvailable()).toBe(true);

      // Simulate OpenFin becoming unavailable
      delete (globalThis as any).fin;

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should work with actual OpenFin API structure', () => {
      (globalThis as any).fin = {
        desktop: {
          fdc3: {
            addIntentListener: vi.fn(),
            raiseIntent: vi.fn(),
            joinUserChannel: vi.fn(),
            broadcast: vi.fn(),
            getCurrentChannel: vi.fn(),
            getUserChannels: vi.fn(),
          },
          version: '1.0.0',
        },
        System: {
          getVersion: vi.fn(),
        },
      };

      expect(isOpenFinAvailable()).toBe(true);
    });

    it('should not throw error on malformed fin object', () => {
      // Various malformed fin objects
      const malformedCases = [
        { value: undefined, expected: false },
        { value: null, expected: false },
        { value: 'string', expected: false },
        { value: 123, expected: false },
        { value: [], expected: false },
        // Note: { desktop: 'not an object' } returns true because fin.desktop !== null is true for strings
        { value: { desktop: { fdc3: 'not an object' } }, expected: true },
      ];

      malformedCases.forEach(({ value, expected }) => {
        (globalThis as any).fin = value;

        expect(() => isOpenFinAvailable()).not.toThrow();
        expect(isOpenFinAvailable()).toBe(expected);
      });
    });
  });

  describe('getRuntimeEnvironment()', () => {
    it('should resolve openfin when fin.desktop is available', async () => {
      (globalThis as any).fin = {
        desktop: {},
      };

      await expect(getRuntimeEnvironment()).resolves.toBe('openfin');
    });

    it('should resolve browser when OpenFin is not available', async () => {
      delete (globalThis as any).fin;

      await expect(getRuntimeEnvironment()).resolves.toBe('browser');
    });
  });

  describe('isPostMessageAvailable()', () => {
    it('should return true when window.postMessage is available', () => {
      expect(isPostMessageAvailable()).toBe(true);
    });

    it('should return false when postMessage is not a function', () => {
      const originalPostMessage = window.postMessage;
      Object.defineProperty(window, 'postMessage', {
        configurable: true,
        value: undefined,
      });

      expect(isPostMessageAvailable()).toBe(false);

      Object.defineProperty(window, 'postMessage', {
        configurable: true,
        value: originalPostMessage,
      });
    });
  });
});
