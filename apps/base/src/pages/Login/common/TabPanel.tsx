import Box from '@mui/material/Box';
import type React from 'react';
import type { ReactElement } from 'react';
import type { TabPanelProps } from './interface';

const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps): ReactElement => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      {...other}
      style={{ width: '100%', height: '100vh' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
