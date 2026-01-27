/**
 * @fileoverview Drawer Component
 *
 * A slide-out drawer/sidebar component for displaying tile options
 * and navigation menus. Built on Material-UI's Drawer component.
 *
 * Features:
 * - Right-anchored slide-out panel
 * - Error boundary protection
 * - Tile options menu display
 *
 * @module components/Drawer
 */

import MuiDrawer from '@mui/material/Drawer';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import type { DrawerProps } from './common/interface';
import Root, { classes, DrawerClass, PREFIX } from './common/style';
import Tile from './common/Tile';
import Menu from './Menu';

/**
 * Drawer Component
 *
 * A right-anchored slide-out panel that displays tile configuration
 * options and navigation menus. Wrapped in an error boundary for
 * graceful error handling.
 *
 * @param props - Drawer configuration properties
 * @param props.anchor - Controls whether the drawer is open
 * @param props.toggleDrawer - Function to toggle drawer open/close state
 * @returns A slide-out drawer component with tile options
 *
 * @example
 * <Drawer
 *   anchor={isOpen}
 *   toggleDrawer={(open) => () => setIsOpen(open)}
 * />
 */
const Drawer: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => {
  return (
    <ErrorBoundry>
      <MuiDrawer
        anchor="right"
        open={props.anchor}
        onClose={props.toggleDrawer(false)}
        className={DrawerClass}
      >
        <Root className={classes.root} data-testid={`${PREFIX}`}>
          <div className={classes.content}>
            {/* Header section with tile icon and title */}
            <section className={classes.title}>
              <Tile />
              <span>Tile Options</span>
            </section>

            {/* Body section with menu items */}
            <section className={classes.body}>
              <Menu {...props} />
            </section>
          </div>
        </Root>
      </MuiDrawer>
    </ErrorBoundry>
  );
};

export default React.memo(Drawer);
