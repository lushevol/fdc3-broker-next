export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  isActive: boolean;
  className: string;
  tabId: string;
}
