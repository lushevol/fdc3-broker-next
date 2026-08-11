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
import { persistAppearance, readStoredAppearance } from './appearance';
import { ANONYMOUS_IDENTITY_CAPABILITY } from './identity';
import { RemoteApplication } from './RemoteApplication';
import { moduleFederationRuntime, type RemoteRuntime } from './remote';
import {
  ScAvatar,
  ScBadge,
  ScButton,
  ScCard,
  ScDialog,
  ScIconButton,
  ScMenu,
  ScMenuItem,
  ScParagraph,
  ScTab,
  ScTabGroup,
  ScTabPanel,
  ScTextInput,
  ScToast,
  ScTitle,
} from './webkit';

interface Props {
  readonly registry: ApplicationRegistry;
  readonly runtime?: RemoteRuntime;
  readonly identity?: IdentityCapability;
  readonly onLogout?: () => void;
}
interface Tab {
  entry: ApplicationRegistryEntry;
  instanceId: string;
}

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
  return (
    TILE_METADATA[entry.id] ?? {
      category: 'Platform',
      icon: '◇',
      description: `Open ${entry.displayName} in a dedicated workspace tab.`,
    }
  );
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

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
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(
    initial ? `${initial.id}-1` : null,
  );
  const [notification, setNotification] = useState<string | null>(null);
  const [tilePickerOpen, setTilePickerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tileSearch, setTileSearch] = useState('');
  const [appearance, setAppearance] = useState(() => readStoredAppearance(window.localStorage));
  const appearanceRef = useRef(appearance);
  const listeners = useRef(new Set<(snapshot: AppearanceSnapshot) => void>());
  appearanceRef.current = appearance;
  const appearanceCapability = useMemo<AppearanceCapability>(
    () => ({
      getSnapshot: () => appearanceRef.current,
      subscribe(listener) {
        listeners.current.add(listener);
        return () => listeners.current.delete(listener);
      },
    }),
    [],
  );
  useEffect(() => {
    persistAppearance(window.localStorage, appearance);
    listeners.current.forEach((listener) => listener(appearance));
  }, [appearance]);

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

  const close = useCallback(
    (instanceId: string) => {
      const index = tabs.findIndex((tab) => tab.instanceId === instanceId);
      if (index < 0) return;
      const next = tabs.filter((tab) => tab.instanceId !== instanceId);
      setTabs(next);
      if (activeInstanceId !== instanceId) return;
      const replacement = next[Math.max(0, index - 1)] ?? next[0];
      setActiveInstanceId(replacement?.instanceId ?? null);
      if (replacement && window.location.pathname !== replacement.entry.basePath)
        navigate(replacement.entry.basePath);
      if (!replacement && window.location.pathname !== '/') navigate('/');
    },
    [activeInstanceId, tabs],
  );

  useEffect(() => {
    const sync = () => {
      const entry = findApplicationForPath(registry.applications, window.location.pathname);
      if (!entry) {
        setActiveInstanceId(null);
        return;
      }
      const existing = tabs.find((tab) => tab.entry.id === entry.id);
      if (existing) setActiveInstanceId(existing.instanceId);
      else if (counts.current[entry.id])
        setActiveInstanceId(`${entry.id}-${counts.current[entry.id]}`);
      else open(entry, false);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [open, registry.applications, tabs]);

  const active = tabs.find((tab) => tab.instanceId === activeInstanceId);
  const capabilities = useMemo<PlatformCapabilities | null>(
    () =>
      active
        ? {
            navigation: { navigate },
            notifications: { show: setNotification },
            telemetry: {
              track: (event, data) =>
                console.info('platform-event', { application: active.entry.id, event, data }),
            },
            workspace: { closeCurrent: () => close(active.instanceId) },
            appearance: appearanceCapability,
            identity,
          }
        : null,
    [active, appearanceCapability, close, identity],
  );
  const tilesByCategory = useMemo(() => {
    const search = tileSearch.trim().toLocaleLowerCase();
    const matching = registry.applications.filter((entry) => {
      const tile = tileMetadata(entry);
      return (
        !search ||
        entry.displayName.toLocaleLowerCase().includes(search) ||
        tile.description.toLocaleLowerCase().includes(search)
      );
    });
    return Array.from(
      matching
        .reduce((groups, entry) => {
          const tile = tileMetadata(entry);
          const entries = groups.get(tile.category) ?? [];
          entries.push(entry);
          groups.set(tile.category, entries);
          return groups;
        }, new Map<string, ApplicationRegistryEntry[]>())
        .entries(),
    ).sort(([left], [right]) => left.localeCompare(right));
  }, [registry.applications, tileSearch]);
  const identitySnapshot = identity.getSnapshot();
  const avatarName =
    identitySnapshot.state === 'authenticated' ? identitySnapshot.userId : 'Operations user';
  const openTile = useCallback(
    (entry: ApplicationRegistryEntry) => {
      open(entry);
      setTilePickerOpen(false);
      setTileSearch('');
    },
    [open],
  );

  return (
    <div
      className="ratan-webkit-root"
      data-ratan-scope="host"
      data-ratan-theme={appearance.scheme}
      data-ratan-density={appearance.density}
      data-design-system="ratan-webkit"
      dir={appearance.direction}
    >
      <div className="portal-shell">
        <header className="portal-app-bar">
          <ScTitle level={1}>Markets Operations One</ScTitle>
          <div className="portal-app-bar-actions">
            <ScButton
              type="primary"
              role="button"
              aria-label="New tile"
              onClick={() => setTilePickerOpen(true)}
            >
              New tile
            </ScButton>
            <ScButton
              type="text"
              role="button"
              aria-label={`Use ${appearance.scheme === 'dark' ? 'light' : 'dark'} theme`}
              selectable="toggle"
              selected={appearance.scheme === 'dark'}
              onClick={() =>
                setAppearance((current) => {
                  const scheme = current.scheme === 'dark' ? 'light' : 'dark';
                  return { ...current, scheme, preference: scheme };
                })
              }
            >
              Theme
            </ScButton>
            <ScIconButton
              name="notification"
              role="button"
              aria-label="Notifications"
              onClick={() => setNotification('No new notifications.')}
            />
            <div className="portal-user-menu">
              <ScAvatar
                className="portal-avatar-trigger"
                id={avatarName}
                size="sm"
                clickable
                role="button"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {avatarName.slice(0, 1).toUpperCase()}
              </ScAvatar>
              {userMenuOpen ? (
                <ScMenu
                  aria-label="User actions"
                  onScSelect={(event: CustomEvent<{ item: { value: string } }>) => {
                    const action = event.detail.item.value;
                    setUserMenuOpen(false);
                    if (action === 'logout') onLogout?.();
                    else setNotification('Profile is not available in this pilot.');
                  }}
                >
                  <ScMenuItem value="profile" role="menuitem" aria-label="Profile">
                    Profile
                  </ScMenuItem>
                  <ScMenuItem value="logout" role="menuitem" aria-label="Logout">
                    Logout
                  </ScMenuItem>
                </ScMenu>
              ) : null}
            </div>
          </div>
        </header>
        <main className="workspace">
          <section className="workspace-surface" aria-label="Application workspace">
            <ScTabGroup
              aria-label="Open applications"
              onScTabSelect={(event: CustomEvent<{ name: string }>) =>
                setActiveInstanceId(event.detail.name)
              }
            >
              {tabs.map((tab) => {
                const ordinal = tab.instanceId.split('-').slice(-1)[0];
                return (
                  <ScTab
                    key={tab.instanceId}
                    slot="nav"
                    panel={tab.instanceId}
                    active={tab.instanceId === activeInstanceId}
                    closable
                    aria-label={`${tab.entry.displayName} ${ordinal}`}
                    title={`Close ${tab.entry.displayName}${tab.instanceId.endsWith('-1') ? '' : ` ${ordinal}`}`}
                    onScClose={(event: CustomEvent) => {
                      event.stopPropagation();
                      close(tab.instanceId);
                    }}
                  >
                    {tab.entry.displayName} {ordinal}
                  </ScTab>
                );
              })}
              {tabs.map((tab) => {
                const tabCapabilities =
                  tab.instanceId === activeInstanceId && capabilities
                    ? capabilities
                    : {
                        navigation: { navigate },
                        notifications: { show: setNotification },
                        telemetry: {
                          track: (event: string, data?: Record<string, unknown>) =>
                            console.info('platform-event', {
                              application: tab.entry.id,
                              event,
                              data,
                            }),
                        },
                        workspace: { closeCurrent: () => close(tab.instanceId) },
                        appearance: appearanceCapability,
                        identity,
                      };
                return (
                  <ScTabPanel
                    key={tab.instanceId}
                    name={tab.instanceId}
                    active={tab.instanceId === activeInstanceId}
                  >
                    <RemoteApplication
                      entry={tab.entry}
                      instanceId={tab.instanceId}
                      capabilities={tabCapabilities}
                      runtime={runtime}
                    />
                  </ScTabPanel>
                );
              })}
            </ScTabGroup>
            {!active ? (
              <section className="portal-empty-state">
                <span aria-hidden="true">+</span>
                <ScTitle level={2}>Choose an application</ScTitle>
                <ScParagraph>The host loads it directly from the registry.</ScParagraph>
              </section>
            ) : null}
          </section>
        </main>
        {tilePickerOpen ? (
          <ScDialog
            open
            label="New tile"
            role="dialog"
            aria-label="New tile"
            style={{ '--width': '50rem' }}
            onScHide={() => setTilePickerOpen(false)}
          >
            <ScParagraph>
              Search the application catalog, then open a tile in this workspace.
            </ScParagraph>
            <ScTextInput
              id="tile-search"
              label="Search tiles"
              role="textbox"
              aria-label="Search tiles"
              placeholder="Search by title or description"
              value={tileSearch}
              onScInput={(event: CustomEvent<{ value: string }>) =>
                setTileSearch(event.detail.value)
              }
            />
            <div className="tile-picker-results">
              {tilesByCategory.length ? (
                tilesByCategory.map(([category, entries]) => (
                  <section
                    key={category}
                    className="tile-picker-category"
                    aria-labelledby={`tile-category-${category}`}
                  >
                    <ScTitle level={2} id={`tile-category-${category}`}>
                      {category}
                    </ScTitle>
                    <div className="tile-picker-grid">
                      {entries.map((entry) => {
                        const tile = tileMetadata(entry);
                        return (
                          <ScCard key={entry.id} className="tile-picker-tile">
                            <div className="tile-picker-tile-content">
                              <ScTitle level={3}>{entry.displayName}</ScTitle>
                              <ScParagraph>{tile.description}</ScParagraph>
                              <span className="tile-picker-icon" aria-hidden="true">
                                {tile.icon}
                              </span>
                              <ScBadge
                                type="text"
                                color="green"
                                label="Available"
                                aria-label="Available"
                              />
                              <ScButton
                                type="secondary"
                                role="button"
                                aria-label={`Open ${entry.displayName}`}
                                onClick={() => openTile(entry)}
                              >
                                Open
                              </ScButton>
                            </div>
                          </ScCard>
                        );
                      })}
                    </div>
                  </section>
                ))
              ) : (
                <section className="portal-empty-state">
                  <span aria-hidden="true">?</span>
                  <ScTitle level={2}>No matching tiles</ScTitle>
                  <ScParagraph>Try a different title or description.</ScParagraph>
                </section>
              )}
            </div>
          </ScDialog>
        ) : null}
        {notification ? (
          <div className="notification" role="status">
            <ScToast
              open
              closable
              type="success"
              title="Notification"
              onScHide={() => setNotification(null)}
            >
              {notification}
            </ScToast>
          </div>
        ) : null}
      </div>
    </div>
  );
}
