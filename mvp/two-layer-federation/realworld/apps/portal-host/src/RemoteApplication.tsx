import { useEffect, useRef, useState } from 'react';
import type { ApplicationRegistryEntry, FederatedApplicationModule, PlatformCapabilities } from '@fm/platform-contracts';
import {
  Button,
  ErrorState,
  ProgressCircle,
} from '@fm/ratan-design-webkit';
import { ApplicationBoundary } from './ApplicationBoundary';
import { loadFederatedApplication, type RemoteRuntime } from './remote';

interface Props { entry: ApplicationRegistryEntry; instanceId: string; capabilities: PlatformCapabilities; runtime: RemoteRuntime }
type State = { kind: 'loading' } | { kind: 'ready'; module: FederatedApplicationModule } | { kind: 'error'; error: Error };

function IsolatedRemoteApplication({ module, entry, instanceId, capabilities }: {
  module: FederatedApplicationModule; entry: ApplicationRegistryEntry; instanceId: string; capabilities: PlatformCapabilities;
}) {
  const surface = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const surfaceElement = surface.current;
    const root = surfaceElement;
    if (!root || !module.mount) return;
    surfaceElement.dataset.mounted = 'pending';
    void Promise.resolve(module.mount({ root, instanceId, basePath: entry.basePath, capabilities }))
      .then(() => { if (surface.current) surface.current.dataset.mounted = 'true'; })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason : new Error(String(reason))));
    return () => { void module.unmount?.(instanceId); };
  }, [capabilities, entry.basePath, instanceId, module]);
  if (error) {
    return <ErrorState title="Application unavailable" message={error.message} />;
  }
  return <div ref={surface} data-composition-boundary="independent-react-root" data-remote-instance-id={instanceId} />;
}

export function RemoteApplication({ entry, instanceId, capabilities, runtime }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ kind: 'loading' });
  useEffect(() => {
    let active = true;
    setState({ kind: 'loading' });
    loadFederatedApplication(entry, runtime, attempt > 0)
      .then((module) => { if (active) setState({ kind: 'ready', module }); })
      .catch((reason: unknown) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        console.error(`Federated application load failure\n${error.stack ?? error.message}`);
        if (active) setState({ kind: 'error', error });
      });
    return () => { active = false; };
  }, [attempt, entry, runtime]);
  if (state.kind === 'loading') {
    return (
      <div className="remote-status" role="status">
        <ProgressCircle label={`Loading ${entry.displayName}`} />
        <span>Loading {entry.displayName}…</span>
      </div>
    );
  }
  if (state.kind === 'error') {
    return (
      <ErrorState
        title="Application unavailable"
        message={state.error.message}
        action={(
          <Button onClick={() => setAttempt((value) => value + 1)}>
            Retry {entry.displayName}
          </Button>
        )}
      />
    );
  }
  const { Application } = state.module;
  if (state.module.mount) return <IsolatedRemoteApplication module={state.module} entry={entry} instanceId={instanceId} capabilities={capabilities} />;
  return <ApplicationBoundary applicationName={entry.displayName} resetKey={`${instanceId}-${attempt}`}><Application instanceId={instanceId} basePath={entry.basePath} capabilities={capabilities} /></ApplicationBoundary>;
}
