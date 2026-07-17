import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  findApplicationForPath,
  type ApplicationRegistry,
  type ApplicationRegistryEntry,
  type PlatformCapabilities,
} from '@fm/platform-contracts-poc';
import { RemoteApplication } from './RemoteApplication';
import { moduleFederationRuntime, type RemoteRuntime } from './remote';

interface Props {
  registry: ApplicationRegistry;
  runtime?: RemoteRuntime;
}

interface WorkspaceTab {
  entry: ApplicationRegistryEntry;
  instanceId: string;
}

function changeBrowserPath(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function PortalHost({ registry, runtime = moduleFederationRuntime }: Props) {
  const instanceCounts = useRef<Record<string, number>>({});
  const initialEntry = findApplicationForPath(registry.applications, window.location.pathname);
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    if (!initialEntry) return [];
    instanceCounts.current[initialEntry.id] = 1;
    return [{ entry: initialEntry, instanceId: `${initialEntry.id}-1` }];
  });
  const [activeId, setActiveId] = useState<string | null>(initialEntry?.id ?? null);
  const [notification, setNotification] = useState<string | null>(null);

  const openApplication = useCallback((entry: ApplicationRegistryEntry, navigate = true) => {
    setTabs((current) => {
      if (current.some((tab) => tab.entry.id === entry.id)) return current;
      const next = (instanceCounts.current[entry.id] ?? 0) + 1;
      instanceCounts.current[entry.id] = next;
      return [...current, { entry, instanceId: `${entry.id}-${next}` }];
    });
    setActiveId(entry.id);
    if (navigate && window.location.pathname !== entry.basePath) changeBrowserPath(entry.basePath);
  }, []);

  const closeApplication = useCallback((applicationId: string) => {
    setTabs((current) => current.filter((tab) => tab.entry.id !== applicationId));
    setActiveId(null);
    if (window.location.pathname !== '/') changeBrowserPath('/');
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      const entry = findApplicationForPath(registry.applications, window.location.pathname);
      if (entry) openApplication(entry, false);
      else setActiveId(null);
    };
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [openApplication, registry.applications]);

  const activeTab = tabs.find((tab) => tab.entry.id === activeId);
  const capabilities = useMemo<PlatformCapabilities | null>(() => {
    if (!activeTab) return null;
    return {
      navigation: { navigate: changeBrowserPath },
      notifications: { show: setNotification },
      telemetry: {
        track: (event, data) => console.info('platform-event', { application: activeTab.entry.id, event, data }),
      },
      workspace: { closeCurrent: () => closeApplication(activeTab.entry.id) },
    };
  }, [activeTab, closeApplication]);

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div>
          <span className="eyebrow">FMO NEXT</span>
          <h1>Operations Workspace</h1>
        </div>
        <div className="architecture-badge" data-testid="architecture-badge">Host → Application</div>
      </header>

      <aside className="launcher" aria-label="Application launcher">
        <h2>Applications</h2>
        <p>Runtime registry</p>
        {registry.applications.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-label={`Open ${entry.displayName}`}
            onClick={() => openApplication(entry)}
          >
            <span className="launcher-icon">{entry.displayName.slice(0, 2).toUpperCase()}</span>
            <span>Open {entry.displayName}</span>
          </button>
        ))}
        <dl className="runtime-facts">
          <div><dt>Composition</dt><dd>2 layers</dd></div>
          <div><dt>Loader</dt><dd>Federation</dd></div>
          <div><dt>Legacy runtime</dt><dd>None</dd></div>
        </dl>
      </aside>

      <main className="workspace">
        <div className="workspace-tabs" role="tablist" aria-label="Open applications">
          {tabs.map((tab) => (
            <div className="tab-group" key={tab.instanceId}>
              <button
                type="button"
                role="tab"
                aria-selected={tab.entry.id === activeId}
                onClick={() => openApplication(tab.entry)}
              >
                {tab.entry.displayName}
              </button>
              <button
                type="button"
                className="tab-close"
                aria-label={`Close ${tab.entry.displayName}`}
                onClick={() => closeApplication(tab.entry.id)}
              >×</button>
            </div>
          ))}
        </div>
        <section className="workspace-surface" aria-label="Application workspace">
          {activeTab && capabilities ? (
            <RemoteApplication
              key={activeTab.instanceId}
              entry={activeTab.entry}
              instanceId={activeTab.instanceId}
              capabilities={capabilities}
              runtime={runtime}
            />
          ) : (
            <div className="empty-workspace">
              <div className="empty-mark">+</div>
              <h2>Choose an application</h2>
              <p>The host will resolve and load it directly from the runtime registry.</p>
            </div>
          )}
        </section>
      </main>

      {notification ? (
        <div className="host-notification" role="status">
          <span>{notification}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button>
        </div>
      ) : null}
    </div>
  );
}
