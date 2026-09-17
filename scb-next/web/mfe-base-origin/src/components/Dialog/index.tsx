import React from "react";
import { Dialog as PackageDialog } from "ratan-design-origin";
import { DialogProps, PaperProps } from "./common/types";
import Root, { PREFIX, classes, presentationClasses } from "./common/style";
import DialogTitle from "./common/DialogTitle";
import useController from "./common/useController";
import Draggable from "./common/Draggable";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

const getDraggable = (isDraggable: boolean | undefined, idTitle: string) =>
  isDraggable
    ? (props: PaperProps) => <Draggable idTitle={idTitle} {...props} />
    : undefined;

const Dialog = (props: DialogProps) => {
  const {
    disablePortal, titleComponents, actionComponents, children, dividers,
    isDraggable, isResizeble, defaultWidth = 400, defaultHeight = 400,
    className, hideBackdrop, defaultX, defaultY, disabledClose, ...rest
  } = props;
  const {
    idModal, dialogRef, idTitle, initDrag, stopDrag, doDrag, width, height,
    isMax, onResize, dialogContentRef, top, left, onMouseDown, closeDialog,
  } = useController(props);
  const staticClassName = disablePortal
    ? joinClassNames(classes.static, presentationClasses.static)
    : undefined;
  const maxClassName = isMax
    ? joinClassNames(classes.max, presentationClasses.max)
    : undefined;
  const hideBackdropClassName = hideBackdrop
    ? joinClassNames(classes.hideBackdrop, presentationClasses.hideBackdrop)
    : undefined;
  const DraggableComp = React.useMemo(
    () => getDraggable(isDraggable, idTitle),
    [idTitle, isDraggable]
  );
  return (
    <PackageDialog
      RootComponent={Root}
      id={idModal}
      disablePortal={disablePortal}
      hideBackdrop={hideBackdrop}
      PaperComponent={DraggableComp}
      aria-labelledby={isDraggable ? idTitle : undefined}
      data-testid={PREFIX}
      scroll="paper"
      ref={dialogRef}
      {...rest}
      className={joinClassNames(staticClassName, maxClassName, hideBackdropClassName, className)}
      onMouseUp={stopDrag}
      onMouseMove={doDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onMouseDown}
      PaperProps={{
        sx: {
          width: width.current,
          height: height.current,
          borderBottomRightRadius: isResizeble ? 0 : undefined,
          maxWidth: isResizeble ? "none" : undefined,
          minWidth: isResizeble ? "400px" : undefined,
          top: hideBackdrop ? (defaultY ?? top) : undefined,
          left: hideBackdrop ? (defaultX ?? left) : undefined,
        },
      }}
      header={titleComponents ? (
        <DialogTitle id={idTitle} isDraggable={isDraggable} onClose={closeDialog}
          isResizeble={isResizeble} onResize={onResize} isMax={isMax}
          disabledClose={disabledClose}>
          {titleComponents}
        </DialogTitle>
      ) : null}
      contentRef={dialogContentRef}
      dividers={dividers}
      contentProps={{ "data-testid": `${PREFIX}-content` }}
      actionComponents={actionComponents || undefined}
      surfaceChildren={isResizeble ? (
        <IconButton aria-label="resize" size="large"
          className={joinClassNames(classes.resize, presentationClasses.resize)}
          onMouseDown={initDrag} data-testid={`${PREFIX}-resize`}>
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    >
      {children}
    </PackageDialog>
  );
};

export default Dialog;
