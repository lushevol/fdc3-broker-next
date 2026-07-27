import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import {
  Avatar,
  Button,
  Card,
  DescriptionList,
  DesignSystemProvider,
  Disclosure,
  EmptyState,
  StatusBadge,
  TagGroup,
} from '@fm/ratan-design';
import '@fm/ratan-design/styles.css';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import './styles.css';

export const manifest: ApplicationManifest = {
  id: 'identity-profile',
  displayName: 'Identity & Profile',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};

const unsubscribeIdentity = () => undefined;

export function Application({
  instanceId,
  capabilities,
}: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
  const appearance = useSyncExternalStore(
    client.subscribeToAppearance,
    client.getAppearance,
    client.getAppearance,
  );
  const subscribeToIdentity = useCallback(
    (listener: () => void) => client.subscribeToIdentity(listener) ?? unsubscribeIdentity,
    [client],
  );
  const getIdentity = useCallback(() => client.getIdentity(), [client]);
  const identity = useSyncExternalStore(subscribeToIdentity, getIdentity, getIdentity);

  return (
    <DesignSystemProvider
      appearance={{
        scheme: appearance.scheme,
        density: appearance.density,
        direction: appearance.direction,
      }}
      scope="application"
    >
      <article className="profile-app" data-instance-id={instanceId}>
        <header className="profile-page-header">
          <div>
            <span className="profile-kicker">Component verification / identity</span>
            <h1>Operator profile</h1>
          </div>
          <StatusBadge status={identity?.state === 'authenticated' ? 'ready' : 'neutral'}>
            {identity?.state ?? 'anonymous'}
          </StatusBadge>
        </header>
        {identity?.state === 'authenticated' ? (
          <div className="profile-grid">
            <Card>
              <div className="profile-summary">
                <Avatar name={identity.userId} size="large" />
                <div>
                  <h2>{identity.userId}</h2>
                  <p>Financial Markets Operations</p>
                </div>
              </div>
              <TagGroup
                label="Permissions"
                tags={identity.permissions.map((permission) => ({
                  id: permission,
                  label: permission,
                }))}
              />
            </Card>
            <Card title="Assignment" description="Host-delivered identity metadata">
              <DescriptionList items={[
                { id: 'desk', term: 'Desk', description: 'Post trade operations' },
                { id: 'region', term: 'Region', description: 'Singapore' },
                { id: 'session', term: 'Session', description: instanceId },
                { id: 'contract', term: 'Contract', description: identity.contractVersion },
              ]} />
            </Card>
            <Card title="Access details">
              <Disclosure title="Role responsibilities" defaultExpanded>
                <p>Review exceptions, manage settlements, and coordinate operational controls.</p>
              </Disclosure>
              <Disclosure title="Runtime evidence">
                <p>This independently deployed remote receives identity and appearance through platform capabilities.</p>
              </Disclosure>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="No authenticated profile"
            description="Sign in through the Portal Host to verify authenticated profile states."
            action={<Button onClick={() => client.notify('Profile requires authentication')}>Notify host</Button>}
          />
        )}
      </article>
    </DesignSystemProvider>
  );
}

export default { manifest, Application };
