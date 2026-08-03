import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import { DesignSystemProvider } from '@fm/ratan-design-webkit';
import '@fm/ratan-design-webkit/styles.css';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { configurePlatformBridge, PlatformProvider } from './compat/base';
import { MigratedCashflowCnEntry } from './migrated-entry';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'cashflow-blotter',
  displayName: 'Cashflow CN',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};

export function Application({ instanceId, capabilities }: ApplicationProps) {
  const client = useMemo(() => {
    configurePlatformBridge(capabilities);
    return createPlatformClient(capabilities);
  }, [capabilities]);
  const appearance = useSyncExternalStore(
    client.subscribeToAppearance,
    client.getAppearance,
    client.getAppearance,
  );

  useEffect(() => {
    client.track('cashflow-cn.migrated-root.mounted', {
      source: 'src/Cashflow_CN',
    });
  }, [client]);

  return (
    <DesignSystemProvider
      appearance={{
        scheme: appearance.scheme,
        density: appearance.density,
        direction: appearance.direction,
      }}
      scope="application"
    >
      <article
        className="cashflow-cn-migrated-app"
        data-instance-id={instanceId}
        data-source="src/Cashflow_CN"
      >
        <PlatformProvider>
          <MigratedCashflowCnEntry instanceId={instanceId} />
        </PlatformProvider>
      </article>
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
