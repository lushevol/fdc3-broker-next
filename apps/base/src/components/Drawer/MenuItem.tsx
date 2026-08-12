import Grid from '@mui/material/Grid';
import React, { type ReactElement } from 'react';
import Tile from '../Tile';
import type { MenuItemProps, Tile as TileProps } from './common/interface';
import { useIsNewLayout } from '../../hooks/model/root';
import useController from './common/MenuItem.useController';
import { ScBadge, ScButton } from '../../new-layout/webkit/components';
import { Star } from 'lucide-react';
import Root, { classes, PREFIX } from './common/tile.style';

type LibraryTile = TileProps & { description?: string };

export const Item = ({ tile, ...props }: MenuItemProps & { tile: TileProps }) => {
  const { onClick } = useController(props, tile);
  const isNewLayout = useIsNewLayout();

  if (!isNewLayout) {
    return (
      <Grid item xs={3} key={tile.tile ? tile.tile : tile.title}>
        <Tile
          title={tile.title}
          subtitle={tile.subtitle ?? ''}
          onClick={onClick}
          imageDarkTheme={tile.imageDarkTheme}
          imageLightTheme={tile.imageLightTheme ?? tile.imageDarkTheme}
          disabled={tile.disabled}
        />
      </Grid>
    );
  }

  const libraryTile = tile as LibraryTile;
  const icon = libraryTile.imageLightTheme ?? libraryTile.imageDarkTheme;
  const tileId = tile.tile || tile.module || tile.title;
  const isFavorite = props.favoriteTileIds?.has(tileId) ?? false;
  const openTile = () => {
    props.onOpenTile?.(tile);
    onClick();
  };
  return (
    <article key={tile.tile ? tile.tile : tile.title} className="tile-library-card">
      <div className="tile-library-card-content">
        <div className="tile-library-card-heading">
          <span className="tile-library-icon" aria-hidden="true">
            <span>{tile.title.slice(0, 1).toUpperCase()}</span>
            {icon && <img src={icon} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />}
          </span>
          <div className="tile-library-card-title">
            <h3>{tile.title}</h3>
            {tile.subtitle && <p>{tile.subtitle}</p>}
          </div>
          <ScButton
            type="text"
            size="xs"
            className="tile-library-favorite"
            role="button"
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${tile.title} ${isFavorite ? 'from' : 'to'} favorites`}
            aria-pressed={isFavorite}
            onClick={() => props.onToggleFavorite?.(tile)}
          >
            <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
          </ScButton>
        </div>
        <p className="tile-library-card-description">
          {libraryTile.description ?? `Open ${tile.title} in the current workspace.`}
        </p>
        {tile.disabled ? (
          <ScBadge type="text" color="grey" label="Unavailable" />
        ) : (
          <ScButton type="primary" size="xs" noPill width="100%" role="button" onClick={openTile} aria-label={`Open ${tile.title}`}>
            Open
          </ScButton>
        )}
      </div>
    </article>
  );
};

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps): ReactElement => {
  const isNewLayout = useIsNewLayout();

  if (!isNewLayout) {
    return (
      <Root data-testid={`${PREFIX}`}>
        <section className={classes.title}>{props.menuItems.label}</section>
        <Grid container spacing={2} className={classes.content}>
          {props.menuItems.tiles.map((item) => (
            <Item key={item.tile || item.title} tile={item} {...props} />
          ))}
        </Grid>
      </Root>
    );
  }

  return (
    <section
      data-testid={`tile-category-${props.menuItems.label}`}
      data-category={props.menuItems.label}
      className="tile-library-category"
      aria-labelledby={`tile-category-${props.menuItems.label}`}
    >
      <h2 id={`tile-category-${props.menuItems.label}`}>
        {props.menuItems.label}
      </h2>
      <div className="tile-library-grid">
        {props.menuItems.tiles.map((item) => (
          <Item key={item.tile || item.title} tile={item} {...props} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(MenuItem);
