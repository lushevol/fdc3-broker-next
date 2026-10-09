import React, { ReactElement } from 'react';
import { AppBar, Toolbar, Typography } from 'ratan-design-origin/primitives';
import useController from '../../components/AppBar/common/useController';
import Root, { classes, PREFIX } from '../../components/AppBar/common/style';
import Switch from './theme-switch';
import NewTile from './new-tile';
import Drawer from '../../components/Drawer';
import Avatar from '../../components/Avatar';
import Survey from '../../components/Survey';
import SwitchTime from './time-switch';
import SurveyButton from '../../components/SurveyButton';
import type { Tiles } from '../../hooks/model/root';
import { resolvePortalAppearance, useIsNewLayout } from '../appearance';
import { PortalAppBarRoot } from '../header-styles';
import darkModeLogo from '../../components/AppBar/mo1_logo_dark.svg';
import lightModeLogo from '../../components/AppBar/mo1_logo_light.svg';

const AppBarWindow: React.FC = (): ReactElement => {
  const {
    store,
    anchor,
    toggleDrawer: toggleLegacyDrawer,
    addTile,
    surveyLink,
    openPopUp,
    openLogoutModal,
    setOpenLogoutModal,
  } = useController();
  const toggleDrawer = (open: boolean) => (event?: unknown) =>
    toggleLegacyDrawer(open)(event as React.KeyboardEvent | React.MouseEvent);

  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();
  const isPortal = resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
  const AppBarRoot = isPortal ? PortalAppBarRoot : Root;

  const logoSrc = store?.theme === 'dark' ? darkModeLogo : lightModeLogo;

  return (
    <>
      <AppBarRoot
        {...(isPortal ? { component: 'section' as const } : {})}
        className={isNewLayout ? `${classes.root} app-bar-wrapper` : classes.root}
        data-testid={`${PREFIX}`}
      >
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            {!isNewLayout && (
              <Typography component="div" sx={{ flexGrow: 1 }} className={classes.title}>
                <img
                  src={logoSrc}
                  alt="Markets Operations One logo"
                  style={{ height: '24px', width: '130px' }}
                />
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
      </AppBarRoot>
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
