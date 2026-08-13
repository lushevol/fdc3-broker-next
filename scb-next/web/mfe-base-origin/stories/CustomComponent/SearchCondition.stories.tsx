import React from "react";
import type { Meta } from "@storybook/react-vite";
import Stack from '@mui/material/Stack';
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { SearchButton } from "src/Root/import";
*/
import SearchConditionComp, { SearchConditionProps } from "../../src/components/SearchCondition";
import SearchConditionContainer from "../../src/components/SearchConditionContainer";
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const SearchButton = Container.SearchButton.default;
export const SearchButtonProps = Container.SearchButton.SearchButtonProps;
...
export default Container;
*/

export const SearchCondition = ({ label, value, onClose, ...rest }: SearchConditionProps) => {
  const handleClose=(event: React.SyntheticEvent<Element, Event>)=>{
    //do whatever you need here
    console.log(event.target)
  }
  return (
    <SearchConditionContainer>
      <SearchConditionComp label={label || "Status"} value={value || "Affirmation Status"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Client FMID"} value={value || "CP28343"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Status"} value={value || "Affirmation Status"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Client FMID"} value={value || "CP28343"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Status"} value={value || "Affirmation Status"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Client FMID"} value={value || "CP28343"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Status"} value={value || "Affirmation Status"} onClose={handleClose} {...rest} />
      <SearchConditionComp label={label || "Client FMID"} value={value || "CP28343"} onClose={handleClose} {...rest} />
    </SearchConditionContainer>
  )
};

const meta: Meta<typeof SearchCondition> = {
  title: "Custom Component/Search Condition Label",
  component: SearchCondition,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta
