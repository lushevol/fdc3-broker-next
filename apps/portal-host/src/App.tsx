import { useEffect, useState } from 'react';
import type { ApplicationRegistry, IdentityCapability } from '@fm/platform-contracts';
import { PortalHost } from './PortalHost';
import { ANONYMOUS_IDENTITY_CAPABILITY } from './identity';
import { loadApplicationRegistry } from './registry';

interface AppProps { readonly identity?: IdentityCapability }

export function App({ identity = ANONYMOUS_IDENTITY_CAPABILITY }: AppProps = {}) {
  const [attempt, setAttempt] = useState(0);
  const [registry, setRegistry] = useState<ApplicationRegistry | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true;
    setError(null);
    loadApplicationRegistry().then((value) => { if (active) setRegistry(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason : new Error(String(reason))); });
    return () => { active = false; };
  }, [attempt]);
  if (error) return <main role="alert"><h1>Portal registry unavailable</h1><p>{error.message}</p><button onClick={() => setAttempt((value) => value + 1)}>Retry registry</button></main>;
  if (!registry) return <main role="status">Loading application registry…</main>;
  return <PortalHost registry={registry} identity={identity} />;
}
