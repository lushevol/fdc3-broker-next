import React, { ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import useController from "./common/useController";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdjustIcon from "@mui/icons-material/Adjust";
import Root, { classes, PREFIX, MenuStyled } from "./common/style";
import StatusItem from "./StatusItem";
import { Button } from "@mui/material";

const Status: React.FC = (): ReactElement => {
  const {
    store,
    anchorElStatus,
    handleOpenStatusMenu,
    handleCloseStatusMenu,
    apiStatusList,
    apiStatusData,
    enableStatus,
    ifNotAvailable,
  } = useController();

  return (
    <Root className={classes.root} data-testid={`${PREFIX}`}>
      <Tooltip title="API Status">
        <Button
          data-testid={`${PREFIX}_button`}
          className="button"
          variant="outlined"
          size="small"
          onClick={handleOpenStatusMenu}
          startIcon={
            <AdjustIcon
              style={{ fontSize: "14px" }}
              className={ifNotAvailable()}
            />
          }
        >
          API Status
        </Button>
      </Tooltip>
      <MenuStyled
        sx={{ mt: "35px" }}
        id="menu-appbar-status"
        anchorEl={anchorElStatus}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElStatus)}
        onClose={handleCloseStatusMenu}
      >
        {enableStatus ? (
          apiStatusList.map((keyName) => {
            const status = apiStatusData && apiStatusData[keyName];
            return (
              <MenuItem key={keyName} className={classes.menuItem}>
                <StatusItem name={keyName} status={status} />
              </MenuItem>
            );
          })
        ) : (
          <MenuItem key="no-item" className={classes.menuItem}>
            No API monitor in current blotter.
          </MenuItem>
        )}
      </MenuStyled>
    </Root>
  );
};

export default React.memo(Status);
