import { useEffect, useState } from 'react';
import type { ApplicationRegistry } from '@fm/platform-contracts-poc';
import { PortalHost } from './PortalHost';
import { loadApplicationRegistry } from './registry';

export function App() {
  const [attempt, setAttempt] = useState(0);
  const [registry, setRegistry] = useState<ApplicationRegistry | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    loadApplicationRegistry()
      .then((result) => {
        if (active) setRegistry(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason : new Error(String(reason)));
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  if (error) {
    return (
      <main className="bootstrap-error" role="alert">
        <h1>Portal registry unavailable</h1>
        <p>{error.message}</p>
        <button type="button" onClick={() => setAttempt((value) => value + 1)}>Retry registry</button>
      </main>
    );
  }
  if (!registry) return <main className="bootstrap-loading" role="status">Loading application registry…</main>;
  return <PortalHost registry={registry} />;
}
