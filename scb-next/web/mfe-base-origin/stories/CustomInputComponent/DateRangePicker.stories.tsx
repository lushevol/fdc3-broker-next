import React from "react";
import type { Meta } from "@storybook/react"
/*
This is custom component, in your code it should be imported from "src/Root/import"
import { Input } from "src/Root/import";
*/
import DateRangePickerComp from "../../src/components/DateRangePicker"
import { DateRangePickerProps } from "../../src/components/DateRangePicker/common/interface";

/*
you will see this code in your repository at src/Root/import directory
import * as Container from "@fm/base";
...
export const DateRangePicker = Container.DateRangePicker.default;
...
export default Container;
*/


export const DateRangePicker = ({ value: _value, ...rest }: DateRangePickerProps) => {
  return (
    <DateRangePickerComp
      value={["2023-07-17", "2023-07-27"]}
      {...rest}
    />
  )
};

const meta: Meta<typeof DateRangePicker> = {
  title: "Custom Input Component/Date Range Picker",
  component: DateRangePicker,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

export const DateRangePickerTop: DateRangePickerProps = {
  //@ts-ignore
  args: {
    labelPosition: "top",
    label: "Date Range Picker Top",
  },
}


export const DateRangePickerLeft: DateRangePickerProps = {
  //@ts-ignore
  args: {
    labelPosition: "left",
    label: "Date Range Picker Left"
  },
}
