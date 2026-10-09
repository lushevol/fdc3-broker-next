//Please check this page https://mui.com/material-ui/react-text-field/ for detail
import React from "react";
import type { Meta } from "@storybook/react"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps
} from "ratan-design-origin/primitives";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "ratan-design-origin/icons";
import { OutlinedInput as OutlinedInput } from "ratan-design-origin/primitives";

export const Select = ({ onChange, label, size, ...rest }: MuiSelectProps) => {
  const [age, setAge] = React.useState();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth size={size || "medium"}>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <MuiSelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        label={label || "Age"}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownIcon}
        defaultValue="Please Select"
        {...rest}
      >
        <MenuItem disabled value="">
          <em>Please Select</em>
        </MenuItem>
        <MenuItem value="Please Select" style={{ display: "none" }}>Please Select</MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </MuiSelect>
    </FormControl>
  )
}

const meta: Meta<typeof Select> = {
  title: "MUI Input Component/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta



export const SelectOutlinedSmall: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
  },
}

export const SelectOutlinedMedium: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
  },
}

export const SelectOutlinedMediumDefaultValue: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    defaultValue: "20",
  },
}

export const SelectOutlinedSmallError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "outlined",
    error: true,
  },
}

export const SelectOutlinedMediumError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "outlined",
    error: true,
  },
}

export const SelectFilledSmall: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "filled",
  },
}

export const SelectFilledMedium: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "filled",
  },
}

export const SelectFilledSmallError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "filled",
    error: true,
  },
}

export const SelectFilledMediumError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "filled",
    error: true,
  },
}

export const SelectStandardSmall: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "standard",
  },
}

export const SelectStandardMedium: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
  },
}

export const SelectStandardSmallError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "small",
    variant: "standard",
    error: true,
  },
}

export const SelectStandardMediumError: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
    error: true,
  },
}

export const SelectStandardMediumWithOutlinedInput: MuiSelectProps = {
  //@ts-ignore
  args: {
    size: "medium",
    variant: "standard",
    input: <OutlinedInput />
  },
}