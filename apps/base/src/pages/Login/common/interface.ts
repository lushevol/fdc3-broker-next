export const LoginTabsProps = (index: number) => {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
    'aria-label': 'login-tabpanel',
  };
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
