import React from "react";
import type { Meta } from "@storybook/react";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { SearchButton } from "src/Root/import";
*/
import SearchButton, { SearchButtonProps } from "../../src/components/SearchButton";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const SearchButton = Container.SearchButton.default;
export const SearchButtonProps = Container.SearchButton.SearchButtonProps;
...
export default Container;
*/

export interface ButtonProps extends SearchButtonProps {
  label: string;
}

export const Button = ({ label, size, ...rest }: ButtonProps) => {

  return (
    <SearchButton
      size={size || "small"}
      {...rest}
    >
      {label || "Search"}
    </SearchButton>
  )
};

const meta: Meta<typeof Button> = {
  title: "Custom Input Component/Search Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta


export const Large: ButtonProps = {
  //@ts-ignore
  args: {
    size: "large",
  },
}

export const Medium: ButtonProps = {
  //@ts-ignore
  args: {
    size: "medium",
  },
}

export const Small: ButtonProps = {
  //@ts-ignore
  args: {
    size: "small",
  },
}
