import React from "react";
import type { Meta } from "@storybook/react";
import { ToggleButtonGroup } from "@mui/material";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { LoadingButton } from "src/Root/import";
*/
import ToggleButton, { ToggleButtonProps } from "../../src/components/ToggleButton";

/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const LoadingButton = Container.LoadingButton.default;
export const LoadingButtonProps = Container.LoadingButtonProps.LoadingButtonProps;
...
export default Container;
*/

export interface ButtonProps extends ToggleButtonProps {
  label: string;
}

export const Button = ({ value, ...rest }: ButtonProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>('Tracking');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    neValue: string | null,
  ) => {
    setSelectedValue(neValue);
  };

  return (
    <ToggleButtonGroup
      value={selectedValue}
      exclusive
      onChange={handleAlignment}
      aria-label="value"
    >
      <ToggleButton color="primary" value="Tracking" aria-label="Tracking" {...rest}>
        Tracking
      </ToggleButton>
      <ToggleButton color="primary" value="Archived" aria-label="Archived" {...rest}>
        Archived
      </ToggleButton>
    </ToggleButtonGroup>
  )
};

const meta: Meta<typeof Button> = {
  title: "Custom Input Component/Toggle Button/ 2 Buttons",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const ColorPrimary: ButtonProps = {
  //@ts-ignore
  args: {
    color: "primary",
  },
}

export const ColorSecondary: ButtonProps = {
  //@ts-ignore
  args: {
    color: "secondary",
  },
}

export const ColorSuccess: ButtonProps = {
  //@ts-ignore
  args: {
    color: "success",
  },
}

export const ColorError: ButtonProps = {
  //@ts-ignore
  args: {
    color: "error",
  },
}

export const ColorInfo: ButtonProps = {
  //@ts-ignore
  args: {
    color: "info",
  },
}

export const ColorWarning: ButtonProps = {
  //@ts-ignore
  args: {
    color: "warning",
  },
}

export const Large: ButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    color: "primary",
  },
}

export const Medium: ButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    color: "primary",
  },
}

export const Small: ButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    color: "primary",
  },
}
