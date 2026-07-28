import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import { Button, Card, DesignSystemProvider, StatusBadge, type StatusTone } from '@fm/ratan-design';
import '@fm/ratan-design/styles.css';
import { useMemo, useSyncExternalStore } from 'react';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'ratan-migration',
  displayName: 'Ratan Migration MVP',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};

interface MigrationResponsibility {
  readonly responsibility: string;
  readonly destination: string;
  readonly evidence: string;
  readonly tone: StatusTone;
}

export const migrationResponsibilities: readonly MigrationResponsibility[] = [
  {
    responsibility: 'Reusable components and tokens',
    destination: 'Versioned package',
    evidence: '@fm/ratan-design and @fm/ratan-data-grid',
    tone: 'ready',
  },
  {
    responsibility: 'Identity and permissions',
    destination: 'Host capability',
    evidence: 'Versioned identity snapshot delivered to each application',
    tone: 'ready',
  },
  {
    responsibility: 'Navigation and notifications',
    destination: 'Host capability',
    evidence: 'Typed platform SDK with no shell import',
    tone: 'ready',
  },
  {
    responsibility: 'Business workflows',
    destination: 'Owning application',
    evidence: 'Cashflow logic stays in the Cashflow deployable',
    tone: 'review',
  },
];

export function Application({ instanceId, capabilities }: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
  const appearance = useSyncExternalStore(
    client.subscribeToAppearance,
    client.getAppearance,
    client.getAppearance,
  );

  const reportEvidence = () => {
    client.track('ratan-migration.evidence', { instanceId });
    client.notify('Ratan migration MVP has no downstream runtime consumers.');
  };

  return (
    <DesignSystemProvider
      appearance={{
        scheme: appearance.scheme,
        density: appearance.density,
        direction: appearance.direction,
      }}
      scope="application"
    >
      <article className="ratan-migration-app" data-instance-id={instanceId}>
        <header className="migration-header">
          <div>
            <span className="migration-kicker">Legacy extraction proof</span>
            <h1>Ratan container migration</h1>
            <p>
              The former shared runtime is decomposed into packages, host capabilities, and
              application-owned workflows.
            </p>
          </div>
          <StatusBadge status="ready">No third runtime layer</StatusBadge>
        </header>
        <div className="migration-grid">
          {migrationResponsibilities.map((item) => (
            <Card
              key={item.responsibility}
              data-testid="migration-responsibility"
              title={item.responsibility}
              actions={<StatusBadge status={item.tone}>{item.destination}</StatusBadge>}
            >
              <p>{item.evidence}</p>
            </Card>
          ))}
        </div>
        <Button onClick={reportEvidence}>Report migration evidence</Button>
      </article>
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
