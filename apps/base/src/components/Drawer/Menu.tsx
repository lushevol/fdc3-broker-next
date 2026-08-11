import React, { type ReactElement, useMemo, useState } from 'react';
import ErrorBoundry from '../ErrorBoundry';
import { propsAddTile, type DrawerProps, type Tiles } from './common/interface';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton, ScParagraph, ScTextInput, ScTitle } from '../webkit';
import MenuItem from './MenuItem';

type SearchableTile = Tiles['tiles'][number] & { description?: string };

const Menu: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All applications');
  const categories = useMemo(
    () => ['All applications', ...(props.drawers ?? []).map((drawer) => drawer.label)],
    [props.drawers],
  );
  const filteredDrawers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return (props.drawers ?? [])
      .filter((drawer) => category === 'All applications' || drawer.label === category)
      .map((drawer) => ({
        ...drawer,
        tiles: drawer.tiles.filter((tile) => {
          const searchable = tile as SearchableTile;
          return (
            !normalizedSearch ||
            [searchable.title, searchable.subtitle, searchable.description]
              .filter(Boolean)
              .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch))
          );
        }),
      }))
      .filter((drawer) => drawer.tiles.length > 0);
  }, [category, props.drawers, search]);

  if (!isNewLayout) {
    return (
      <div data-testid="drawer-menu">
        {(props.drawers ?? []).map((drawer) => (
          <section key={drawer.label} aria-label={drawer.label}>
            <h3>{drawer.label}</h3>
            {drawer.tiles.map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={() =>
                  props.addTile({
                    ...propsAddTile,
                    ...tile,
                    title: `${tile.title} ${tile.subtitle ?? ''}`.trim(),
                  })
                }
              >
                {tile.title}
              </button>
            ))}
          </section>
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundry>
      <div className="tile-library" data-testid="tile-library">
        <div className="tile-library-toolbar">
          <div>
            <ScTitle level={2}>Add an application</ScTitle>
            <ScParagraph>Find a tile by title or description, then add it to this workspace.</ScParagraph>
          </div>
          <ScTextInput
            label="Search tiles"
            aria-label="Search tiles"
            placeholder="Search by title or description"
            value={search}
            onScInput={(event: CustomEvent<{ value?: string }>) => setSearch(event.detail.value ?? '')}
          />
        </div>
        <div className="tile-library-categories" aria-label="Tile categories">
          {categories.map((item) => (
            <ScButton
              key={item}
              type={category === item ? 'primary' : 'text'}
              selectable="toggle"
              selected={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </ScButton>
          ))}
        </div>
        <div className="tile-library-results">
          {filteredDrawers.length ? (
            filteredDrawers.map((menuItems: Tiles) => (
              <MenuItem key={menuItems.label} addTile={props.addTile} menuItems={menuItems} />
            ))
          ) : (
            <div className="tile-library-empty" role="status">
              <ScTitle level={3}>No applications found</ScTitle>
              <ScParagraph>Try a different search or category.</ScParagraph>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundry>
  );
};

export default React.memo(Menu);
