import { useEffect, useState } from 'react';
import type { ApplicationRegistryEntry, FederatedApplicationModule, PlatformCapabilities } from '@fm/platform-contracts';
import { ApplicationBoundary } from './ApplicationBoundary';
import { loadFederatedApplication, type RemoteRuntime } from './remote';

interface Props { entry: ApplicationRegistryEntry; instanceId: string; capabilities: PlatformCapabilities; runtime: RemoteRuntime }
type State = { kind: 'loading' } | { kind: 'ready'; module: FederatedApplicationModule } | { kind: 'error'; error: Error };

export function RemoteApplication({ entry, instanceId, capabilities, runtime }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ kind: 'loading' });
  useEffect(() => {
    let active = true;
    setState({ kind: 'loading' });
    loadFederatedApplication(entry, runtime, attempt > 0)
      .then((module) => { if (active) setState({ kind: 'ready', module }); })
      .catch((reason: unknown) => { if (active) setState({ kind: 'error', error: reason instanceof Error ? reason : new Error(String(reason)) }); });
    return () => { active = false; };
  }, [attempt, entry, runtime]);
  if (state.kind === 'loading') return <div role="status">Loading {entry.displayName}…</div>;
  if (state.kind === 'error') return <section role="alert"><h2>Application unavailable</h2><p>{state.error.message}</p><button onClick={() => setAttempt((value) => value + 1)}>Retry {entry.displayName}</button></section>;
  const { Application } = state.module;
  return <ApplicationBoundary applicationName={entry.displayName} resetKey={`${instanceId}-${attempt}`}><Application instanceId={instanceId} basePath={entry.basePath} capabilities={capabilities} /></ApplicationBoundary>;
}
