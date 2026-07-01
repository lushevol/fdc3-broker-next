import {
  SnackbarCloseReason,
  SnackbarProps as MuiSnackbarProps,
} from "@mui/material/Snackbar";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { OverridableStringUnion } from "@mui/types";
import React from "react";
export interface SnackbarProps extends MuiSnackbarProps {
  message?: React.ReactNode;
  variant?: OverridableStringUnion<"standard" | "filled" | "outlined">;
  severity?: OverridableStringUnion<"success" | "info" | "warning" | "error">;
  alertsx?: SxProps<Theme>;
  action?: React.ReactNode;
  onClose?: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
}
declare const _default: React.NamedExoticComponent<SnackbarProps>;
export default _default;
