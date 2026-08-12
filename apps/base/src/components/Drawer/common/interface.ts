import type { Tiles } from '../../../hooks/model/root';
import type { Container } from '../../../hooks/model/workspaces';

export type { Tile, Tiles } from '../../../hooks/model/root';

export interface DrawerProps {
  anchor: boolean;
  toggleDrawer: (open: boolean) => () => void;
  addTile: (item: Container) => void;
  drawers: Tiles[] | [];
}

export const propsAddTile: Container = {
  id: '',
  container: '',
  module: '',
  tile: '',
  title: '',
  emailSupport: '',
  panelId: '',
  tabId: '',
};

export interface MenuItemProps {
  addTile: (item: Container) => void;
  menuItems: Tiles;
  favoriteTileIds?: Set<string>;
  onToggleFavorite?: (tile: Tile) => void;
  onOpenTile?: (tile: Tile) => void;
}

export interface RatanFilterItem {
  field: string;
  operator: string;
  values: unknown;
}
