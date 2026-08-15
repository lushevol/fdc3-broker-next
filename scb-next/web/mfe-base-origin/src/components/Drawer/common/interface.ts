import { Tiles } from "../../../hooks/model/root";
import { Container } from "../../../hooks/model/workspaces";
export type { Tiles, Tile } from "../../../hooks/model/root";

export type ToggleDrawer = (value: boolean) => (event?: unknown) => void;

export interface DrawerProps {
  anchor: boolean;
  toggleDrawer: ToggleDrawer;
  addTile: (item: Container) => void;
  drawers: Tiles[] | [];
}

export const propsAddTile: Container = {
  id: "",
  container: "",
  module: "",
  tile: "",
  title: "",
  emailSupport: "",
  panelId: "",
  tabId: "",
};

export interface MenuItemProps {
  addTile: (item: Container) => void;
  menuItems: Tiles;
}

export interface RatanFilterItem {
  field: string;
  operator: string;
  values: unknown;
}
