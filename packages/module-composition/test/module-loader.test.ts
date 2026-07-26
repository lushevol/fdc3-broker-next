import { describe, expect, it, vi } from 'vitest';
import {
  ModuleCompositionError,
  ModuleLoader,
  ModuleFederationModuleAdapter,
  SystemJsModuleAdapter,
} from '../src';

const RemoteComponent = () => null;

describe('ModuleLoader', () => {
  it('loads a named SystemJS component through an injected importer', async () => {
    const systemImport = vi.fn().mockResolvedValue({ TradeSummary: RemoteComponent });
    const loader = new ModuleLoader([new SystemJsModuleAdapter(systemImport)]);

    const module = await loader.load({
      loader: 'systemjs',
      moduleId: '@fm/trades/components/trade-summary',
      exportName: 'TradeSummary',
    });

    expect(systemImport).toHaveBeenCalledWith('@fm/trades/components/trade-summary');
    expect(module.Component).toBe(RemoteComponent);
    expect(module.metadata).toEqual({
      loader: 'systemjs',
      moduleId: '@fm/trades/components/trade-summary',
      exportName: 'TradeSummary',
    });
  });

  it('loads a default Module Federation component through an injected runtime', async () => {
    const loadRemote = vi.fn().mockResolvedValue({ default: RemoteComponent });
    const loader = new ModuleLoader([new ModuleFederationModuleAdapter(loadRemote)]);

    const module = await loader.load({
      loader: 'module-federation',
      moduleId: 'trades/TradeTicket',
    });

    expect(loadRemote).toHaveBeenCalledWith('trades/TradeTicket');
    expect(module.Component).toBe(RemoteComponent);
    expect(module.metadata.exportName).toBe('default');
  });

  it('deduplicates concurrent requests and retries after a rejected load', async () => {
    const systemImport = vi
      .fn<() => Promise<{ default: typeof RemoteComponent }>>()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValue({ default: RemoteComponent });
    const loader = new ModuleLoader([new SystemJsModuleAdapter(systemImport)]);
    const reference = { loader: 'systemjs' as const, moduleId: '@fm/trades/summary' };

    await expect(Promise.all([loader.load(reference), loader.load(reference)])).rejects.toThrow(
      'network',
    );
    expect(systemImport).toHaveBeenCalledTimes(1);

    await expect(loader.load(reference)).resolves.toMatchObject({ Component: RemoteComponent });
    expect(systemImport).toHaveBeenCalledTimes(2);
  });

  it('rejects an absent or non-component selected export with the reference', async () => {
    const loader = new ModuleLoader([
      new SystemJsModuleAdapter(vi.fn().mockResolvedValue({ value: 'not a component' })),
    ]);
    const reference = {
      loader: 'systemjs' as const,
      moduleId: '@fm/trades/summary',
      exportName: 'value',
    };

    await expect(loader.load(reference)).rejects.toEqual(
      expect.objectContaining<Partial<ModuleCompositionError>>({
        code: 'INVALID_COMPONENT_EXPORT',
        reference,
      }),
    );
  });

  it('rejects references for which the host has not registered an adapter', async () => {
    const loader = new ModuleLoader([]);

    await expect(
      loader.load({ loader: 'module-federation', moduleId: 'trades/TradeTicket' }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<ModuleCompositionError>>({ code: 'UNSUPPORTED_LOADER' }),
    );
  });
});
