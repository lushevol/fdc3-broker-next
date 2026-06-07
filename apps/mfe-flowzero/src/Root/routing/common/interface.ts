export interface TileProps {
  children?: React.ReactNode;
  module: string;
  tile: string;
  panelId: string;
  tabId: string;
  parameters?: Record<string, string>;
}
