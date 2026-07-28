import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  findApplicationForPath,
  type AppearanceCapability,
  type AppearanceSnapshot,
  type ApplicationRegistry,
  type ApplicationRegistryEntry,
  type IdentityCapability,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import {
  DescriptionList,
  DesignSystemProvider,
  EmptyState,
  PageHeader,
  SideNavigation,
  StatusBadge,
  Toast,
  ToggleButton,
  WorkspaceTabs,
} from '@fm/ratan-design';
import { persistAppearance, readStoredAppearance } from './appearance';
import { ANONYMOUS_IDENTITY_CAPABILITY } from './identity';
import { RemoteApplication } from './RemoteApplication';
import { moduleFederationRuntime, type RemoteRuntime } from './remote';

interface Props {
  readonly registry: ApplicationRegistry;
  readonly runtime?: RemoteRuntime;
  readonly identity?: IdentityCapability;
}
interface Tab { entry: ApplicationRegistryEntry; instanceId: string }

function navigate(path: string) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }

export function PortalHost({
  registry,
  runtime = moduleFederationRuntime,
  identity = ANONYMOUS_IDENTITY_CAPABILITY,
}: Props) {
  const counts = useRef<Record<string, number>>({});
  const initial = findApplicationForPath(registry.applications, window.location.pathname);
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (!initial) return [];
    counts.current[initial.id] = 1;
    return [{ entry: initial, instanceId: `${initial.id}-1` }];
  });
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(initial ? `${initial.id}-1` : null);
  const [notification, setNotification] = useState<string | null>(null);
  const [appearance, setAppearance] = useState(() => readStoredAppearance(window.localStorage));
  const appearanceRef = useRef(appearance);
  const listeners = useRef(new Set<(snapshot: AppearanceSnapshot) => void>());
  appearanceRef.current = appearance;
  const appearanceCapability = useMemo<AppearanceCapability>(() => ({
    getSnapshot: () => appearanceRef.current,
    subscribe(listener) { listeners.current.add(listener); return () => listeners.current.delete(listener); },
  }), []);
  useEffect(() => { persistAppearance(window.localStorage, appearance); listeners.current.forEach((listener) => listener(appearance)); }, [appearance]);

  const open = useCallback((entry: ApplicationRegistryEntry, updatePath = true) => {
    const count = (counts.current[entry.id] ?? 0) + 1;
    const instanceId = `${entry.id}-${count}`;
    counts.current[entry.id] = count;
    setTabs((current) => {
      return [...current, { entry, instanceId }];
    });
    setActiveInstanceId(instanceId);
    if (updatePath && window.location.pathname !== entry.basePath) navigate(entry.basePath);
  }, []);

  const close = useCallback((instanceId: string) => {
    const index = tabs.findIndex((tab) => tab.instanceId === instanceId);
    if (index < 0) return;
    const next = tabs.filter((tab) => tab.instanceId !== instanceId);
    setTabs(next);
    if (activeInstanceId !== instanceId) return;
    const replacement = next[Math.max(0, index - 1)] ?? next[0];
    setActiveInstanceId(replacement?.instanceId ?? null);
    if (replacement && window.location.pathname !== replacement.entry.basePath) navigate(replacement.entry.basePath);
    if (!replacement && window.location.pathname !== '/') navigate('/');
  }, [activeInstanceId, tabs]);

  useEffect(() => {
    const sync = () => {
      const entry = findApplicationForPath(registry.applications, window.location.pathname);
      if (!entry) {
        setActiveInstanceId(null);
        return;
      }
      const existing = tabs.find((tab) => tab.entry.id === entry.id);
      if (existing) setActiveInstanceId(existing.instanceId);
      else if (counts.current[entry.id]) setActiveInstanceId(`${entry.id}-${counts.current[entry.id]}`);
      else open(entry, false);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [open, registry.applications, tabs]);

  const active = tabs.find((tab) => tab.instanceId === activeInstanceId);
  const capabilities = useMemo<PlatformCapabilities | null>(() => active ? ({
    navigation: { navigate }, notifications: { show: setNotification },
    telemetry: { track: (event, data) => console.info('platform-event', { application: active.entry.id, event, data }) },
    workspace: { closeCurrent: () => close(active.instanceId) }, appearance: appearanceCapability,
    identity,
  }) : null, [active, appearanceCapability, close, identity]);
  const launcherItems = useMemo(() => registry.applications.map((entry) => ({
    id: entry.id,
    label: entry.displayName,
    ariaLabel: `Open ${entry.displayName}`,
    description: entry.basePath,
    trailingContent: '+',
  })), [registry.applications]);
  const openFromLauncher = useCallback((id: string) => {
    const entry = registry.applications.find((application) => application.id === id);
    if (entry) open(entry);
  }, [open, registry.applications]);

  return (
    <DesignSystemProvider appearance={{ scheme: appearance.scheme, density: appearance.density, direction: appearance.direction }} scope="host">
      <div className="portal-shell">
        <PageHeader
          className="portal-header"
          eyebrow="FMO NEXT · TWO-LAYER RUNTIME"
          title="Operations Workspace"
          description="Launch and manage independently deployed post-trade applications."
          actions={(
            <>
              <ToggleButton
                selected={appearance.scheme === 'dark'}
                ariaLabel={`Use ${appearance.scheme === 'dark' ? 'light' : 'dark'} theme`}
                onChange={(selected) => setAppearance((current) => {
                  const scheme = selected ? 'dark' : 'light';
                  return { ...current, scheme, preference: scheme };
                })}
              >
                {appearance.scheme === 'dark' ? 'Dark' : 'Light'} theme
              </ToggleButton>
              <ToggleButton
                selected={appearance.density === 'compact'}
                ariaLabel={`Use ${appearance.density === 'compact' ? 'comfortable' : 'compact'} density`}
                onChange={(selected) => setAppearance((current) => ({
                  ...current,
                  density: selected ? 'compact' : 'comfortable',
                }))}
              >
                {appearance.density === 'compact' ? 'Compact' : 'Comfortable'} density
              </ToggleButton>
              <StatusBadge status="neutral">Host → Application</StatusBadge>
            </>
          )}
        />
        <aside className="launcher">
          <SideNavigation
            ariaLabel="Application launcher"
            items={launcherItems}
            selectedId={active?.entry.id}
            title="Applications"
            onAction={openFromLauncher}
          />
          <DescriptionList
            className="launcher-metrics"
            items={[
              { id: 'composition', term: 'Composition', description: '2 layers' },
              { id: 'legacy', term: 'Legacy runtime', description: 'None' },
            ]}
          />
        </aside>
        <main className="workspace">
          <section className="workspace-surface" aria-label="Application workspace">
            <WorkspaceTabs
              ariaLabel="Open applications"
              selectedId={activeInstanceId}
              onClose={close}
              onSelectionChange={setActiveInstanceId}
              tabs={tabs.map((tab) => {
                const ordinal = tab.instanceId.split('-').slice(-1)[0];
                const tabCapabilities = tab.instanceId === activeInstanceId && capabilities
                  ? capabilities
                  : {
                    navigation: { navigate },
                    notifications: { show: setNotification },
                    telemetry: {
                      track: (event: string, data?: Record<string, unknown>) => console.info(
                        'platform-event',
                        { application: tab.entry.id, event, data },
                      ),
                    },
                    workspace: { closeCurrent: () => close(tab.instanceId) },
                    appearance: appearanceCapability,
                    identity,
                  };
                return {
                  id: tab.instanceId,
                  label: `${tab.entry.displayName} ${ordinal}`,
                  closeLabel: `Close ${tab.entry.displayName}${tab.instanceId.endsWith('-1') ? '' : ` ${ordinal}`}`,
                  content: (
                    <RemoteApplication
                      entry={tab.entry}
                      instanceId={tab.instanceId}
                      capabilities={tabCapabilities}
                      runtime={runtime}
                    />
                  ),
                };
              })}
            />
            {!active ? (
              <EmptyState
                title="Choose an application"
                description="The host loads it directly from the registry."
                icon="+"
              />
            ) : null}
          </section>
        </main>
        {notification ? <Toast className="notification" message={notification} tone="success" onDismiss={() => setNotification(null)} /> : null}
      </div>
    </DesignSystemProvider>
  );
}
