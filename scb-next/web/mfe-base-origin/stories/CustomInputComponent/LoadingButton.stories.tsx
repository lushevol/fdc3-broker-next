import React from "react";
import type { Meta } from "@storybook/react-vite";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { LoadingButton } from "src/Root/import";
*/
import LoadingButton from "../../src/components/LoadingButton";
import { LoadingButtonProps } from "../../src/components/LoadingButton/interface";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const LoadingButton = Container.LoadingButton.default;
export const LoadingButtonProps = Container.LoadingButtonProps.LoadingButtonProps;
...
export default Container;
*/

export interface ButtonProps extends LoadingButtonProps {
  label: string;
}

export const Button = ({ label, variant, size, onClick, ...rest }: ButtonProps) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <LoadingButton
      variant={variant || "contained"}
      size={size || "small"}
      {...rest}
      loading={loading}
      onClick={() => setLoading(p => !p)}
    >
      {label || "label"}
    </LoadingButton>
  )
};

const meta: Meta<typeof Button> = {
  title: "Custom Input Component/Loading Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const ContainedPrimary: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "primary",
  },
}

export const ContainedSecondary: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "secondary",
  },
}

export const ContainedInherit: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "inherit",
  },
}


export const ContainedSuccess: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "success",
  },
}

export const ContainedError: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "error",
  },
}

export const ContainedInfo: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "info",
  },
}

export const ContainedWarning: ButtonProps = {
  //@ts-ignore
  args: {
    variant: "contained",
    color: "warning",
  },
}

export const TextLarge: ButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "text",
    color: "primary",
  },
}

export const TextMedium: ButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "text",
    color: "primary",
  },
}

export const TextSmall: ButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "text",
    color: "primary",
  },
}

export const ContainedLarge: ButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "contained",
    color: "primary",
  },
}

export const ContainedMedium: ButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "contained",
    color: "primary",
  },
}

export const ContainedSmall: ButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "contained",
    color: "primary",
  },
}

export const OutlinedLarge: ButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
    variant: "outlined",
    color: "primary",
  },
}

export const OutlinedMedium: ButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    color: "primary",
  },
}

export const OutlinedSmall: ButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
    color: "primary",
  },
}
