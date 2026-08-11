//Please check this page https://mui.com/material-ui/react-button/ for detail
import React from "react";
import type { Meta } from "@storybook/react"
import Comp, { ChipProps as MuiChipProps } from '@mui/material/Chip';

export interface ChipProps extends MuiChipProps {
  label?: string
}

export const Chip = ({label, size, ...rest}: ChipProps) => (
  <Comp label={label || "Label"} size={size || "small"}  {...rest} />
);

const meta: Meta<typeof Chip> = {
  title: "MUI Input Component/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const ContainedPrimary: ChipProps = {
  //@ts-ignore
  args: {
    color: "primary",
  },
}

export const ContainedSecondary: ChipProps = {
  //@ts-ignore
  args: {
    color: "secondary",
  },
}

export const ContainedInherit: ChipProps = {
  //@ts-ignore
  args: {
    color: "default",
  },
}


export const ContainedSuccess: ChipProps = {
  //@ts-ignore
  args: {
    color: "success",
  },
}

export const ContainedError: ChipProps = {
  //@ts-ignore
  args: {
    color: "error",
  },
}

export const ContainedInfo: ChipProps = {
  //@ts-ignore
  args: {
    color: "info",
  },
}

export const ContainedWarning: ChipProps = {
  //@ts-ignore
  args: {
    color: "warning",
  },
}



export const ContainedLarge: ChipProps = {
  //@ts-ignore
  args: {
    size: "large",
    color: "primary",
  },
}

export const ContainedMedium: ChipProps = {
  //@ts-ignore
  args: {
    size: "medium",
    color: "primary",
  },
}

export const ContainedSmall: ChipProps = {
  //@ts-ignore
  args: {
    size: "small",
    color: "primary",
  },
}


export const OutlinedPrimary: ChipProps = {
  //@ts-ignore
  args: {
    color: "primary",
    variant: "outlined",
  },
}

export const OutlinedSecondary: ChipProps = {
  //@ts-ignore
  args: {
    color: "secondary",
    variant: "outlined",
  },
}

export const OutlinedInherit: ChipProps = {
  //@ts-ignore
  args: {
    color: "default",
    variant: "outlined",
  },
}


export const OutlinedSuccess: ChipProps = {
  //@ts-ignore
  args: {
    color: "success",
    variant: "outlined",
  },
}

export const OutlinedError: ChipProps = {
  //@ts-ignore
  args: {
    color: "error",
    variant: "outlined",
  },
}

export const OutlinedInfo: ChipProps = {
  //@ts-ignore
  args: {
    color: "info",
    variant: "outlined",
  },
}

export const OutlinedWarning: ChipProps = {
  //@ts-ignore
  args: {
    color: "warning",
    variant: "outlined",
  },
}


export const OutlinedLarge: ChipProps = {
  //@ts-ignore
  args: {
    size: "large",
    color: "primary",
    variant: "outlined",
  },
}

export const OutlinedMedium: ChipProps = {
  //@ts-ignore
  args: {
    size: "medium",
    color: "primary",
    variant: "outlined",
  },
}

export const OutlinedSmall: ChipProps = {
  //@ts-ignore
  args: {
    size: "small",
    color: "primary",
    variant: "outlined",
  },
}