import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import { useIsNewLayout } from '../../hooks/model/root';
import type { DrawerProps } from './common/interface';
import Menu from './Menu';
import { ScModal } from '../webkit';

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

  if (!isNewLayout) {
    return props.anchor ? (
      <aside className="legacy-tile-drawer" data-testid="drawer" aria-label="Tile Options">
        <h2>Tile Options</h2>
        <Menu {...props} />
      </aside>
    ) : <></>;
  }

  return (
    <ErrorBoundry>
      <div className="base-webkit-scope">
        <ScModal
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
