import { APPLICATION_CONTRACT_VERSION, APPEARANCE_CONTRACT_VERSION } from '@fm/platform-contracts-poc';
import { loadApplicationRegistry } from './registry';

const registry = {
  applications: [
    {
      id: 'cashflow',
      displayName: 'Cashflow',
      remoteName: 'mfe_cashflow_poc',
      manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json',
      exposedModule: './application',
      basePath: '/cashflow',
      contractVersion: APPLICATION_CONTRACT_VERSION,
      appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
      capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
    },
  ],
};

describe('loadApplicationRegistry', () => {
  it('fetches and validates the runtime registry without caching', async () => {
    const fetcher = jest.fn().mockResolvedValue({ ok: true, json: async () => registry });
    await expect(loadApplicationRegistry(fetcher)).resolves.toEqual(registry);
    expect(fetcher).toHaveBeenCalledWith('/registry.json', { cache: 'no-store' });
  });

  it('rejects an unavailable registry', async () => {
    const fetcher = jest.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(loadApplicationRegistry(fetcher)).rejects.toThrow('503');
  });

  it('rejects invalid runtime data', async () => {
    const fetcher = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ applications: [] }) });
    await expect(loadApplicationRegistry(fetcher)).rejects.toThrow();
  });

  it('uses the browser fetch implementation by default', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => registry }) as jest.Mock;
    await expect(loadApplicationRegistry()).resolves.toEqual(registry);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch = originalFetch;
  });
});
