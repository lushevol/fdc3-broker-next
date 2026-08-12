import { ButtonProps, PopoverProps } from "@mui/material";
import React from "react";

export interface ButtonPopoverProps {
  buttonContent: string | React.ReactNode;
  buttonStartIcon?: React.ReactNode;
  buttonEndIcon?: React.ReactNode;
  buttonRestProps?: ButtonProps;
  popoverAnchorOrigin?: PopoverProps["anchorOrigin"];
  popoverProps?: Omit<PopoverProps, "open">;
}
