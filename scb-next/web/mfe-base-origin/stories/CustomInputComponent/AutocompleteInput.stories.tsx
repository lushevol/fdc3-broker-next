import React from "react";
import type { Meta } from "@storybook/react-vite"
import {
  Autocomplete as MuiAutocomplete,
  Box,
} from "@mui/material";
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Input } from "src/Root/import";
*/
import Input, { InputProps } from "../../src/components/Input"
/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const Input = Container.Input.default;
export const InputProps = Container.Input.InputProps;
...
export default Container;
*/

import { countries } from "../data"

export const Autocomplete = ({ label, sx, variant, ...rest }: InputProps) => (
  <MuiAutocomplete
    id="MuiAutocomplete_InputComp_element_id"
    sx={{ width: 300 }}
    renderInput={((params) => <Input {...params} label={label || "label"} variant={variant || "outlined"} sx={sx || { width: 300 }}  {...rest} />)}
    options={countries}
    autoHighlight
    getOptionLabel={(option) => option.label}
    renderOption={(props, option) => (
      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        <img
          loading="lazy"
          width="20"
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          alt=""
        />
        {option.label} ({option.code}) +{option.phone}
      </Box>
    )}
  />
);

const meta: Meta<typeof Autocomplete> = {
  title: "Custom Input Component/Autocomplete Input",
  component: Autocomplete,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const AutocompleteTopLabelSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "small",
  },
}

export const AutocompleteTopLabelMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "label",
    size: "medium",
  },
}

export const AutocompleteLeftLabelSmall: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label"
  },
}

export const AutocompleteLeftLabelMedium: InputProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "label",
    size: "medium",
  },
}