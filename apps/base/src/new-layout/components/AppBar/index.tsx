import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import type React from 'react';
import type { ReactElement } from 'react';
import { classes, PREFIX } from '../../../components/AppBar/common/style';
import useController from '../../../components/AppBar/common/useController';
import type { Tiles } from '../../../hooks/model/root';
import NewLayoutAvatar from '../Avatar';
import NewLayoutNewTile from '../NewTile';
import NewLayoutThemeSwitch from '../ThemeSwitch';
import NewLayoutTileLibrary from '../TileLibrary';
import NewLayoutAppBarRoot from './style';

const NewLayoutAppBar: React.FC = (): ReactElement => {
  const { store, anchor, toggleDrawer, addTile, setOpenLogoutModal } = useController();

  return (
    <>
      <NewLayoutAppBarRoot className="new-layout-app-bar" data-testid={PREFIX}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            <section className={classes.right}>
              <NewLayoutNewTile toggleDrawer={toggleDrawer} />
              <NewLayoutThemeSwitch />
              <NewLayoutAvatar setOpen={setOpenLogoutModal} />
            </section>
          </Toolbar>
        </AppBar>
      </NewLayoutAppBarRoot>
      <NewLayoutTileLibrary
        anchor={anchor}
        toggleDrawer={toggleDrawer}
        addTile={addTile}
        drawers={store.drawers as Tiles[]}
      />
    </>
  );
};

export default NewLayoutAppBar;
