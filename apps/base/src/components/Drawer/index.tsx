import MuiDrawer from '@mui/material/Drawer';
import React, { type ReactElement, useEffect, useRef } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import { useIsNewLayout } from '../../hooks/model/root';
import type { DrawerProps } from './common/interface';
import Menu from './Menu';
import { ScModal, setScModalWidth } from '../../new-layout/webkit/components';
import Root, { classes, DrawerClass, PREFIX } from './common/style';
import Tile from './common/Tile';

/**
 * Drawer Component
 *
 * The Tile Library keeps users in their workspace while they search and add
 * available applications.
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
  const isNewLayout = useIsNewLayout();
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isNewLayout && props.anchor) setScModalWidth(modalRef.current, '64rem');
  }, [isNewLayout, props.anchor]);

  if (!isNewLayout) {
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
  }

  return (
    <ErrorBoundry>
      <div className="base-webkit-scope">
        <ScModal
          ref={modalRef}
          open={props.anchor}
          size="lg"
          no-header
          no-padding
          aria-label="Tile Library"
          onScHide={() => props.toggleDrawer(false)()}
        >
          <Menu {...props} />
        </ScModal>
      </div>
    </ErrorBoundry>
  );
};

export default React.memo(Drawer);
