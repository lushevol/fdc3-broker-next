import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type React from 'react';
import type { ReactElement } from 'react';
import { type Tiles, useIsNewLayout } from '../../hooks/model/root';
import Avatar from '../Avatar';
import Drawer from '../Drawer';
import NewTile from '../NewTile';
import Survey from '../Survey';
import SurveyButton from '../SurveyButton';
import Switch from '../Switch';
import SwitchTime from '../SwitchTime';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const AppBarWindow: React.FC = (): ReactElement => {
  const {
    store,
    anchor,
    toggleDrawer,
    addTile,
    surveyLink,
    openPopUp,
    openLogoutModal,
    setOpenLogoutModal,
  } = useController();
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();
  return (
    <>
      <Root
        className={isNewLayout ? `${classes.root} app-bar-wrapper` : classes.root}
        data-testid={`${PREFIX}`}
      >
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            {!isNewLayout && (
              <Typography component="div" sx={{ flexGrow: 1 }} className={classes.title}>
                {window.document.title}
              </Typography>
            )}
            <section className={classes.right}>
              <NewTile toggleDrawer={toggleDrawer} />
              <Switch />
              <SwitchTime />
              <Avatar setOpen={setOpenLogoutModal} />
              {!isNewLayout && <SurveyButton openPopUp={openPopUp} />}
            </section>
          </Toolbar>
        </AppBar>
      </Root>
      <Drawer
        anchor={anchor}
        toggleDrawer={toggleDrawer}
        addTile={addTile}
        drawers={store.drawers as Tiles[]}
      />
      {openLogoutModal && (
        <Survey surveyLink={surveyLink} openPopUp={openPopUp} setOpen={setOpenLogoutModal} />
      )}
      {!isNewLayout && <div style={{ height: '48px', width: '100%' }}></div>}
    </>
  );
};

export default AppBarWindow;
