export interface TileProps extends Container {
  children?: React.ReactNode;
}

interface Container {
  id: string;
  container: string;
  module: string;
  tile: string;
  title: string;
  subtitle?: string;
  parameters?: Record<string, any>;
  emailSupport: string;
  panelId: string;
  tabId: string;
  leftPosition?: string;
  topPossition?: string;
}
