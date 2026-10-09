import React, { Suspense } from "react";
import type { Meta } from "@storybook/react";
import { Button, SnackbarCloseReason } from "ratan-design-origin/primitives";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Splash } from "src/Root/import";
*/
import Snackbar, { SnackbarProps } from "../../src/components/Snackbar";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Splash = Container.Splash.default;
...
export default Container;
*/
//

export const SnackbarComp = (props: SnackbarProps) => {
  const [open, setOpen] = React.useState(true)
  const handleCloseErrorMessage = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      {...props}
      open={open}
      onClose={handleCloseErrorMessage}
      message={props.message || "Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn't interrupt the user experience, and they don't require user input to disappear. Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn't interrupt the user experience, and they don't require user input to disappear. Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn't interrupt the user experience, and they don't require user input to disappear."}
      variant={props.variant || "standard"}
      severity={props.severity || "success"}
      action={props.action || (<Button color="inherit" size="medium">Action </Button>)}
    />
  )
};

const meta: Meta<typeof SnackbarComp> = {
  title: "Custom Component /Snackbar",
  component: SnackbarComp,
  tags: ["autodocs"],
  argTypes: {},
}
//
export default meta


export const ShortMessage: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "standard",
    message: "Short message",
    severity: "success"
  },
}

export const StandardInfo: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "standard",
    severity: "info"
  },
}

export const StandardWarning: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "standard",
    severity: "warning"
  },
}

export const StandardError: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "standard",
    severity: "error"
  },
}

export const OutlinedSuccess: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "outlined",
    severity: "success"
  },
}

export const OutlinedInfo: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "outlined",
    severity: "info"
  },
}

export const OutlinedWarning: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "outlined",
    severity: "warning"
  },
}

export const OutlinedError: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "outlined",
    severity: "error"
  },
}

export const FilledSuccess: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "filled",
    severity: "success"
  },
}

export const FilledInfo: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "filled",
    severity: "info"
  },
}

export const FilledWarning: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "filled",
    severity: "warning"
  },
}

export const FilledError: SnackbarProps = {
  //@ts-ignore
  args: {
    variant: "filled",
    severity: "error"
  },
}
