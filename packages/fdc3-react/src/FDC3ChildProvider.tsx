import type { AppIdentifier, AppMetadata } from '@finos/fdc3';
import React, { useEffect } from 'react';
import { AgentProvider, useFDC3 } from 'ratan-fdc3-agent';

export interface FDC3ChildProviderProps {
  appIdentifier: AppIdentifier;
  children: React.ReactNode;
  metadata?: AppMetadata;
}

const FDC3ChildLifecycle: React.FC<FDC3ChildProviderProps> = ({
  appIdentifier,
  children,
  metadata,
}) => {
  const fdc3 = useFDC3();
  const { appId, instanceId } = appIdentifier;

  useEffect(() => {
    if (!instanceId) {
      return;
    }

    void Promise.resolve(fdc3.registerTile(instanceId, appId, metadata)).catch((error) => {
      console.error('Failed to register FDC3 child application', {
        appId,
        error,
        instanceId,
      });
    });

    return () => {
      try {
        void Promise.resolve(fdc3.unregisterTile(instanceId)).catch((error) => {
          console.error('Failed to unregister FDC3 child application', {
            appId,
            error,
            instanceId,
          });
        });
      } catch (error) {
        console.error('Failed to unregister FDC3 child application', {
          appId,
          error,
          instanceId,
        });
      }
    };
  }, [appId, fdc3, instanceId, metadata]);

  return <>{children}</>;
};

export const FDC3ChildProvider: React.FC<FDC3ChildProviderProps> = (props) => (
  <AgentProvider appIdentifier={props.appIdentifier}>
    <FDC3ChildLifecycle {...props} />
  </AgentProvider>
);
