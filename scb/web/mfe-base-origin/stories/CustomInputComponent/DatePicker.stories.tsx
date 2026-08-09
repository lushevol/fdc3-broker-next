import React from "react";
import type { Meta } from "@storybook/react"
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Input } from "src/Root/import";
*/
import DatePickerComp from "../../src/components/DatePicker"
import { DatePickerProps } from "../../src/components/DatePicker/common/interface";

/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const DatePicker = Container.DatePicker.default;
...
export default Container;
*/


export const DatePicker = ({ value: _value, ...rest }: DatePickerProps) => {
  return (
    <DatePickerComp
      value={"2023-07-17"}
      {...rest}
    />
  )
};

const meta: Meta<typeof DatePicker> = {
  title: "Custom Input Component/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const DatePickerTop: DatePickerProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "Date Picker Top",
  },
}


export const DatePickerLeft: DatePickerProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "Date Picker Left"
  },
}
