import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Context, DesktopAgent } from '@finos/fdc3';
import { clearBroker, getAgentApi, setBroker, useAppIdentifier, useFDC3 } from 'ratan-fdc3-agent';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createFDC3ModuleLoader,
  FDC3ChildProvider,
  FDC3RootProvider,
  type FDC3PlatformAdapter,
} from '../src';
import type { BrokerConfig, ResolverTarget } from 'ratan-fdc3-broker';

vi.mock('ratan-fdc3-resolver-ui', () => ({
  ResolverDialog: ({
    onCancel,
    onSelect,
    open,
    targets,
  }: {
    onCancel: () => void;
    onSelect: (target: ResolverTarget) => void;
    open: boolean;
    targets: ResolverTarget[];
  }) =>
    open ? (
      <div data-testid="resolver-dialog">
        <button onClick={() => onSelect(targets[0])}>Select target</button>
        <button onClick={onCancel}>Cancel resolver</button>
      </div>
    ) : null,
  FDC3ConsoleWidget: () => <div data-testid="fdc3-console" />,
  initFDC3LogService: vi.fn(),
  destroyFDC3LogService: vi.fn(),
}));

const createPlatform = (overrides: Partial<FDC3PlatformAdapter> = {}): FDC3PlatformAdapter => ({
  isAuthenticated: true,
  openApp: vi.fn(async (app) => app),
  validateEntitlements: vi.fn(async () => true),
  ...overrides,
});

const apps = [
  {
    appId: 'chart',
    name: 'Chart',
    version: '1.0.0',
    description: '',
    icon: '',
    type: '',
    url: '',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
      },
    },
  },
];

afterEach(() => {
  clearBroker();
});

