import React, { ReactElement } from 'react';
import { Drawer as MuiDrawer } from 'ratan-design-origin/primitives';
import Root, {
  classes,
  DrawerClass,
  PREFIX,
  NewDrawerClass,
} from '../../components/Drawer/common/style';
import ErrorBoundry from '../../components/ErrorBoundry';
import Menu from '../../components/Drawer/Menu';
import { DrawerProps } from '../../components/Drawer/common/interface';
import Tile from '../../components/Drawer/common/Tile';
import { useContext } from '../../hooks/provider';
import { resolvePortalAppearance, useIsNewLayout } from '../appearance';
import { PrototypeDrawer } from '../drawer-presentation';

const Drawer: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const [store] = useContext();
  if (resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype') {
    return (
      <ErrorBoundry>
        <PrototypeDrawer {...props} mode={store.theme === 'light' ? 'light' : 'dark'} />
      </ErrorBoundry>
    );
  }
  return (
    <ErrorBoundry>
      <MuiDrawer
        anchor="right"
        open={props.anchor}
        onClose={props.toggleDrawer(false)}
        className={isNewLayout ? `${DrawerClass} ${NewDrawerClass}` : DrawerClass}
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
