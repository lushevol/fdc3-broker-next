import React from "react";
import type { Meta } from "@storybook/react-vite";
import { Button, Typography, SnackbarCloseReason } from 'ratan-design-origin/primitives';
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { PageLoader } from "src/Root/import";
*/
import Dialog from "../../src/components/Dialog";
import { DialogProps } from "../../src/components/Dialog/common/types";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Dialog = Container.Dialog.default;
...
export default Container;
*/
export const DialogComp = ({ onClose, id, open, ...rest }: DialogProps) => {
  const [openDialog, setOpenDialog] = React.useState(true)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
  };
  return (<Dialog
    open={openDialog}
    onClose={handleClose}
    id={id || "DialogCompId"}
    titleComponents="Title"
    isDraggable
    isResizeble
    dividers={true}
    actionComponents={<Button onClick={handleClose}>Close</Button>}
    {...rest}
  >
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
    <Typography gutterBottom>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
      dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
      consectetur ac, vestibulum at eros.
    </Typography>
    <Typography gutterBottom>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
      Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
    </Typography>
    <Typography gutterBottom>
      Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
      magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Typography>
  </Dialog>)
};
//
const meta: Meta<typeof DialogComp> = {
  title: "Custom Component/Dialog/Text Title",
  component: DialogComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta


export const DialogNotDraggableNotResizeble: DialogProps = {
  //@ts-ignore
  args: {
    titleComponents: "Not Draggable Not Resizeble",
    isDraggable: false,
    isResizeble: false
  },
}

export const DialogNoActionsComponentDraggableResizeble: DialogProps = {
  //@ts-ignore
  args: {
    titleComponents: "No Actions Component Draggable Resizeble",
    isDraggable: true,
    isResizeble: true,
    actionComponents: undefined
  },
}

export const DialogNoActionsComponentNotDraggableNotResizeble: DialogProps = {
  //@ts-ignore
  args: {
    titleComponents: "No Actions Component Not Draggable Not Resizeble",
    isDraggable: false,
    isResizeble: false,
    actionComponents: undefined
  },
}