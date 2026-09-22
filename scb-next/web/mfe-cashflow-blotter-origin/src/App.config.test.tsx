import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Cashflow production configuration', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('initializes the copied Ratan configuration when the exposed app module loads', async () => {
    delete window.ratanConfig;
    vi.resetModules();

    const { loadCashflowApplication } = await import('./application');
    await loadCashflowApplication();

    expect(window.ratanConfig).toEqual(
      expect.objectContaining({
        cashflow: expect.any(Object),
      }),
    );
  });
});
