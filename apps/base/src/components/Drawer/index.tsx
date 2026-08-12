import MuiDrawer from '@mui/material/Drawer';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import type { DrawerProps } from './common/interface';
import Menu from './Menu';
import Root, { classes, DrawerClass, PREFIX } from './common/style';
import Tile from './common/Tile';

/**
 * Drawer Component
 *
 * A right-anchored panel containing the available tile options.
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
            <section className={classes.title}>
              <Tile />
              <span>Tile Options</span>
            </section>
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
