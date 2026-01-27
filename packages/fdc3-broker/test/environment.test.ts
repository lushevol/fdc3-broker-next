/**
 * Environment Detection Unit Tests
 * @see plan.md#T145
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isOpenFinAvailable } from '../src/environment';

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

    it('should return false when fin.desktop.fdc3 is not available', () => {
      (globalThis as any).fin = {
        desktop: {},
      };

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should return false when fin.desktop is null', () => {
      (globalThis as any).fin = {
        desktop: null,
      };

      expect(isOpenFinAvailable()).toBe(false);
    });

    it('should return false when fdc3 is null', () => {
      (globalThis as any).fin = {
        desktop: {
          fdc3: null,
        },
      };

      expect(isOpenFinAvailable()).toBe(false);
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
        undefined,
        null,
        'string',
        123,
        [],
        { desktop: 'not an object' },
        { desktop: { fdc3: 'not an object' } },
      ];

      malformedCases.forEach((finValue) => {
        (globalThis as any).fin = finValue;

        expect(() => isOpenFinAvailable()).not.toThrow();
        expect(isOpenFinAvailable()).toBe(false);
      });
    });
  });
});
