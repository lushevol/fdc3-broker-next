import { MenuItemData } from '../ScMenu/MenuItemData.js';

export interface MenuBarItemData {
  title: string;
  href: string;
  target: string;
  value?: any;
  width?: string;
  leftPosition?: string;
  selected?: boolean;
  disabled?: boolean;
  menuItems: Array<MenuItemData>;
  rows?: Array<MenuItemData>;
  categories?: Array<MenuItemData>;
}