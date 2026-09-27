//Please check this page https://mui.com/material-ui/react-button/ for detail
import React from "react";
import type { Meta } from "@storybook/react-vite"
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "ratan-design-origin/primitives";

export interface ButtonProps extends MuiButtonProps {
  label: string;
}

export const Button = ({ label, variant, size, ...rest }: ButtonProps) => (
  <MuiButton variant={variant || "contained"} size={size || "small"} {...rest}>{label || "label"}</MuiButton>
);

const meta: Meta<typeof Button> = {
  title: "MUI Input Component/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const ContainedPrimary: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "primary",
  },
}

export const ContainedSecondary: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "secondary",
  },
}

export const ContainedInherit: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "inherit",
  },
}


export const ContainedSuccess: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "success",
  },
}

export const ContainedError: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "error",
  },
}

export const ContainedInfo: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "info",
  },
}

export const ContainedWarning: MuiButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "warning",
  },
}

export const TextLarge: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "text",
    color: "primary",
  },
}

export const TextMedium: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "text",
    color: "primary",
  },
}

export const TextSmall: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "text",
    color: "primary",
  },
}

export const ContainedLarge: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "contained",
    color: "primary",
  },
}

export const ContainedMedium: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "contained",
    color: "primary",
  },
}

export const ContainedSmall: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "contained",
    color: "primary",
  },
}

export const OutlinedLarge: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "outlined",
    color: "primary",
  },
}

export const OutlinedMedium: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    color: "primary",
  },
}

export const OutlinedSmall: MuiButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
    color: "primary",
  },
}
