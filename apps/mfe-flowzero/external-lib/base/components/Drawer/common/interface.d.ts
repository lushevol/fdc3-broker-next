import { Tiles } from "../../../hooks/model/root";
import { Container } from "../../../hooks/model/workspaces";
export type { Tile, Tiles } from "../../../hooks/model/root";
export interface DrawerProps {
  anchor: boolean;
  toggleDrawer: Function;
  addTile: (item: Container) => void;
  drawers: Tiles[] | [];
}
export declare const propsAddTile: Container;
export interface MenuItemProps {
  addTile: (item: Container) => void;
  menuItems: Tiles;
}
export interface RatanFilterItem {
  field: string;
  operator: string;
  values: any;
}
