import type { AppIdentifier } from 'ratan-fdc3';
import { ModuleLoader, SystemJsModuleAdapter } from 'ratan-module-composition';
import { FDC3RootProvider, type FDC3PlatformAdapter } from 'ratan-fdc3';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useContext as useAppContext } from '../hooks/provider';
import {
  createSingleViewContainer,
  findSingleViewTile,
  isSingleViewRequest,
  SINGLE_VIEW_QUERY_PARAM,
} from '../pages/Home/common/singleView';
import fdc3Definitions from './declarations/fdc3-definitions.json';
import workflows from './declarations/workflows.json';
import { isSingleViewTarget } from './singleView';
import { useFDC3WorkspaceHelper } from './useFDC3WorkspaceHelper';

const CONTEXT_ROUTING_INTENTS = ['scb.ViewLaunch', 'scb.ViewUpdate'];
const USER_CHANNEL_IDS = ['red', 'green', 'blue', 'orange', 'purple'];

const getFdc3AppId = (tile: string): string => tile.replace(/\//g, '');

const getPostMessageAllowedOrigins = (): string[] =>
  (process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

interface FDC3IntegrationProps {
  children: React.ReactNode;
}

/**
 * Adapts base-owned business/platform capabilities to the business-neutral
 * FDC3 providers. Broker lifecycle and FDC3 UI behavior stay in ratan-fdc3.
 */
export const FDC3Integration: React.FC<FDC3IntegrationProps> = ({ children }) => {
  const [store] = useAppContext();
  const { workspaceOpenTile, allAccessibleTiles } = useFDC3WorkspaceHelper();
  const singleViewRequest = isSingleViewRequest();
  const singleViewTileId = new URLSearchParams(window.location.search).get(SINGLE_VIEW_QUERY_PARAM);
  const singleViewTile = findSingleViewTile(
    singleViewTileId,
    store.drawers?.flatMap((drawer) => drawer.tiles),
  );
  const singleViewContainer = singleViewTile
    ? createSingleViewContainer(singleViewTile)
    : undefined;
  const singleViewAppId = singleViewContainer ? getFdc3AppId(singleViewContainer.tile) : undefined;

  const apps = useMemo(() => {
    const accessibleTiles = singleViewRequest
      ? allAccessibleTiles.filter(
          (tile) => tile.tile && getFdc3AppId(tile.tile) === singleViewAppId,
        )
      : allAccessibleTiles;

    if (accessibleTiles.length === 0 && !singleViewRequest) {
      return fdc3Definitions.map((definition) => ({
        appId: definition.appId,
        name: definition.appId,
        version: '',
        description: '',
        icon: '',
        type: '',
        url: '',
        interop: definition.interop ?? {},
      }));
    }

    return accessibleTiles.map((tile) => {
      const appId = getFdc3AppId(tile.tile);
      return {
        appId,
        name: tile.title,
        version: '',
        description: '',
        icon: '',
        type: '',
        url: '',
        interop: fdc3Definitions.find((definition) => definition.appId === appId)?.interop ?? {},
      };
    });
  }, [allAccessibleTiles, singleViewAppId, singleViewRequest]);

  const openApp = useCallback(
    async (app: AppIdentifier): Promise<AppIdentifier> => {
      if (singleViewRequest) {
        if (!isSingleViewTarget(app, singleViewContainer, singleViewAppId)) {
          throw new Error('Single view cannot open a tile other than its target.');
        }
        if (!singleViewContainer || !singleViewAppId) {
          throw new Error('Single-view target is unavailable.');
        }
        return {
          appId: singleViewAppId,
          instanceId: singleViewContainer.id,
        };
      }

      const openStatus = await workspaceOpenTile(
        { tile: app.appId },
        { workspaceId: app.instanceId },
      );
      if (!openStatus.opened) {
        throw new Error(openStatus.failedReason);
      }
      return {
        ...app,
        instanceId: openStatus.workspaceId,
      };
    },
    [singleViewAppId, singleViewContainer, singleViewRequest, workspaceOpenTile],
  );

  const accessibleAppIds = useMemo(() => new Set(apps.map((app) => app.appId)), [apps]);
  const platform = useMemo<FDC3PlatformAdapter>(
    () => ({
      isAuthenticated: Boolean(store.token),
      openApp,
      validateEntitlements: async (appId) =>
        appId === '' || appId === 'external' || accessibleAppIds.has(appId),
      onSecurityEvent: (event, data) => {
        console.info('[FDC3 security]', { data, event });
      },
    }),
    [accessibleAppIds, openApp, store.token],
  );
  const moduleLoader = useMemo(
    () => new ModuleLoader([new SystemJsModuleAdapter((moduleId) => System.import(moduleId))]),
    [],
  );
  const postMessageAllowedOrigins = useMemo(getPostMessageAllowedOrigins, []);

  return (
    <FDC3RootProvider
      apps={apps}
      platform={platform}
      workflows={workflows}
      moduleLoader={moduleLoader}
      userChannelIds={USER_CHANNEL_IDS}
      debug={process.env.NODE_ENV === 'development'}
      showConsole={
        !singleViewRequest && process.env.NODE_ENV === 'development' && Boolean(store.token)
      }
      interop={{
        openFin: {
          globalIntents: CONTEXT_ROUTING_INTENTS,
          contextRoutingIntents: CONTEXT_ROUTING_INTENTS,
        },
        postMessage: {
          allowedOrigins: postMessageAllowedOrigins,
          contextRoutingIntents: CONTEXT_ROUTING_INTENTS,
        },
        forceExternalIntentSourceInstanceIds: singleViewContainer ? [singleViewContainer.id] : [],
      }}
    >
      {children}
    </FDC3RootProvider>
  );
};

export default FDC3Integration;
