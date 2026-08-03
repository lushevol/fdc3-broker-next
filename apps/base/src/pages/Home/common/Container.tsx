// import { loadRemote } from '@module-federation/enhanced/runtime';
import React, { type ReactElement, Suspense } from 'react';
import { FDC3ChildProvider } from 'ratan-fdc3';
import ErrorBoundry from '../../../components/ErrorBoundry';
import Splash from '../../../components/Splash';
import type { Container as ContainerProps } from '../../../hooks/model/workspaces';

const AdminModule = React.lazy(() => import('../../../admin'));

const Container: React.FC<ContainerProps> = (props: ContainerProps): ReactElement => {
  const Comp = React.useMemo(
    () =>
      React.lazy(async () => {
        // if (props.container?.startsWith('mf_')) {
        //   return loadRemote(props.container) as Promise<{
        //     default: React.ComponentType<any>;
        //   }>;
        // }
        return System.import(props.container);
      }),
    [],
  );
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
          <FDC3ChildProvider
            appIdentifier={{
              appId: props.tile.replace(/\//g, ''),
              instanceId: props.id,
            }}
          >
            <Comp {...props} />
            {/* <MfContainer /> */}
          </FDC3ChildProvider>
        )}
      </Suspense>
    </ErrorBoundry>
  );
};

export default React.memo(Container);
