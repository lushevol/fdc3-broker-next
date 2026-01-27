/**
 * @fileoverview Dialog Component
 *
 * A feature-rich modal dialog component built on Material-UI's Dialog.
 * Supports dragging, resizing, maximizing, and custom positioning.
 *
 * Features:
 * - Draggable dialogs (when isDraggable is true)
 * - Resizable dialogs (when isResizeble is true)
 * - Maximize/restore functionality
 * - Custom positioning via defaultX/defaultY
 * - Portal or inline rendering options
 *
 * @module components/Dialog
 */

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import React from 'react';
import DialogTitle from './common/DialogTitle';
import Draggable from './common/Draggable';
import Root, { classes, PREFIX } from './common/style';
import type { DialogProps } from './common/types';
import useController from './common/useController';

/**
 * Returns the Draggable paper component if dragging is enabled.
 *
 * @param isDraggable - Whether the dialog should be draggable
 * @param idTitle - The ID of the title element for drag handle
 * @returns The Draggable component or undefined
 */
const getDraggable = (isDraggable, idTitle) =>
  isDraggable ? (p) => <Draggable idTitle={idTitle} {...p} /> : undefined;

/**
 * Dialog Component
 *
 * A versatile modal dialog that extends MUI Dialog with additional features
 * like dragging, resizing, and maximizing.
 *
 * @param props - Dialog configuration properties
 * @param props.disablePortal - If true, renders dialog inline instead of in a portal
 * @param props.titleComponents - Content to render in the dialog title
 * @param props.actionComponents - Content to render in the dialog actions area
 * @param props.children - Main content of the dialog
 * @param props.dividers - If true, shows dividers around content area
 * @param props.isDraggable - If true, dialog can be dragged by its title
 * @param props.isResizeble - If true, dialog can be resized from corner
 * @param props.defaultWidth - Initial width of the dialog (default: 400)
 * @param props.defaultHeight - Initial height of the dialog (default: 400)
 * @param props.className - Additional CSS classes
 * @param props.hideBackdrop - If true, hides the modal backdrop
 * @param props.defaultX - Initial X position (when hideBackdrop is true)
 * @param props.defaultY - Initial Y position (when hideBackdrop is true)
 * @param props.disabledClose - If true, disables the close button
 * @returns A feature-rich dialog component
 *
 * @example
 * <Dialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   isDraggable
 *   isResizeble
 *   titleComponents={<span>My Dialog</span>}
 *   actionComponents={<Button onClick={handleClose}>Close</Button>}
 * >
 *   Dialog content here
 * </Dialog>
 */
const Dialog = (props: DialogProps) => {
  // Destructure props with defaults
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

  // Get controller state and handlers for drag/resize functionality
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

  // Compute CSS classes based on state
  const maxCalssName = isMax ? classes.max : undefined;
  const maxStaticCalssName = isMax ? clsx(classes.static, classes.max) : classes.static;
  const staticClassName = disablePortal ? maxStaticCalssName : maxCalssName;
  const hideBackdropClassName = hideBackdrop ? classes.hideBackdrop : undefined;

  // Memoize draggable component to prevent unnecessary recreations
  const DraggableComp = React.useMemo(() => getDraggable(isDraggable, idTitle), [isDraggable]);

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
      className={clsx(staticClassName, hideBackdropClassName, className)}
      onMouseUp={stopDrag}
      onMouseMove={doDrag}
      onMouseLeave={stopDrag}
      onMouseDown={onMouseDown}
      PaperProps={{
        sx: {
          width: width?.current,
          height: height?.current,
          borderBottomRightRadius: isResizeble ? 0 : undefined,
          maxWidth: isResizeble ? 'none' : undefined,
          minWidth: isResizeble ? '400px' : undefined,
          top: hideBackdrop ? (defaultY ?? top) : undefined,
          left: hideBackdrop ? (defaultX ?? left) : undefined,
        },
      }}
    >
      {/* Title section with drag handle and close button */}
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

      {/* Main content area */}
      <DialogContent ref={dialogContentRef} dividers={dividers} data-testid={`${PREFIX}-content`}>
        {children}
      </DialogContent>

      {/* Action buttons area */}
      {actionComponents && <DialogActions>{actionComponents}</DialogActions>}

      {/* Resize handle in bottom-right corner */}
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
