import { Button, Popover } from "@mui/material";
import React, { FC, PropsWithChildren, useState } from "react";

import { ButtonPopoverProps } from "./interface";

const ButtonPopover: FC<PropsWithChildren<ButtonPopoverProps>> = ({
  buttonContent,
  buttonStartIcon,
  buttonEndIcon,
  buttonRestProps,
  popoverAnchorOrigin = {
    vertical: "bottom",
    horizontal: "center",
  },
  popoverProps,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "button-popover" : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        startIcon={buttonStartIcon}
        endIcon={buttonEndIcon}
        {...buttonRestProps}
      >
        {buttonContent}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={popoverAnchorOrigin}
        {...popoverProps}
      >
        {children}
      </Popover>
    </div>
  );
};

export default ButtonPopover;
