import { Breakpoint } from "@mui/material";

export interface DialogProps {
  className?: string;
  classes?: Object;
  testId?: string;
  minWidth?: number | string;
  minHeight?: number | string;
  width?: number | string;
  height?: number | string;
  open: boolean;
  scroll?: "body" | "paper";
  onClose: Function;
  onResize?: Function;
  enableResize?: boolean;
  title?: string;
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: Breakpoint | false;
  actions?: React.ReactNode;
  destoryWhenHidden?: boolean;
  PaperComponent?: any;
  disablePortal?: boolean;
}
