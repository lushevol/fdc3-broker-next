//Please check this page https://mui.com/material-ui/react-text-field/ for detail
import React from "react";
import type { Meta } from "@storybook/react-vite"
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "ratan-design-origin/primitives";

export const TextField = ({ label, placeholder, ...rest }: MuiTextFieldProps) => (
  <MuiTextField label={label || "label"} placeholder={placeholder || "Plese type"} {...rest} />
);

const meta: Meta<typeof TextField> = {
  title: "MUI Input Component/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta


export const TextFieldOutlinedSmall: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
  },
}

export const TextFieldOutlinedMedium: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
  },
}

export const TextFieldOutlinedSmallError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
    error: true,
  },
}

export const TextFieldOutlinedMediumError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    error: true,
  },
}

export const TextFieldFilledSmall: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "filled",
  },
}

export const TextFieldFilledMedium: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "filled",
  },
}

export const TextFieldFilledSmallError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "filled",
    error: true,
  },
}

export const TextFieldFilledMediumError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "filled",
    error: true,
  },
}

export const TextFieldStandardSmall: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "standard",
  },
}

export const TextFieldStandardMedium: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
  },
}

export const TextFieldStandardSmallError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "standard",
    error: true,
  },
}

export const TextFieldStandardMediumError: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
    error: true,
  },
}

export const MultilineTextFieldOutlinedSmall: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
    multiline: true,
    maxRows: 10,
  },
}

export const MultilineTextFieldOutlinedMedium: MuiTextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    multiline: true,
    maxRows: 10,
  },
}