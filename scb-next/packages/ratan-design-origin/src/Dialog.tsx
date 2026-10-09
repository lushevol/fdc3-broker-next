import React from "react";
import MuiDialog, { type DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle, { type DialogTitleProps } from "@mui/material/DialogTitle";
import DialogContent, { type DialogContentProps } from "@mui/material/DialogContent";
import DialogActions, { type DialogActionsProps } from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { OverlayContainerContext } from "./Provider.js";

export interface DialogProps extends MuiDialogProps {
  titleComponents?: React.ReactNode;
  actionComponents?: React.ReactNode;
  header?: React.ReactNode;
  surfaceChildren?: React.ReactNode;
  onCloseButton?: React.MouseEventHandler<HTMLButtonElement>;
  disabledClose?: boolean;
  dividers?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  titleProps?: DialogTitleProps;
  contentProps?: DialogContentProps & { "data-testid"?: string };
  actionProps?: DialogActionsProps;
  RootComponent?: typeof MuiDialog;
}

export const Dialog = /*#__PURE__*/ React.forwardRef<HTMLDivElement, DialogProps>(function Dialog({
  titleComponents, actionComponents, header, surfaceChildren, onCloseButton, disabledClose,
  dividers, contentRef, titleProps, contentProps, actionProps,
  RootComponent = MuiDialog, children, open, container, disablePortal,
  "aria-label": callerAriaLabel, "aria-labelledby": callerAriaLabelledBy,
  PaperProps: callerPaperProps, ...rest
}, ref) {
  const generatedTitleId = React.useId();
  const theme = useTheme();
  const overlayContainer = React.useContext(OverlayContainerContext);
  const waitingForContainer = overlayContainer === null && container === undefined;
  const hasTitle = titleComponents !== undefined && titleComponents !== null;
  const generatedHeader = header === undefined && hasTitle;
  const customHeaderId =
    header !== undefined && React.isValidElement(header) && typeof header.props.id === "string"
      ? header.props.id
      : undefined;
  const paperAriaLabel = callerPaperProps?.["aria-label"];
  const paperAriaLabelledBy = callerPaperProps?.["aria-labelledby"];
  const effectiveAriaLabel = callerAriaLabel ?? paperAriaLabel;
  const titleId = titleProps?.id ?? generatedTitleId;
  const labelledBy = callerAriaLabelledBy
    ?? paperAriaLabelledBy
    ?? (effectiveAriaLabel === undefined && generatedHeader ? titleId : customHeaderId);
  const paperProps = {
    ...callerPaperProps,
    "aria-label": effectiveAriaLabel,
    "aria-labelledby": labelledBy,
  };
  return <RootComponent open={open && !waitingForContainer}
    container={container ?? overlayContainer ?? theme.components?.MuiDialog?.defaultProps?.container}
    disablePortal={disablePortal} aria-labelledby={labelledBy} aria-label={callerAriaLabel}
    PaperProps={paperProps} scroll="paper" {...rest} ref={ref}>
    {header !== undefined ? header : (hasTitle || onCloseButton) ?
      <MuiDialogTitle component="div"
        sx={{ display: "flex", alignItems: "center", gap: 1 }} {...titleProps}
        id={generatedHeader ? titleId : undefined}>
        <div style={{ flex: 1, minWidth: 0 }}>{titleComponents}</div>
        {onCloseButton && <IconButton aria-label="Close dialog" onClick={onCloseButton}
          disabled={disabledClose} size="small"><Close /></IconButton>}
      </MuiDialogTitle> : null}
    <DialogContent ref={contentRef} dividers={dividers} {...contentProps}>{children}</DialogContent>
    {actionComponents !== undefined && actionComponents !== null &&
      <DialogActions {...actionProps}>{actionComponents}</DialogActions>}
    {surfaceChildren}
  </RootComponent>;
});
