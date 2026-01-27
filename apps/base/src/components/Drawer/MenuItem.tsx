import Grid from '@mui/material/Grid';
import React, { type ReactElement } from 'react';
import Tile from '../Tile';
import type { MenuItemProps, Tile as TileProps } from './common/interface';
import useController from './common/MenuItem.useController';
import Root, { classes, PREFIX } from './common/tile.style';

export const Item = ({ tile, ...props }: MenuItemProps & { tile: TileProps }) => {
  const { onClick } = useController(props, tile);
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
};

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps): ReactElement => {
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
};

export default React.memo(MenuItem);
