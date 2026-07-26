import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { Button, DesignSystemProvider } from '@fm/ratan-design-poc';
import { createWorkspaceStore, type TileRegistryEntry } from './workspaceStore';
import { TileSurface } from './TileSurface';
import type { TelemetryEvent } from './platformCapabilities';

interface Props {
  registry: TileRegistryEntry[];
  entitlements: string[];
}

function groupByCategory(entries: TileRegistryEntry[]) {
  return entries.reduce<Record<string, TileRegistryEntry[]>>((groups, entry) => {
    groups[entry.category] = [...(groups[entry.category] ?? []), entry];
    return groups;
  }, {});
}

export function PortalHost({ registry, entitlements }: Props) {
  const store = useMemo(() => createWorkspaceStore(registry, entitlements), [entitlements, registry]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const categories = useMemo(() => groupByCategory(state.availableTiles()), [state]);
  const telemetry = useRef<TelemetryEvent[]>([]);
  const recordTelemetry = useCallback((event: TelemetryEvent) => {
    telemetry.current.push(event);
  }, []);

  return (
    <DesignSystemProvider appearance={{ scheme: 'dark', density: 'compact', direction: 'ltr' }} scope="host">
      <div className="portal-shell">
        <header className="portal-header">
          <div>
            <span className="eyebrow">FMO NEXT</span>
            <h1>Operations Workspace</h1>
          </div>
          <span className="architecture-badge">Host → Tile</span>
        </header>
        <aside className="launcher" aria-label="Application menu">
          <h2>Applications</h2>
          {Object.entries(categories).map(([category, entries]) => (
            <section key={category} aria-label={category}>
              <h3>{category}</h3>
              {entries.map((entry) => (
                <Button
                  key={entry.tileId}
                  variant="secondary"
                  className="launcher-action"
                  aria-label={`Open ${entry.displayName}`}
                  onClick={() => state.openTile(entry.tileId)}
                >
                  Open {entry.displayName}
                </Button>
              ))}
            </section>
          ))}
        </aside>
        <main className="workspace" aria-label="Tile workspace">
          <div className="workspace-tabs" role="tablist" aria-label="Open tiles">
            {state.instances.map((instance) => (
              <div className="tab-group" key={instance.instanceId}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={state.activeInstanceId === instance.instanceId}
                  onClick={() => state.activate(instance.instanceId)}
                >
                  {instance.entry.displayName} {instance.instanceId.split('-').slice(-1)[0]}
                </button>
                <button type="button" aria-label={`Close ${instance.instanceId}`} onClick={() => state.close(instance.instanceId)}>×</button>
              </div>
            ))}
          </div>
          {state.instances.length === 0 ? (
            <section className="empty-workspace">
              <h2>Choose an application</h2>
              <p>Select an entitled Tile from the menu to open it here.</p>
            </section>
          ) : state.instances.map((instance) => (
            <TileSurface
              key={instance.instanceId}
              active={state.activeInstanceId === instance.instanceId}
              instance={instance}
              onClose={state.close}
              onTelemetry={recordTelemetry}
            />
          ))}
        </main>
      </div>
    </DesignSystemProvider>
  );
}
