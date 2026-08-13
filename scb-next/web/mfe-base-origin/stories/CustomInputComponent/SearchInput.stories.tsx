import React from "react";
import type { Meta } from "@storybook/react-vite"
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Input } from "src/Root/import";
*/
import Input, { SearchInputProps } from "../../src/components/SearchInput"

/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const SearchInput = Container.SearchInput.default;
export const SearchInputProps = Container.SearchInput.SearchInputProps;
...
export default Container;
*/

export const SearchInput = ({ handleClear, value, label, onChange, variant, ...rest }: SearchInputProps) => {
  const [searchVal, setSearchVal] = React.useState("")
  const onClear = () => {
    setSearchVal("")
  }
  return (
    <Input
      labelPosition="top"
      label="Show All Columns"
      variant="outlined"
      fullWidth
      value={searchVal}
      onChange={(e) => setSearchVal(e.target.value)}
      handleClear={onClear}
      {...rest}
    />
  )
};

const meta: Meta<typeof SearchInput> = {
  title: "Custom Input Component/Search Input",
  component: SearchInput,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const InputTopLabelSmall: SearchInputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "small",
  },
}

export const InputTopLabelMedium: SearchInputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "medium",
  },
}

export const InputLeftLabelSmall: SearchInputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label"
  },
}

export const InputLeftLabelMedium: SearchInputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label",
    size: "medium",
  },
}