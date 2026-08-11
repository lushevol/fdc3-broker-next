import React, { type ReactElement } from 'react';
import type { MenuItemProps, Tile as TileProps } from './common/interface';
import { useIsNewLayout } from '../../hooks/model/root';
import useController from './common/MenuItem.useController';
import { ScBadge, ScButton, ScCard, ScParagraph, ScTitle } from '../webkit';

const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_menuItem`;

type LibraryTile = TileProps & { description?: string };

export const Item = ({ tile, ...props }: MenuItemProps & { tile: TileProps }) => {
  const { onClick } = useController(props, tile);
  const libraryTile = tile as LibraryTile;
  const icon = libraryTile.imageLightTheme ?? libraryTile.imageDarkTheme;
  return (
    <ScCard key={tile.tile ? tile.tile : tile.title} className="tile-library-card">
      <div className="tile-library-card-content">
        {icon ? (
          <img src={icon} alt="" className="tile-library-icon" />
        ) : (
          <span className="tile-library-icon" aria-hidden="true">
            {tile.title.slice(0, 1).toUpperCase()}
          </span>
        )}
        <ScTitle level={3}>{tile.title}</ScTitle>
        {tile.subtitle && <ScParagraph>{tile.subtitle}</ScParagraph>}
        <ScParagraph>
          {libraryTile.description ?? `Open ${tile.title} in the current workspace.`}
        </ScParagraph>
        {tile.disabled ? (
          <ScBadge type="text" color="grey" label="Unavailable" />
        ) : (
          <ScButton type="secondary" role="button" onClick={onClick} aria-label={`Open ${tile.title}`}>
            Open
          </ScButton>
        )}
      </div>
    </ScCard>
  );
};

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps): ReactElement => {
  const isNewLayout = useIsNewLayout();

  if (!isNewLayout) {
    return (
      <section data-testid={`${PREFIX}`} aria-labelledby={`tile-category-${props.menuItems.label}`}>
        <h3 id={`tile-category-${props.menuItems.label}`}>{props.menuItems.label}</h3>
        {props.menuItems.tiles.map((item) => (
          <button key={item.tile || item.title} type="button" onClick={() => props.addTile(item)}>
            {item.title}
          </button>
        ))}
      </section>
    );
  }

  return (
    <section data-testid={`${PREFIX}`} className="tile-library-category" aria-labelledby={`tile-category-${props.menuItems.label}`}>
      <ScTitle level={2} id={`tile-category-${props.menuItems.label}`}>
        {props.menuItems.label}
      </ScTitle>
      <div className="tile-library-grid">
        {props.menuItems.tiles.map((item) => (
          <Item key={item.tile || item.title} tile={item} {...props} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(MenuItem);
