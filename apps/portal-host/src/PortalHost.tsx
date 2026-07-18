import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  findApplicationForPath,
  IDENTITY_CONTRACT_VERSION,
  type AppearanceCapability,
  type AppearanceSnapshot,
  type ApplicationRegistry,
  type ApplicationRegistryEntry,
  type IdentityCapability,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { Button, DesignSystemProvider } from '@fm/ratan-design';
import { persistAppearance, readStoredAppearance } from './appearance';
import { RemoteApplication } from './RemoteApplication';
import { moduleFederationRuntime, type RemoteRuntime } from './remote';

interface Props { registry: ApplicationRegistry; runtime?: RemoteRuntime }
interface Tab { entry: ApplicationRegistryEntry; instanceId: string }

function navigate(path: string) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }

export function PortalHost({ registry, runtime = moduleFederationRuntime }: Props) {
  const counts = useRef<Record<string, number>>({});
  const initial = findApplicationForPath(registry.applications, window.location.pathname);
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (!initial) return [];
    counts.current[initial.id] = 1;
    return [{ entry: initial, instanceId: `${initial.id}-1` }];
  });
  const [activeId, setActiveId] = useState<string | null>(initial?.id ?? null);
  const [notification, setNotification] = useState<string | null>(null);
  const [appearance, setAppearance] = useState(() => readStoredAppearance(window.localStorage));
  const appearanceRef = useRef(appearance);
  const listeners = useRef(new Set<(snapshot: AppearanceSnapshot) => void>());
  appearanceRef.current = appearance;
  const appearanceCapability = useMemo<AppearanceCapability>(() => ({
    getSnapshot: () => appearanceRef.current,
    subscribe(listener) { listeners.current.add(listener); return () => listeners.current.delete(listener); },
  }), []);
  const identityCapability = useMemo<IdentityCapability>(() => {
    const snapshot = Object.freeze({
      state: 'anonymous' as const,
      contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    return Object.freeze({
      getSnapshot: () => snapshot,
      subscribe: () => () => undefined,
    });
  }, []);
  useEffect(() => { persistAppearance(window.localStorage, appearance); listeners.current.forEach((listener) => listener(appearance)); }, [appearance]);

  const open = useCallback((entry: ApplicationRegistryEntry, updatePath = true) => {
    setTabs((current) => {
      if (current.some((tab) => tab.entry.id === entry.id)) return current;
      const count = (counts.current[entry.id] ?? 0) + 1;
      counts.current[entry.id] = count;
      return [...current, { entry, instanceId: `${entry.id}-${count}` }];
    });
    setActiveId(entry.id);
    if (updatePath && window.location.pathname !== entry.basePath) navigate(entry.basePath);
  }, []);

  const close = useCallback((id: string) => {
    setTabs((current) => current.filter((tab) => tab.entry.id !== id));
    setActiveId(null);
    if (window.location.pathname !== '/') navigate('/');
  }, []);

  useEffect(() => {
    const sync = () => {
      const entry = findApplicationForPath(registry.applications, window.location.pathname);
      if (entry) open(entry, false); else setActiveId(null);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [open, registry.applications]);

  const active = tabs.find((tab) => tab.entry.id === activeId);
  const capabilities = useMemo<PlatformCapabilities | null>(() => active ? ({
    navigation: { navigate }, notifications: { show: setNotification },
    telemetry: { track: (event, data) => console.info('platform-event', { application: active.entry.id, event, data }) },
    workspace: { closeCurrent: () => close(active.entry.id) }, appearance: appearanceCapability,
    identity: identityCapability,
  }) : null, [active, appearanceCapability, close, identityCapability]);

  return (
    <DesignSystemProvider appearance={{ scheme: appearance.scheme, density: appearance.density, direction: appearance.direction }} scope="host">
      <div className="portal-shell">
        <header className="portal-header"><div><span>FMO NEXT</span><h1>Operations Workspace</h1></div><div className="host-actions">
          <Button variant="ghost" aria-label={`Use ${appearance.scheme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setAppearance((current) => { const scheme = current.scheme === 'dark' ? 'light' : 'dark'; return { ...current, scheme, preference: scheme }; })}>{appearance.scheme === 'dark' ? 'Light' : 'Dark'} theme</Button>
          <Button variant="ghost" aria-label={`Use ${appearance.density === 'compact' ? 'comfortable' : 'compact'} density`} onClick={() => setAppearance((current) => ({ ...current, density: current.density === 'compact' ? 'comfortable' : 'compact' }))}>{appearance.density === 'compact' ? 'Comfortable' : 'Compact'} density</Button>
          <strong>Host → Application</strong>
        </div></header>
        <aside className="launcher" aria-label="Application launcher"><h2>Applications</h2>{registry.applications.map((entry) => <Button key={entry.id} variant="secondary" aria-label={`Open ${entry.displayName}`} onClick={() => open(entry)}>Open {entry.displayName}</Button>)}<dl><div><dt>Composition</dt><dd>2 layers</dd></div><div><dt>Legacy runtime</dt><dd>None</dd></div></dl></aside>
        <main className="workspace"><div role="tablist" aria-label="Open applications">{tabs.map((tab) => <span className="tab" key={tab.instanceId}><button role="tab" aria-selected={tab.entry.id === activeId} onClick={() => open(tab.entry)}>{tab.entry.displayName}</button><button aria-label={`Close ${tab.entry.displayName}`} onClick={() => close(tab.entry.id)}>×</button></span>)}</div>
          <section className="workspace-surface" aria-label="Application workspace">{active && capabilities ? <RemoteApplication key={active.instanceId} entry={active.entry} instanceId={active.instanceId} capabilities={capabilities} runtime={runtime} /> : <div><h2>Choose an application</h2><p>The host loads it directly from the registry.</p></div>}</section>
        </main>
        {notification ? <div className="notification" role="status">{notification}<button aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button></div> : null}
      </div>
    </DesignSystemProvider>
  );
}
