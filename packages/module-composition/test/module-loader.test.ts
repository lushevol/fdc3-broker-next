import { describe, expect, it, vi } from 'vitest';
import {
  ModuleCompositionError,
  ModuleLoader,
  ModuleFederationModuleAdapter,
  SystemJsModuleAdapter,
  UnavailableModuleLoader,
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

  it('accepts React object component exports', async () => {
    const ObjectComponent = {
      $$typeof: Symbol.for('react.memo'),
      type: RemoteComponent,
    };
    const loader = new ModuleLoader([
      new SystemJsModuleAdapter(vi.fn().mockResolvedValue({ default: ObjectComponent })),
    ]);

    const module = await loader.load({
      loader: 'systemjs',
      moduleId: '@fm/trades/memo-summary',
    });

    expect(module.Component).toBe(ObjectComponent);
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

  it('checks permission before every load, including cached modules', async () => {
    const systemImport = vi.fn().mockResolvedValue({ default: RemoteComponent });
    let hasAccess = true;
    const beforeLoad = vi.fn(async () => {
      if (!hasAccess) {
        throw new ModuleCompositionError('MODULE_ACCESS_DENIED');
      }
    });
    const loader = new ModuleLoader([new SystemJsModuleAdapter(systemImport)], {
      lifecycle: { beforeLoad },
    });
    const reference = { loader: 'systemjs' as const, moduleId: '@fm/trades/summary' };

    await expect(loader.load(reference)).resolves.toMatchObject({ Component: RemoteComponent });
    hasAccess = false;

    await expect(loader.load(reference)).rejects.toEqual(
      expect.objectContaining<Partial<ModuleCompositionError>>({
        code: 'MODULE_ACCESS_DENIED',
      }),
    );
    expect(beforeLoad).toHaveBeenCalledTimes(2);
    expect(beforeLoad).toHaveBeenLastCalledWith({
      reference: { ...reference, exportName: 'default' },
    });
    expect(systemImport).toHaveBeenCalledTimes(1);
  });

  it('reports successful lifecycle completion and cache status', async () => {
    const afterLoad = vi.fn();
    const loader = new ModuleLoader(
      [new SystemJsModuleAdapter(vi.fn().mockResolvedValue({ default: RemoteComponent }))],
      { lifecycle: { afterLoad } },
    );
    const reference = { loader: 'systemjs' as const, moduleId: '@fm/trades/summary' };

    const first = await loader.load(reference);
    const second = await loader.load(reference);

    expect(afterLoad).toHaveBeenNthCalledWith(1, {
      reference: { ...reference, exportName: 'default' },
      module: first,
      fromCache: false,
    });
    expect(afterLoad).toHaveBeenNthCalledWith(2, {
      reference: { ...reference, exportName: 'default' },
      module: second,
      fromCache: true,
    });
  });

  it('reports load failures without replacing the original error', async () => {
    const originalError = new Error('permission service unavailable');
    const onLoadError = vi.fn(() => {
      throw new Error('audit sink unavailable');
    });
    const loader = new ModuleLoader([], {
      lifecycle: {
        beforeLoad: () => {
          throw originalError;
        },
        onLoadError,
      },
    });
    const reference = { loader: 'systemjs' as const, moduleId: '@fm/trades/summary' };

    await expect(loader.load(reference)).rejects.toBe(originalError);
    expect(onLoadError).toHaveBeenCalledWith({
      reference: { ...reference, exportName: 'default' },
      error: originalError,
    });
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

  it('rejects a missing selected export', async () => {
    const loader = new ModuleLoader([
      new SystemJsModuleAdapter(vi.fn().mockResolvedValue({ default: RemoteComponent })),
    ]);

    await expect(
      loader.load({
        loader: 'systemjs',
        moduleId: '@fm/trades/summary',
        exportName: 'TradeSummary',
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<ModuleCompositionError>>({
        code: 'MISSING_COMPONENT_EXPORT',
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

  it('reports module composition as unavailable when no runtime is configured', async () => {
    const loader = new UnavailableModuleLoader();

    await expect(
      loader.load({ loader: 'systemjs', moduleId: '@fm/trades/summary' }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<ModuleCompositionError>>({
        code: 'MODULE_COMPOSITION_UNAVAILABLE',
      }),
    );
  });
});
