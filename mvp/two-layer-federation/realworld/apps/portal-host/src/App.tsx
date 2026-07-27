import { useEffect, useState } from 'react';
import type { ApplicationRegistry, IdentityCapability } from '@fm/platform-contracts';
import {
  Button,
  DesignSystemProvider,
  ErrorState,
  ProgressCircle,
} from '@fm/ratan-design';
import { PortalHost } from './PortalHost';
import {
  createIdentityCapability,
  DEMO_AUTHENTICATION_ADAPTER,
  type AuthenticationAdapter,
} from './authentication';
import { ANONYMOUS_IDENTITY_CAPABILITY } from './identity';
import { LoginScreen } from './LoginScreen';
import { loadApplicationRegistry } from './registry';

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
    loadApplicationRegistry().then((value) => { if (active) setRegistry(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason : new Error(String(reason))); });
    return () => { active = false; };
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
      <DesignSystemProvider
        appearance={{ scheme: 'dark', density: 'comfortable', direction: 'ltr' }}
        scope="host"
      >
        <main className="host-status-surface">
          <ErrorState
            title="Portal registry unavailable"
            message={error.message}
            action={(
              <Button onClick={() => setAttempt((value) => value + 1)}>
                Retry registry
              </Button>
            )}
          />
        </main>
      </DesignSystemProvider>
    );
  }
  if (!registry) {
    return (
      <DesignSystemProvider
        appearance={{ scheme: 'dark', density: 'comfortable', direction: 'ltr' }}
        scope="host"
      >
        <main className="host-status-surface" role="status">
          <ProgressCircle label="Loading application registry" />
          <span>Loading application registry…</span>
        </main>
      </DesignSystemProvider>
    );
  }
  return <PortalHost registry={registry} identity={activeIdentity} />;
}
