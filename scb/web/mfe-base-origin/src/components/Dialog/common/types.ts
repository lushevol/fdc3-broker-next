import {
  DialogProps as MuiDialogProps,
  DialogTitleProps as MuiDialogTitleProps,
} from "@mui/material";
import { PaperProps as MuiPaperProps } from "@mui/material/Paper";

export interface DialogTitleProps extends MuiDialogTitleProps {
  id?: string;
  children?: React.ReactNode;
  isDraggable?: boolean;
  isResizeble?: boolean;
  isMax?: boolean;
  disabledClose?: boolean;
  onClose: (...args: unknown[]) => void;
  onResize?: (...args: unknown[]) => void;
}

export interface DialogProps extends MuiDialogProps {
  disablePortal?: boolean;
  onClose?: (...args: unknown[]) => void;
  dividers?: boolean;
  titleComponents?: React.ReactNode;
  actionComponents?: React.ReactNode;
  children?: React.ReactNode;
  isDraggable?: boolean;
  isResizeble?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  disabledClose?: boolean;
}

export interface PaperProps extends MuiPaperProps {
  idTitle?: string;
}
