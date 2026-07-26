import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import type { ModuleLoaderApi } from 'ratan-module-composition';
import { describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';

const createBroker = (moduleLoader?: ModuleLoaderApi): Broker =>
  new Broker({
    appDirectory: new MockAppDirectoryService(),
    callbacks: { onLoginStatusCheck: async () => true },
    moduleLoader,
  });

describe('Broker module composition extension', () => {
  it('exposes the configured non-FDC3 module loader unchanged', async () => {
    const moduleLoader: ModuleLoaderApi = { load: vi.fn() };
    const broker = createBroker(moduleLoader);

    expect(broker.modules).toBe(moduleLoader);
  });

  it('keeps standard FDC3 operations available and reports composition as unavailable by default', async () => {
    const broker = createBroker();

    await expect(broker.getInfo()).resolves.toBeDefined();
    await expect(
      broker.modules.load({ loader: 'systemjs', moduleId: '@fm/trades/summary' }),
    ).rejects.toMatchObject({ code: 'MODULE_COMPOSITION_UNAVAILABLE' });
  });
});
