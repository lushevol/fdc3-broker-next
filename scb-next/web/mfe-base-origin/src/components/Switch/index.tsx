import React, { ReactElement } from "react";
import dark from "./common/images/dark.svg";
import moon from "./common/images/moon.svg";
import sun from "./common/images/sun.svg";
import LightModeIcon from "@mui/icons-material/LightMode";
import useController from "./common/useController";
import Root, { classes, PREFIX, SwitchStyled } from "./common/style";
import { useIsNewLayout } from "../../hooks/model/root";

const Switch: React.FC = (): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const { store, toggleColorMode } = useController();
  return (
    <Root
      className={
        isNewLayout ? `${classes.root} switch-theme-wrapper` : classes.root
      }
      data-testid={`${PREFIX}`}
    >
      <div className={classes.icon}>
        {!isNewLayout ? (
          store.theme === "light" ? (
            <LightModeIcon />
          ) : (
            <img src={dark} alt="dark" width="14px" height="14px" />
          )
        ) : store.theme === "light" ? (
          <img src={sun} alt="Sun" width="20px" height="20px" />
        ) : (
          <img src={moon} alt="Moon" width="20px" height="20px" />
        )}
      </div>
      <div className={classes.switch}>
        <div>
          <span className={classes.label}>{store.theme}</span>
          <SwitchStyled
            className="custom-switch"
            checked={store.theme === "light"}
            onChange={toggleColorMode}
            data-testid={`${PREFIX}_SwitchStyled`}
            inputProps={{ "aria-label": "Theme Switch" }}
          />
        </div>
      </div>
    </Root>
  );
};

export default React.memo(Switch);
