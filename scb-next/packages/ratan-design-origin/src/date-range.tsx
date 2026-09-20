import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { styled } from "@mui/material/styles";
import {
  DateRangePicker as MuiDateRangePicker,
  type DateRangePickerProps as MuiDateRangePickerProps
} from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { datePickerClasses, datePickerStyle } from "./date-style.js";
import { composeSx } from "./sx.js";

export interface DateRangePickerProps extends MuiDateRangePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}

export const DateRangePickerRoot = /*#__PURE__*/ styled(
  MuiDateRangePicker<Dayjs>
)(datePickerStyle) as typeof MuiDateRangePicker<Dayjs>;

export const DateRangePicker = /*#__PURE__*/ React.memo(
  function DateRangePicker({
    labelPosition = "top",
    value,
    slots: _slots,
    hidden,
    sx,
    className,
    ...rest
  }: DateRangePickerProps) {
    return (
      <DateRangePickerRoot
        className={[
          labelPosition === "left" ? datePickerClasses.left : "",
          className
        ]
          .filter(Boolean)
          .join(" ")}
        value={
          value?.length === 2
            ? [
                value[0] === null ? null : dayjs(value[0]),
                value[1] === null ? null : dayjs(value[1])
              ]
            : undefined
        }
        slots={{ field: SingleInputDateRangeField }}
        slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
        sx={composeSx(sx, hidden ? { display: "none!important" } : undefined)}
        {...rest}
      />
    );
  }
);
