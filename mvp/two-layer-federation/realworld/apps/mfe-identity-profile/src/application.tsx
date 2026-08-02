import '@webcomponents/scoped-custom-element-registry';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationManifest,
  type ApplicationProps,
} from '@fm/platform-contracts';
import { createPlatformClient } from '@fm/platform-sdk';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import './styles.css';
import { ScAvatar, ScBadge, ScButton, ScCard } from './webkit';

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
  const [runtimeExpanded, setRuntimeExpanded] = useState(false);

  return (
    <div className="profile-webkit-scope" data-scheme={appearance.scheme} data-density={appearance.density} dir={appearance.direction}>
      <article className="profile-app" data-instance-id={instanceId}>
        <header className="profile-page-header">
          <div>
            <span className="profile-kicker">Component verification / identity</span>
            <h1>Operator profile</h1>
          </div>
          <ScBadge type="text" color={identity?.state === 'authenticated' ? 'green' : 'grey'} label={identity?.state ?? 'anonymous'} aria-label={identity?.state ?? 'anonymous'} />
        </header>
        {identity?.state === 'authenticated' ? (
          <div className="profile-grid">
            <ScCard>
              <div className="profile-summary">
                <ScAvatar id={identity.userId} size="lg" aria-label={identity.userId}>{identity.userId.slice(0, 1).toUpperCase()}</ScAvatar>
                <div>
                  <h2>{identity.userId}</h2>
                  <p>Financial Markets Operations</p>
                </div>
              </div>
              <div className="profile-permissions" aria-label="Permissions">
                {identity.permissions.map((permission) => <ScBadge key={permission} type="text" color="blue" label={permission} aria-label={permission} />)}
              </div>
            </ScCard>
            <ScCard>
              <h2>Assignment</h2>
              <p>Host-delivered identity metadata</p>
              <dl className="profile-description-list">
                <div><dt>Desk</dt><dd>Post trade operations</dd></div>
                <div><dt>Region</dt><dd>Singapore</dd></div>
                <div><dt>Session</dt><dd>{instanceId}</dd></div>
                <div><dt>Contract</dt><dd>{identity.contractVersion}</dd></div>
              </dl>
            </ScCard>
            <ScCard>
              <h2>Access details</h2>
              <section className="profile-disclosure">
                <ScButton type="tertiary" role="button" aria-expanded="true">Role responsibilities</ScButton>
                <p>Review exceptions, manage settlements, and coordinate operational controls.</p>
              </section>
              <section className="profile-disclosure">
                <ScButton type="tertiary" role="button" aria-expanded={runtimeExpanded} onClick={() => setRuntimeExpanded((expanded) => !expanded)}>Runtime evidence</ScButton>
                {runtimeExpanded ? <p>This independently deployed remote receives identity and appearance through platform capabilities.</p> : null}
              </section>
            </ScCard>
          </div>
        ) : (
          <ScCard className="profile-empty-state">
            <h2>No authenticated profile</h2>
            <p>Sign in through the Portal Host to verify authenticated profile states.</p>
            <ScButton type="primary" role="button" onClick={() => client.notify('Profile requires authentication')}>Notify host</ScButton>
          </ScCard>
        )}
      </article>
    </div>
  );
}

export default { manifest, Application };
