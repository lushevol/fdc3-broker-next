import Box from '@mui/material/Box';
import React, { type ReactElement, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import ErrorBoundry from '../ErrorBoundry';
import Splash from '../Splash';
import { type DrawerProps, type Tiles } from './common/interface';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton, ScTextInput } from '../webkit';
import MenuItem from './MenuItem';
import { ArrowDownAZ, ArrowUpZA, Clock3, LayoutGrid, Star } from 'lucide-react';

type SearchableTile = Tiles['tiles'][number] & { description?: string };
type LibraryView = 'all' | 'favorites' | 'frequent';

const FAVORITES_STORAGE_KEY = 'base.tile-library.favorites';
const USAGE_STORAGE_KEY = 'base.tile-library.usage';
const LegacyMenuItem = React.lazy(() => import('./MenuItem'));
const tileId = (tile: SearchableTile) => tile.tile || tile.module || tile.title;
const readStoredValue = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '') as T;
  } catch {
    return fallback;
  }
};

const Menu: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<LibraryView>('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortAscending, setSortAscending] = useState(true);
  const [favoriteTileIds, setFavoriteTileIds] = useState<Set<string>>(
    () => new Set(readStoredValue<string[]>(FAVORITES_STORAGE_KEY, [])),
  );
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(
    () => readStoredValue<Record<string, number>>(USAGE_STORAGE_KEY, {}),
  );
  const resultsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const categories = useMemo(() => (props.drawers ?? []).map((drawer) => drawer.label), [props.drawers]);
  const filteredDrawers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return (props.drawers ?? [])
      .map((drawer) => ({
        ...drawer,
        tiles: drawer.tiles
          .filter((tile) => {
            const searchable = tile as SearchableTile;
            const matchesView = view === 'all'
              || (view === 'favorites' && favoriteTileIds.has(tileId(searchable)))
              || (view === 'frequent' && (usageCounts[tileId(searchable)] ?? 0) > 0);
            return matchesView && (
              !normalizedSearch ||
              [searchable.title, searchable.subtitle, searchable.description]
                .filter(Boolean)
                .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch))
            );
          })
          .sort((left, right) => {
            if (view === 'frequent') {
              const usageDifference = (usageCounts[tileId(right)] ?? 0) - (usageCounts[tileId(left)] ?? 0);
              if (usageDifference) return usageDifference;
            }
            return left.title.localeCompare(right.title) * (sortAscending ? 1 : -1);
          }),
      }))
      .filter((drawer) => drawer.tiles.length > 0);
  }, [favoriteTileIds, props.drawers, search, sortAscending, usageCounts, view]);

  const selectCategory = useCallback((nextCategory: string) => {
    setView('all');
    setActiveCategory(nextCategory);
    if (nextCategory === 'All') {
      resultsRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetSection = Array.from(resultsRef.current?.querySelectorAll<HTMLElement>('[data-category]') ?? [])
      .find((section) => section.dataset.category === nextCategory);
    targetSection?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, []);

  const syncCategoryToScroll = useCallback(() => {
    if (view !== 'all' || !resultsRef.current) return;
    const sections = Array.from(resultsRef.current.querySelectorAll<HTMLElement>('[data-category]'));
    const isAtEnd = resultsRef.current.scrollTop + resultsRef.current.clientHeight
      >= resultsRef.current.scrollHeight - 2;
    const current = isAtEnd
      ? sections.at(-1)
      : sections.reduce<HTMLElement | undefined>((closest, section) => {
          if (section.getBoundingClientRect().top > resultsRef.current!.getBoundingClientRect().top + 32) return closest;
          return section;
        }, sections[0]);
    const nextCategory = current?.dataset.category ?? 'All';
    setActiveCategory(nextCategory);
    const targetNavigationItem = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('[data-nav-category]') ?? [])
      .find((item) => item.dataset.navCategory === nextCategory);
    targetNavigationItem?.scrollIntoView?.({ block: 'nearest' });
  }, [view]);

  const toggleFavorite = useCallback((tile: SearchableTile) => {
    setFavoriteTileIds((current) => {
      const next = new Set(current);
      const id = tileId(tile);
      if (next.has(id)) next.delete(id); else next.add(id);
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const trackOpen = useCallback((tile: SearchableTile) => {
    setUsageCounts((current) => {
      const id = tileId(tile);
      const next = { ...current, [id]: (current[id] ?? 0) + 1 };
      window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  if (!isNewLayout) {
    return (
      <ErrorBoundry>
        <Box sx={{ width: 883, padding: '36px' }}>
          <Suspense fallback={<Splash />}>
            {props.drawers?.map((menuItems: Tiles) => (
              <LegacyMenuItem
                key={menuItems.label}
                addTile={props.addTile}
                menuItems={menuItems}
              />
            ))}
          </Suspense>
        </Box>
      </ErrorBoundry>
    );
  }

  return (
    <ErrorBoundry>
      <div className="tile-library" data-testid="tile-library">
        <div className="tile-library-header">
          <div>
            <h2>Tile Library</h2>
            <p>Open an application in a new tab</p>
          </div>
          <ScButton
            type="text"
            size="xs"
            role="button"
            aria-label="Close Tile Library"
            title="Close Tile Library"
            className="tile-library-close"
            onClick={() => props.toggleDrawer(false)()}
          >
            <span className="webkit-close-glyph" aria-hidden="true">x</span>
          </ScButton>
        </div>
        <div className="tile-library-toolbar">
          <ScTextInput
            label=""
            size="sm"
            prefixIcon="search"
            className="tile-library-search"
            aria-label="Search tiles"
            placeholder="Search tiles…"
            value={search}
            onScInput={(event: CustomEvent<{ value?: string }>) => setSearch(event.detail.value ?? '')}
          />
          <div className="tile-library-view-tabs" role="tablist" aria-label="Tile views">
            {([
              ['all', 'All', LayoutGrid],
              ['favorites', 'Favorites', Star],
              ['frequent', 'Most used', Clock3],
            ] as const).map(([value, label, Icon]) => (
              <ScButton
                key={value}
                type="text"
                size="sm"
                noPill
                role="tab"
                aria-selected={view === value}
                selected={view === value}
                onClick={() => {
                  setView(value);
                  setActiveCategory('All');
                }}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </ScButton>
            ))}
          </div>
          <ScButton
            type="secondary"
            size="sm"
            noPill
            className="tile-library-sort"
            role="button"
            aria-label={sortAscending ? 'Sort Z to A' : 'Sort A to Z'}
            title={sortAscending ? 'Sort Z to A' : 'Sort A to Z'}
            onClick={() => setSortAscending((value) => !value)}
          >
            {sortAscending ? <ArrowDownAZ size={16} aria-hidden="true" /> : <ArrowUpZA size={16} aria-hidden="true" />}
            <span>{sortAscending ? 'A–Z' : 'Z–A'}</span>
          </ScButton>
        </div>
        <div className="tile-library-body">
          <nav ref={sidebarRef} className="tile-library-sidebar" aria-label="Tile categories">
            <span className="tile-library-sidebar-label">Categories</span>
            <ScButton
              type="text"
              size="sm"
              noPill
              data-nav-category="All"
              selected={activeCategory === 'All' && view === 'all'}
              aria-label="All categories"
              aria-current={activeCategory === 'All' && view === 'all'}
              onClick={() => selectCategory('All')}
            >
              All applications
              <span>{props.drawers?.reduce((count, drawer) => count + drawer.tiles.length, 0) ?? 0}</span>
            </ScButton>
            {categories.map((item) => (
              <ScButton
                key={item}
                type="text"
                size="sm"
                noPill
                data-nav-category={item}
                selected={activeCategory === item && view === 'all'}
                aria-label={`${item} category`}
                aria-current={activeCategory === item && view === 'all'}
                onClick={() => selectCategory(item)}
              >
                {item}
                <span>{props.drawers?.find((drawer) => drawer.label === item)?.tiles.length ?? 0}</span>
              </ScButton>
            ))}
          </nav>
          <div
            ref={resultsRef}
            className="tile-library-results"
            data-testid="tile-library-results"
            onScroll={syncCategoryToScroll}
          >
            {filteredDrawers.length ? (
              filteredDrawers.map((menuItems: Tiles) => (
                <MenuItem
                  key={menuItems.label}
                  addTile={props.addTile}
                  menuItems={menuItems}
                  favoriteTileIds={favoriteTileIds}
                  onToggleFavorite={toggleFavorite}
                  onOpenTile={trackOpen}
                />
              ))
            ) : (
              <div className="tile-library-empty" role="status">
                <h3>{view === 'favorites' ? 'No favorites yet' : view === 'frequent' ? 'No recent activity' : 'No applications found'}</h3>
                <p>{view === 'all' ? 'Try a different search.' : 'Applications appear here as you use the Tile Library.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundry>
  );
};

export default React.memo(Menu);
