//Please check this page https://mui.com/material-ui/react-autocomplete/ for detail
import React from "react";
import type { Meta } from "@storybook/react-vite"
import {
  TextField,
  TextFieldProps,
  Autocomplete as MuiAutocomplete,
} from "@mui/material";
import { top100Films } from "../data"

export const Autocomplete = ({ label, ...rest }: TextFieldProps) => (
  <MuiAutocomplete
    disablePortal
    id="MuiAutocomplete_TextField_element_id"
    sx={{ width: 300 }}
    renderInput={((params) => <TextField {...params} label={label || "label"} {...rest} />)}
    options={top100Films}
  />
);

const meta: Meta<typeof Autocomplete> = {
  title: "MUI Input Component/Autocomplete TextField",
  component: Autocomplete,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const AutocompleteOutlinedSmall: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
  },
}

export const AutocompleteOutlinedMedium: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
  },
}


export const AutocompleteFilledSmall: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "filled",
  },
}

export const AutocompleteFilledMedium: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "filled",
  },
}

export const AutocompleteStandardSmall: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "standard",
  },
}

export const AutocompleteStandardMedium: TextFieldProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
  },
}
