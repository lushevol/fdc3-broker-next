import type { AppIdentifier } from 'ratan-fdc3-broker';
import type { Container } from '../hooks/model/workspaces';

export const isSingleViewTarget = (
  app: AppIdentifier,
  target: Container | undefined,
  targetAppId: string | undefined,
): boolean =>
  Boolean(
    target &&
      targetAppId &&
      app.appId === targetAppId &&
      (!app.instanceId || app.instanceId === target.id),
  );

export const getSingleViewBrokerOptions = (target: Container | undefined) =>
  target ? { forceExternalIntentSourceInstanceIds: [target.id] } : {};