describe('FDC3RootProvider', () => {
  it('destroys the owned broker when the provider unmounts', () => {
    const { unmount } = render(
      <FDC3RootProvider apps={apps} platform={createPlatform()}>
        <div />
      </FDC3RootProvider>,
    );
    const destroy = vi.spyOn(getAgentApi(), 'destroy');

    unmount();

    expect(destroy).toHaveBeenCalledOnce();
  });

  it('accepts a host Module Federation loading capability', async () => {
    const RemoteComponent = () => <div>Federated component</div>;
    const loadRemote = vi.fn(async () => ({ TradeSummary: RemoteComponent }));
    const moduleLoader = createFDC3ModuleLoader({ loadRemote });

    const loaded = await moduleLoader.load({
      loader: 'module-federation',
      moduleId: 'trades/summary',
      exportName: 'TradeSummary',
    });

    expect(loadRemote).toHaveBeenCalledWith('trades/summary');
    expect(loaded.Component).toBe(RemoteComponent);
  });

  it('owns SystemJS module-loader composition when the runtime is available', async () => {
    const runtime = globalThis as typeof globalThis & {
      System?: { import(moduleId: string): Promise<Record<string, unknown>> };
    };
    const previousSystem = runtime.System;
    const RemoteComponent = () => <div>Remote component</div>;
    const systemImport = vi.fn(async () => ({ default: RemoteComponent }));
    runtime.System = { import: systemImport };

    try {
      const { unmount } = render(
        <FDC3RootProvider apps={apps} platform={createPlatform()}>
          <div />
        </FDC3RootProvider>,
      );

      const loaded = await getAgentApi().modules.load({
        loader: 'systemjs',
        moduleId: '@fm/remote-tile',
      });

      expect(systemImport).toHaveBeenCalledWith('@fm/remote-tile');
      expect(loaded.Component).toBe(RemoteComponent);
      unmount();
    } finally {
      if (previousSystem) {
        runtime.System = previousSystem;
      } else {
        delete runtime.System;
      }
    }
  });

  it('exposes module-load lifecycle control before SystemJS resolution', async () => {
    const runtime = globalThis as typeof globalThis & {
      System?: { import(moduleId: string): Promise<Record<string, unknown>> };
    };
    const previousSystem = runtime.System;
    const systemImport = vi.fn(async () => ({ default: () => <div>Remote component</div> }));
    const accessError = new Error('Module access denied');
    const beforeLoad = vi.fn(() => {
      throw accessError;
    });
    const onLoadError = vi.fn();
    runtime.System = { import: systemImport };

    try {
      const { unmount } = render(
        <FDC3RootProvider
          apps={apps}
          platform={createPlatform()}
          moduleLoaderOptions={{ lifecycle: { beforeLoad, onLoadError } }}
        >
          <div />
        </FDC3RootProvider>,
      );
      const reference = { loader: 'systemjs' as const, moduleId: '@fm/restricted-tile' };

      await expect(getAgentApi().modules.load(reference)).rejects.toBe(accessError);
      expect(beforeLoad).toHaveBeenCalledWith({
        reference: { ...reference, exportName: 'default' },
      });
      expect(onLoadError).toHaveBeenCalledWith({
        reference: { ...reference, exportName: 'default' },
        error: accessError,
      });
      expect(systemImport).not.toHaveBeenCalled();
      unmount();
    } finally {
      if (previousSystem) {
        runtime.System = previousSystem;
      } else {
        delete runtime.System;
      }
    }
  });

  it('denies module loading through the host entitlement policy before resolution', async () => {
    const runtime = globalThis as typeof globalThis & {
      System?: { import(moduleId: string): Promise<Record<string, unknown>> };
    };
    const previousSystem = runtime.System;
    const systemImport = vi.fn(async () => ({ default: () => <div>Remote component</div> }));
    const validateEntitlements = vi.fn(async () => false);
    runtime.System = { import: systemImport };

    try {
      const { unmount } = render(
        <FDC3RootProvider apps={apps} platform={createPlatform({ validateEntitlements })}>
          <div />
        </FDC3RootProvider>,
      );
      const reference = { loader: 'systemjs' as const, moduleId: '@fm/restricted-tile' };

      await expect(getAgentApi().modules.load(reference)).rejects.toEqual(
        expect.objectContaining({
          code: 'MODULE_ACCESS_DENIED',
          reference: { ...reference, exportName: 'default' },
        }),
      );
      expect(validateEntitlements).toHaveBeenCalledWith('@fm/restricted-tile', 'load-module');
      expect(systemImport).not.toHaveBeenCalled();
      unmount();
    } finally {
      if (previousSystem) {
        runtime.System = previousSystem;
      } else {
        delete runtime.System;
      }
    }
  });

  it('publishes a broker that calls the base-owned open capability', async () => {
    const platform = createPlatform();

    const Consumer = () => {
      const fdc3 = useFDC3();
      return <button onClick={() => void fdc3.open({ appId: 'chart' })}>Open</button>;
    };

    const { unmount } = render(
      <FDC3RootProvider apps={apps} platform={platform}>
        <Consumer />
      </FDC3RootProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      expect(platform.openApp).toHaveBeenCalledWith({ appId: 'chart' });
    });

    unmount();
  });

  it('updates local app discovery without recreating the provider', async () => {
    const platform = createPlatform();
    const { rerender, unmount } = render(
      <FDC3RootProvider apps={apps} platform={platform}>
        <div />
      </FDC3RootProvider>,
    );

    expect((await getAgentApi().findIntent('ViewChart')).apps.map((app) => app.appId)).toEqual([
      'chart',
    ]);

    rerender(
      <FDC3RootProvider
        apps={[...apps, { ...apps[0], appId: 'news', name: 'News' }]}
        platform={platform}
      >
        <div />
      </FDC3RootProvider>,
    );

    await waitFor(async () => {
      expect((await getAgentApi().findIntent('ViewChart')).apps.map((app) => app.appId)).toEqual([
        'chart',
        'news',
      ]);
    });

    unmount();
  });

  it('replays queued intents only on a login transition', async () => {
    const platform = createPlatform({ isAuthenticated: false });
    const { rerender, unmount } = render(
      <FDC3RootProvider apps={apps} platform={platform}>
        <div />
      </FDC3RootProvider>,
    );
    const processQueuedIntents = vi.spyOn(getAgentApi(), 'processQueuedIntents');

    rerender(
      <FDC3RootProvider apps={apps} platform={{ ...platform, isAuthenticated: true }}>
        <div />
      </FDC3RootProvider>,
    );

    await waitFor(() => {
      expect(processQueuedIntents).toHaveBeenCalledTimes(1);
    });

    rerender(
      <FDC3RootProvider apps={apps} platform={{ ...platform, isAuthenticated: false }}>
        <div />
      </FDC3RootProvider>,
    );

    expect(processQueuedIntents).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('owns resolver completion and delegates optional platform callbacks', async () => {
    const closeApp = vi.fn(async () => undefined);
    const onWorkspaceCreated = vi.fn();
    const onSecurityEvent = vi.fn();
    const platform = createPlatform({
      closeApp,
      onSecurityEvent,
      onWorkspaceCreated,
    });
    const { unmount } = render(
      <FDC3RootProvider
        apps={apps}
        platform={platform}
        debug
        showConsole
        directory={{
          baseUrl: 'https://directory.example.test',
          mode: 'local-only',
          timeout: 100,
        }}
        interop={{
          enableOpenFin: false,
          postMessage: {
            allowedOrigins: ['https://child.example.test'],
          },
        }}
      >
        <div />
      </FDC3RootProvider>,
    );
    const callbacks = getBrokerConfig().callbacks;

    await callbacks.onTileClose?.({ appId: 'chart' });
    callbacks.onWorkspaceCreated?.('workspace-1');
    callbacks.onSecurityEvent?.('denied', { appId: 'chart' });
    await getBrokerConfig().onLogout(async () => undefined);

    expect(closeApp).toHaveBeenCalledWith({ appId: 'chart' });
    expect(onWorkspaceCreated).toHaveBeenCalledWith('workspace-1');
    expect(onSecurityEvent).toHaveBeenCalledWith('denied', { appId: 'chart' });
    expect(screen.getByTestId('fdc3-console')).toBeInTheDocument();

    const target = {
      appId: 'chart',
      metadata: apps[0],
    } as ResolverTarget;
    let firstRequest: Promise<ResolverTarget | null> | undefined;
    let secondRequest: Promise<ResolverTarget | null> | undefined;
    await act(async () => {
      firstRequest = callbacks.onShowResolverUI?.([target]);
      secondRequest = callbacks.onShowResolverUI?.(
        [target],
        { type: 'fdc3.instrument' },
        'ViewChart',
      );
      await firstRequest;
    });

    await expect(firstRequest).resolves.toBeNull();
    fireEvent.click(await screen.findByRole('button', { name: 'Select target' }));
    await expect(secondRequest).resolves.toEqual(target);

    let cancelledRequest: Promise<ResolverTarget | null> | undefined;
    await act(async () => {
      cancelledRequest = callbacks.onShowResolverUI?.([target]);
    });
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel resolver' }));
    await expect(cancelledRequest).resolves.toBeNull();

    unmount();
  });

  it('does not clear a broker installed by a newer root', () => {
    const { unmount } = render(
      <FDC3RootProvider apps={apps} platform={createPlatform()}>
        <div />
      </FDC3RootProvider>,
    );
    const replacement = {} as DesktopAgent;
    setBroker(replacement);

    unmount();

    expect(getAgentApi()).toBe(replacement);
  });

  it('tolerates an already-cleared broker during cleanup', () => {
    const { unmount } = render(
      <FDC3RootProvider apps={apps} platform={createPlatform()}>
        <div />
      </FDC3RootProvider>,
    );
    clearBroker();

    expect(() => unmount()).not.toThrow();
  });
});

describe('FDC3ChildProvider', () => {
  it('registers, scopes, and unregisters concurrent child applications independently', async () => {
    const broadcast = vi.fn(async () => undefined);
    const registerTile = vi.fn(async () => undefined);
    const unregisterTile = vi.fn();
    setBroker({
      broadcast,
      registerTile,
      unregisterTile,
    } as unknown as DesktopAgent);

    const Child = ({ label }: { label: string }) => {
      const app = useAppIdentifier();
      const fdc3 = useFDC3();
      const context: Context = { type: 'fdc3.instrument', name: label };
      return (
        <button onClick={() => void fdc3.broadcast(context)}>
          {app?.appId}:{app?.instanceId}
        </button>
      );
    };

    const { unmount } = render(
      <>
        <FDC3ChildProvider appIdentifier={{ appId: 'chart', instanceId: 'chart-1' }}>
          <Child label="chart" />
        </FDC3ChildProvider>
        <FDC3ChildProvider appIdentifier={{ appId: 'news', instanceId: 'news-1' }}>
          <Child label="news" />
        </FDC3ChildProvider>
      </>,
    );

    await waitFor(() => {
      expect(registerTile).toHaveBeenCalledWith('chart-1', 'chart', undefined);
      expect(registerTile).toHaveBeenCalledWith('news-1', 'news', undefined);
    });

    fireEvent.click(screen.getByRole('button', { name: 'chart:chart-1' }));
    fireEvent.click(screen.getByRole('button', { name: 'news:news-1' }));

    await waitFor(() => {
      expect(broadcast).toHaveBeenCalledWith(
        { type: 'fdc3.instrument', name: 'chart' },
        { appId: 'chart', instanceId: 'chart-1' },
      );
      expect(broadcast).toHaveBeenCalledWith(
        { type: 'fdc3.instrument', name: 'news' },
        { appId: 'news', instanceId: 'news-1' },
      );
    });

    unmount();

    expect(unregisterTile).toHaveBeenCalledWith('chart-1');
    expect(unregisterTile).toHaveBeenCalledWith('news-1');
  });

  it('supports identity-only children and reports lifecycle failures', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const registerTile = vi.fn(async () => {
      throw new Error('register failed');
    });
    const unregisterTile = vi
      .fn()
      .mockRejectedValueOnce(new Error('async unregister failed'))
      .mockImplementationOnce(() => {
        throw new Error('sync unregister failed');
      });
    setBroker({
      registerTile,
      unregisterTile,
    } as unknown as DesktopAgent);

    const { unmount } = render(
      <>
        <FDC3ChildProvider appIdentifier={{ appId: 'identity-only' }}>
          <div>Identity only</div>
        </FDC3ChildProvider>
        <FDC3ChildProvider appIdentifier={{ appId: 'chart', instanceId: 'chart-1' }}>
          <div>Chart</div>
        </FDC3ChildProvider>
        <FDC3ChildProvider appIdentifier={{ appId: 'news', instanceId: 'news-1' }}>
          <div>News</div>
        </FDC3ChildProvider>
      </>,
    );

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to register FDC3 child application',
        expect.objectContaining({ appId: 'chart', instanceId: 'chart-1' }),
      );
    });

    unmount();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to unregister FDC3 child application',
        expect.objectContaining({ appId: 'chart', instanceId: 'chart-1' }),
      );
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to unregister FDC3 child application',
        expect.objectContaining({ appId: 'news', instanceId: 'news-1' }),
      );
    });
  });
});

function getBrokerConfig(): BrokerConfig {
  return (getAgentApi() as unknown as { config: BrokerConfig }).config;
}
