import type { Context } from '@finos/fdc3';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clearBroker, getAgentApi, setBroker } from 'ratan-fdc3-agent';
import { AppDirectoryClientImpl } from 'ratan-fdc3-app-directory';
import { Broker, LogLevel, type ResolverTarget } from 'ratan-fdc3-broker';
import { ModuleCompositionError } from 'ratan-module-composition';
import {
  destroyFDC3LogService,
  FDC3ConsoleWidget,
  initFDC3LogService,
  ResolverDialog,
} from 'ratan-fdc3-resolver-ui';
import { createFDC3ModuleLoader, MODULE_LOAD_ENTITLEMENT_ACTION } from './module-loader';
import type { FDC3RootProviderProps } from './types';

type ResolverRequest = {
  context: Context | null;
  intent: string;
  open: boolean;
  targets: ResolverTarget[];
};

const CLOSED_RESOLVER: ResolverRequest = {
  context: null,
  intent: '',
  open: false,
  targets: [],
};

const isOpenFinRuntime = (): boolean => {
  const runtime = globalThis as typeof globalThis & { fin?: { desktop?: unknown } };
  return Boolean(runtime.fin?.desktop);
};

export const FDC3RootProvider: React.FC<FDC3RootProviderProps> = ({
  apps,
  children,
  platform,
  directory,
  interop,
  moduleLoader,
  moduleLoaderOptions,
  workflows,
  userChannelIds,
  debug = false,
  showConsole = false,
}) => {
  const platformRef = useRef(platform);
  platformRef.current = platform;

  const [resolver, setResolver] = useState<ResolverRequest>(CLOSED_RESOLVER);
  const resolverCompletionRef = useRef<((target: ResolverTarget | null) => void) | null>(null);

  const appDirectoryRef = useRef<AppDirectoryClientImpl | null>(null);
  if (!appDirectoryRef.current) {
    appDirectoryRef.current = new AppDirectoryClientImpl({
      baseUrl: directory?.baseUrl ?? 'local://fdc3-app-directory',
      getAuthToken: directory?.getAuthToken,
      timeout: directory?.timeout,
      mode: directory?.mode ?? 'local-only',
      localApps: apps,
    });
  }
  appDirectoryRef.current.replaceLocalApps(apps);

  const showResolver = useCallback(
    (targets: ResolverTarget[], context?: Context, intent?: string) =>
      new Promise<ResolverTarget | null>((resolve) => {
        resolverCompletionRef.current?.(null);
        resolverCompletionRef.current = resolve;
        setResolver({
          context: context ?? null,
          intent: intent ?? '',
          open: true,
          targets,
        });
      }),
    [],
  );

  const [resolvedModuleLoader] = useState(
    () =>
      moduleLoader ??
      createFDC3ModuleLoader({
        ...moduleLoaderOptions,
        lifecycle: {
          ...moduleLoaderOptions?.lifecycle,
          beforeLoad: async (context) => {
            const entitled = await platformRef.current.validateEntitlements(
              context.reference.moduleId,
              MODULE_LOAD_ENTITLEMENT_ACTION,
            );
            if (!entitled) {
              throw new ModuleCompositionError(
                'MODULE_ACCESS_DENIED',
                context.reference,
                `Access denied to module ${context.reference.moduleId}.`,
              );
            }
            await moduleLoaderOptions?.lifecycle?.beforeLoad?.(context);
          },
        },
      }),
  );
  const [broker] = useState(() => {
    const instance = new Broker({
      appDirectory: appDirectoryRef.current!,
      callbacks: {
        onLoginStatusCheck: async () => platformRef.current.isAuthenticated,
        onTileOpen: (app) => platformRef.current.openApp(app),
        onTileClose: (app) => platformRef.current.closeApp?.(app) ?? Promise.resolve(),
        onValidateEntitlements: (tileId, action) =>
          platformRef.current.validateEntitlements(tileId, action),
        onWorkspaceCreated: (workspaceId) => platformRef.current.onWorkspaceCreated?.(workspaceId),
        onSecurityEvent: (event, data) => platformRef.current.onSecurityEvent?.(event, data),
        onShowResolverUI: showResolver,
      },
      onLogin: async () => undefined,
      onLogout: async () => undefined,
      userChannelIds,
      workflows,
      moduleLoader: resolvedModuleLoader,
      enableDebug: debug,
      logLevel: debug ? LogLevel.DEBUG : LogLevel.WARN,
      enableOpenFinBridge: interop?.enableOpenFin ?? isOpenFinRuntime(),
      openFinBridgeOptions: interop?.openFin,
      enablePostMessageBridge: Boolean(interop?.postMessage?.allowedOrigins.length),
      postMessageBridgeOptions: interop?.postMessage,
      forceExternalIntentSourceInstanceIds: interop?.forceExternalIntentSourceInstanceIds,
    });

    setBroker(instance);
    return instance;
  });

  const previousAuthenticationRef = useRef(platform.isAuthenticated);
  useEffect(() => {
    const wasAuthenticated = previousAuthenticationRef.current;
    previousAuthenticationRef.current = platform.isAuthenticated;

    if (!wasAuthenticated && platform.isAuthenticated) {
      void broker.processQueuedIntents();
    }
  }, [broker, platform.isAuthenticated]);

  useEffect(() => {
    initFDC3LogService();

    return () => {
      resolverCompletionRef.current?.(null);
      resolverCompletionRef.current = null;
      destroyFDC3LogService();

      try {
        if (getAgentApi() === broker) {
          clearBroker();
        }
      } catch {
        // Another provider may already have cleared or replaced the broker.
      }
    };
  }, [broker]);

  const completeResolver = useCallback((target: ResolverTarget | null) => {
    const complete = resolverCompletionRef.current;
    resolverCompletionRef.current = null;
    setResolver(CLOSED_RESOLVER);
    complete?.(target);
  }, []);

  return (
    <>
      {children}
      <ResolverDialog
        open={resolver.open}
        intent={resolver.intent}
        context={resolver.context as Context}
        targets={resolver.targets}
        onSelect={(target) => completeResolver(target)}
        onCancel={() => completeResolver(null)}
      />
      {showConsole && <FDC3ConsoleWidget />}
    </>
  );
};
