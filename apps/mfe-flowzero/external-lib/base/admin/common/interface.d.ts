/// <reference types="react" />
export interface AdminModuleProps {
  children?: React.ReactNode;
  module: string;
  tile: string;
  panelId: string;
  tabId: string;
  parameters?: any;
}
