import Box from '@mui/material/Box';
import React, { type ReactElement, Suspense } from 'react';
import ErrorBoundry from '../ErrorBoundry';
import Splash from '../Splash';
import type { DrawerProps, Tiles } from './common/interface';

const MenuItem = React.lazy(() => import('./MenuItem'));

const Menu: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => (
  <ErrorBoundry>
    <Box sx={{ width: 883, padding: '36px' }}>
      <Suspense fallback={<Splash />}>
        {props.drawers?.map((menuItems: Tiles) => (
          <MenuItem key={menuItems.label} addTile={props.addTile} menuItems={menuItems} />
        ))}
      </Suspense>
    </Box>
  </ErrorBoundry>
);

export default React.memo(Menu);
