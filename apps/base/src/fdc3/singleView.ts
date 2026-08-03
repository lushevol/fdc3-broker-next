import type { AppIdentifier } from 'ratan-fdc3';
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
