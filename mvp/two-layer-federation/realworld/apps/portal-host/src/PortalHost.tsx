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
  ActionMenu,
  Avatar,
  Button,
  Card,
  DesignSystemProvider,
  Dialog,
  EmptyState,
  IconButton,
  PageHeader,
  TextField,
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
  readonly onLogout?: () => void;
}
interface Tab { entry: ApplicationRegistryEntry; instanceId: string }

interface TileMetadata {
  readonly category: string;
  readonly icon: string;
  readonly description: string;
}

const TILE_METADATA: Record<string, TileMetadata> = {
  cashflow: {
    category: 'Operations',
    icon: '↗',
    description: 'Monitor liquidity, intraday cash movements, and funding exposure.',
  },
};

function tileMetadata(entry: ApplicationRegistryEntry): TileMetadata {
  return TILE_METADATA[entry.id] ?? {
    category: 'Platform',
    icon: '◇',
    description: `Open ${entry.displayName} in a dedicated workspace tab.`,
  };
}

function navigate(path: string) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); }

export function PortalHost({
  registry,
  runtime = moduleFederationRuntime,
  identity = ANONYMOUS_IDENTITY_CAPABILITY,
  onLogout,
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
  const [tilePickerOpen, setTilePickerOpen] = useState(false);
  const [tileSearch, setTileSearch] = useState('');
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
  const tilesByCategory = useMemo(() => {
    const search = tileSearch.trim().toLocaleLowerCase();
    const matching = registry.applications.filter((entry) => {
      const tile = tileMetadata(entry);
      return !search
        || entry.displayName.toLocaleLowerCase().includes(search)
        || tile.description.toLocaleLowerCase().includes(search);
    });
    return Array.from(matching.reduce((groups, entry) => {
      const tile = tileMetadata(entry);
      const entries = groups.get(tile.category) ?? [];
      entries.push(entry);
      groups.set(tile.category, entries);
      return groups;
    }, new Map<string, ApplicationRegistryEntry[]>()).entries())
      .sort(([left], [right]) => left.localeCompare(right));
  }, [registry.applications, tileSearch]);
  const identitySnapshot = identity.getSnapshot();
  const avatarName = identitySnapshot.state === 'authenticated' ? identitySnapshot.userId : 'Operations user';
  const openTile = useCallback((entry: ApplicationRegistryEntry) => {
    open(entry);
    setTilePickerOpen(false);
    setTileSearch('');
  }, [open]);

  return (
    <DesignSystemProvider appearance={{ scheme: appearance.scheme, density: appearance.density, direction: appearance.direction }} scope="host">
      <div className="portal-shell">
        <PageHeader
          className="portal-app-bar"
          title="Markets Operations One"
          actions={(
            <>
              <Button variant="primary" onClick={() => setTilePickerOpen(true)}>New tile</Button>
              <ToggleButton
                selected={appearance.scheme === 'dark'}
                ariaLabel={`Use ${appearance.scheme === 'dark' ? 'light' : 'dark'} theme`}
                onChange={(selected) => setAppearance((current) => {
                  const scheme = selected ? 'dark' : 'light';
                  return { ...current, scheme, preference: scheme };
                })}
              >
                Theme
              </ToggleButton>
              <IconButton label="Notifications" icon="●" onClick={() => setNotification('No new notifications.')} />
              <ActionMenu
                ariaLabel="User actions"
                trigger={<Button className="portal-avatar-trigger" variant="ghost" aria-label="Open user menu"><Avatar name={avatarName} size="small" /></Button>}
                items={[{ id: 'profile', label: 'Profile' }, { id: 'logout', label: 'Logout', tone: 'danger' }]}
                onAction={(action) => {
                  if (action === 'logout') onLogout?.();
                  else setNotification('Profile is not available in this pilot.');
                }}
              />
            </>
          )}
        />
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
        <Dialog
          open={tilePickerOpen}
          title="New tile"
          description="Search the application catalog, then open a tile in this workspace."
          width="large"
          onClose={() => setTilePickerOpen(false)}
        >
          <TextField
            id="tile-search"
            label="Search tiles"
            placeholder="Search by title or description"
            value={tileSearch}
            onChange={setTileSearch}
          />
          <div className="tile-picker-results">
            {tilesByCategory.length ? tilesByCategory.map(([category, entries]) => (
              <section key={category} className="tile-picker-category" aria-labelledby={`tile-category-${category}`}>
                <h2 id={`tile-category-${category}`}>{category}</h2>
                <div className="tile-picker-grid">
                  {entries.map((entry) => {
                    const tile = tileMetadata(entry);
                    return (
                      <Card
                        key={entry.id}
                        className="tile-picker-tile"
                        title={entry.displayName}
                        description={tile.description}
                        actions={<Button aria-label={`Open ${entry.displayName}`} variant="secondary" onClick={() => openTile(entry)}>Open</Button>}
                      >
                        <span className="tile-picker-icon" aria-hidden="true">{tile.icon}</span>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )) : <EmptyState title="No matching tiles" description="Try a different title or description." icon="?" />}
          </div>
        </Dialog>
        {notification ? <Toast className="notification" message={notification} tone="success" onDismiss={() => setNotification(null)} /> : null}
      </div>
    </DesignSystemProvider>
  );
}
