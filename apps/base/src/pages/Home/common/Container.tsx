import { AgentProvider, useFDC3 } from 'ratan-fdc3-agent';
import React, { type ReactElement, Suspense } from 'react';
import ErrorBoundry from '../../../components/ErrorBoundry';
import Splash from '../../../components/Splash';
import type { Container as ContainerProps } from '../../../hooks/model/workspaces';
import { loadWorkspaceRemote } from './remoteLoader';

const AdminModule = React.lazy(() => import('../../../admin'));

const getFdc3AppId = (tile: string): string => tile.replace(/\//g, '');

type TileLifecycleAgent = {
  registerTile: (instanceId: string, appId: string, metadata?: unknown) => Promise<void>;
  unregisterTile: (instanceId: string) => Promise<void>;
};

const FDC3TileLifecycle: React.FC<{
  appId: string;
  instanceId: string;
  children: React.ReactNode;
}> = ({ appId, instanceId, children }) => {
  const fdc3 = useFDC3() as unknown as TileLifecycleAgent;

  React.useEffect(() => {
    try {
      void Promise.resolve(fdc3.registerTile(instanceId, appId)).catch((error) => {
        console.error('Failed to register tile:', error);
      });
    } catch (error) {
      console.error('Failed to register tile:', error);
    }

    return () => {
      try {
        void Promise.resolve(fdc3.unregisterTile(instanceId)).catch((error) => {
          console.error('Failed to unregister tile:', error);
        });
      } catch (error) {
        console.error('Failed to unregister tile:', error);
      }
    };
  }, [appId, fdc3, instanceId]);

  return <>{children}</>;
};

const FDC3TileProvider: React.FC<{
  props: ContainerProps;
  children: React.ReactNode;
}> = ({ props, children }) => {
  const appIdentifier = React.useMemo(
    () => ({
      appId: getFdc3AppId(props.tile),
      instanceId: props.id,
    }),
    [props.id, props.tile],
  );

  return (
    <AgentProvider appIdentifier={appIdentifier}>
      <FDC3TileLifecycle appId={appIdentifier.appId} instanceId={appIdentifier.instanceId}>
        {children}
      </FDC3TileLifecycle>
    </AgentProvider>
  );
};

const Container: React.FC<ContainerProps> = (props: ContainerProps): ReactElement => {
  const Comp = React.useMemo(() => React.lazy(() => loadWorkspaceRemote(props.container)), []);
  return (
    <ErrorBoundry emailSupport={props.emailSupport}>
      <Suspense fallback={<Splash />}>
        {props.container === '@fm/base' ? (
          <AdminModule
            module={props.module}
            tile={props.tile}
            parameters={props.parameters ?? {}}
            panelId={props.panelId}
            tabId={props.tabId}
          />
        ) : (
          <FDC3TileProvider props={props}>
            <Comp {...props} />
            {/* <MfContainer /> */}
          </FDC3TileProvider>
        )}
      </Suspense>
    </ErrorBoundry>
  );
};

export default React.memo(Container);
