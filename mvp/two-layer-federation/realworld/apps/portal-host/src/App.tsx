import { useEffect, useState } from 'react';
import type { ApplicationRegistry, IdentityCapability } from '@fm/platform-contracts';
import { PortalHost } from './PortalHost';
import {
  createIdentityCapability,
  DEMO_AUTHENTICATION_ADAPTER,
  type AuthenticationAdapter,
} from './authentication';
import { ANONYMOUS_IDENTITY_CAPABILITY } from './identity';
import { LoginScreen } from './LoginScreen';
import { loadApplicationRegistry } from './registry';
import { ScAlert, ScButton, ScParagraph, ScSpinner } from './webkit';

interface AppProps {
  readonly identity?: IdentityCapability;
  readonly authentication?: AuthenticationAdapter;
}

export function App({
  identity = ANONYMOUS_IDENTITY_CAPABILITY,
  authentication = DEMO_AUTHENTICATION_ADAPTER,
}: AppProps = {}) {
  const [activeIdentity, setActiveIdentity] = useState<IdentityCapability | null>(
    identity.getSnapshot().state === 'authenticated' ? identity : null,
  );
  const [attempt, setAttempt] = useState(0);
  const [registry, setRegistry] = useState<ApplicationRegistry | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!activeIdentity) return undefined;
    let active = true;
    setError(null);
    loadApplicationRegistry()
      .then((value) => {
        if (active) setRegistry(value);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason : new Error(String(reason)));
      });
    return () => {
      active = false;
    };
  }, [activeIdentity, attempt]);
  if (!activeIdentity) {
    return (
      <LoginScreen
        authentication={authentication}
        onAuthenticated={async (credentials) => {
          const snapshot = await authentication.authenticate(credentials);
          if (snapshot.state !== 'authenticated') {
            throw new Error('Authentication did not create a signed-in session.');
          }
          setActiveIdentity(createIdentityCapability(snapshot));
        }}
      />
    );
  }
  if (error) {
    return (
      <div
        className="ratan-webkit-root"
        data-ratan-scope="host"
        data-ratan-theme="dark"
        data-ratan-density="comfortable"
        data-design-system="ratan-webkit"
        dir="ltr"
      >
        <main className="host-status-surface">
          <ScAlert role="alert" title="Portal registry unavailable" type="error" icon>
            <ScParagraph>{error.message}</ScParagraph>
            <ScButton
              type="primary"
              role="button"
              aria-label="Retry registry"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Retry registry
            </ScButton>
          </ScAlert>
        </main>
      </div>
    );
  }
  if (!registry) {
    return (
      <div
        className="ratan-webkit-root"
        data-ratan-scope="host"
        data-ratan-theme="dark"
        data-ratan-density="comfortable"
        data-design-system="ratan-webkit"
        dir="ltr"
      >
        <main className="host-status-surface" role="status">
          <ScSpinner aria-label="Loading application registry" role="progressbar" />
          <ScParagraph>Loading application registry…</ScParagraph>
        </main>
      </div>
    );
  }
  return (
    <PortalHost
      registry={registry}
      identity={activeIdentity}
      onLogout={() => setActiveIdentity(null)}
    />
  );
}
