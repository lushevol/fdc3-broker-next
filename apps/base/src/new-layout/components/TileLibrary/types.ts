import type { Tile, Tiles } from '../../../components/Drawer/common/interface';
import type { Container } from '../../../hooks/model/workspaces';

export interface TileLibraryProps {
  anchor: boolean;
  toggleDrawer: (open: boolean) => () => void;
  addTile: (item: Container) => void;
  drawers: Tiles[] | [];
}

export type LibraryTile = Tile & { description?: string };

export interface TileCardProps {
  tile: LibraryTile;
  addTile: (item: Container) => void;
  menuItems: Tiles;
  favoriteTileIds: Set<string>;
  onToggleFavorite: (tile: LibraryTile) => void;
  onOpenTile: (tile: LibraryTile) => void;
}
