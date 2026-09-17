import React from "react";
import { DialogProps, PaperProps } from "./common/types";
import Root, { PREFIX, classes } from "./common/style";
import DialogTitle from "./common/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useController from "./common/useController";
import Draggable from "./common/Draggable";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

const getDraggable = (isDraggable: boolean | undefined, idTitle: string) =>
  isDraggable
    ? (props: PaperProps) => <Draggable idTitle={idTitle} {...props} />
    : undefined;
const Dialog = (props: DialogProps) => {
  const {
    disablePortal,
    titleComponents,
    actionComponents,
    children,
    dividers,
    isDraggable,
    isResizeble,
    defaultWidth = 400,
    defaultHeight = 400,
    className,
    hideBackdrop,
    defaultX,
    defaultY,
    disabledClose,
    ...rest
  } = props;
  const {
    idModal,
    dialogRef,
    idTitle,
    initDrag,
    stopDrag,
    doDrag,
    width,
    height,
    isMax,
    onResize,
    dialogContentRef,
    top,
    left,
    onMouseDown,
    closeDialog,
  } = useController(props);
  const maxCalssName = isMax ? classes.max : undefined;
  const maxStaticCalssName = isMax
    ? joinClassNames(classes.static, classes.max)
    : classes.static;
  const staticClassName = disablePortal ? maxStaticCalssName : maxCalssName;
  const hideBackdropClassName = hideBackdrop ? classes.hideBackdrop : undefined;
  const DraggableComp = React.useMemo(
    () => getDraggable(isDraggable, idTitle),
    [idTitle, isDraggable]
  );
  return (
    <Root
      id={idModal}
      disablePortal={disablePortal}
      hideBackdrop={hideBackdrop}
      PaperComponent={DraggableComp}
      aria-labelledby={isDraggable ? idTitle : undefined}
      data-testid={PREFIX}
      scroll="paper"
      ref={dialogRef}
      {...rest}
      className={joinClassNames(
        staticClassName,
        hideBackdropClassName,
        className
      )}
      onMouseUp={stopDrag}
      onMouseMove={doDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onMouseDown}
      PaperProps={{
        sx: {
          width: width?.current,
          height: height?.current,
          borderBottomRightRadius: isResizeble ? 0 : undefined,
          maxWidth: isResizeble ? "none" : undefined,
          minWidth: isResizeble ? "400px" : undefined,
          top: hideBackdrop ? (defaultY ?? top) : undefined,
          left: hideBackdrop ? (defaultX ?? left) : undefined,
        },
      }}
    >
      {titleComponents && (
        <DialogTitle
          id={idTitle}
          isDraggable={isDraggable}
          onClose={closeDialog}
          isResizeble={isResizeble}
          onResize={onResize}
          isMax={isMax}
          disabledClose={disabledClose}
        >
          {titleComponents}
        </DialogTitle>
      )}
      <DialogContent
        ref={dialogContentRef}
        dividers={dividers}
        data-testid={`${PREFIX}-content`}
      >
        {children}
      </DialogContent>
      {actionComponents && <DialogActions>{actionComponents}</DialogActions>}
      {isResizeble && (
        <IconButton
          aria-label="resize"
          size="large"
          className={classes.resize}
          onMouseDown={initDrag}
          data-testid={`${PREFIX}-resize`}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      )}
    </Root>
  );
};

export default Dialog;
