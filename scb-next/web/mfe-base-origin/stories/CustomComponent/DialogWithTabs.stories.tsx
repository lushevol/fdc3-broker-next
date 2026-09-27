import React from "react";
import type { Meta } from "@storybook/react-vite";
import { Button, Tabs, Tab, Typography, Box, SnackbarCloseReason } from 'ratan-design-origin/primitives';
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const DialogComp = ({ onClose, id, open, ...rest }: DialogProps) => {
  const [openDialog, setOpenDialog] = React.useState(true)
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
    titleComponents={<Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ minWidth: '300px' }}>
      <Tab label="Item One" {...a11yProps(0)} />
      <Tab label="Item Two" {...a11yProps(1)} />
      <Tab label="Item Three" {...a11yProps(2)} />
    </Tabs>}
    isDraggable
    isResizeble
    dividers={true}
    actionComponents={<Button onClick={handleClose}>Close</Button>}
    {...rest}
  >
    <CustomTabPanel value={value} index={0}>
      Item One
    </CustomTabPanel>
    <CustomTabPanel value={value} index={1}>
      Item Two
    </CustomTabPanel>
    <CustomTabPanel value={value} index={2}>
      Item Three
    </CustomTabPanel>
  </Dialog>)
};
//
const meta: Meta<typeof DialogComp> = {
  title: "Custom Component/Dialog/ With Tabs",
  component: DialogComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta

export const DialogNotDraggableNotResizeble: DialogProps = {
  //@ts-ignore
  args: {
    isDraggable: false,
    isResizeble: false
  },
}

export const DialogNoActionsComponentDraggableResizeble: DialogProps = {
  //@ts-ignore
  args: {
    isDraggable: true,
    isResizeble: true,
    actionComponents: undefined
  },
}

export const DialogNoActionsComponentNotDraggableNotResizeble: DialogProps = {
  //@ts-ignore
  args: {
    isDraggable: false,
    isResizeble: false,
    actionComponents: undefined
  },
}