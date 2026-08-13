import React from "react";
import type { Meta } from "@storybook/react-vite";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { SearchButton } from "src/Root/import";
*/
import LabelComp, { LabelProps, MenuItem } from "../../src/components/Label";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const SearchButton = Container.SearchButton.default;
export const SearchButtonProps = Container.SearchButton.SearchButtonProps;
...
export default Container;
*/

export const Label = ({ onChange, value, label, ...rest }: LabelProps) => {
  const [selectedLabel, setLabel] = React.useState<string>(`${label || "Label"}`);

  const handleChange = (event) => {
    setLabel(event.target.value as string);
  };
  return (
    <LabelComp onChange={handleChange} value={selectedLabel} label={label || "Label"} {...rest} >
      <MenuItem value='Affirmation Status' dense>Affirmation Status</MenuItem>
      <MenuItem value='Confirmation Status' dense>Confirmation Status</MenuItem>
      <MenuItem value='POU Status' dense>POU Status</MenuItem>
    </LabelComp>
  )
};

const meta: Meta<typeof Label> = {
  title: "Custom Input Component/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const AnotherLabel: LabelProps = {
  //@ts-ignore
  args: {
    label: "Another Label",
  },
}