import React, { ReactElement } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useController from "./common/useController";
import Root, { classes, PREFIX } from "./common/style";
import Switch from "../Switch";
import NewTile from "../NewTile";
import Drawer from "../Drawer";
import Avatar from "../Avatar";
import Survey from "../Survey";
import SwitchTime from "../SwitchTime";
import SurveyButton from "../SurveyButton";
import { Tiles, useIsNewLayout } from "../../hooks/model/root";
import darkModeLogo from "./mo1_logo_dark.svg";
import lightModeLogo from "./mo1_logo_light.svg";

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

  const logoSrc = store?.theme === "dark" ? darkModeLogo : lightModeLogo;

  return (
    <>
      <Root
        className={
          isNewLayout ? `${classes.root} app-bar-wrapper` : classes.root
        }
        data-testid={`${PREFIX}`}
      >
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            {!isNewLayout && (
              <Typography
                component="div"
                sx={{ flexGrow: 1 }}
                className={classes.title}
              >
                <img
                  src={logoSrc}
                  alt="Markets Operations One logo"
                  style={{ height: "24px", width: "130px" }}
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
      </Root>
      <Drawer
        anchor={anchor}
        toggleDrawer={toggleDrawer}
        addTile={addTile}
        drawers={store.drawers as Tiles[]}
      />
      {openLogoutModal && (
        <Survey
          surveyLink={surveyLink}
          openPopUp={openPopUp}
          setOpen={setOpenLogoutModal}
        />
      )}
      {!isNewLayout && <div style={{ height: "48px", width: "100%" }}></div>}
    </>
  );
};

export default AppBarWindow;
