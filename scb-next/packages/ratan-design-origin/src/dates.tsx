import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { styled } from "@mui/material/styles";
import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps
} from "@mui/x-date-pickers/DatePicker";
import {
  DateTimePicker as MuiDateTimePicker,
  type DateTimePickerProps as MuiDateTimePickerProps
} from "@mui/x-date-pickers/DateTimePicker";
import {
  TimePicker as MuiTimePicker,
  type TimePickerProps as MuiTimePickerProps
} from "@mui/x-date-pickers/TimePicker";
import { datePickerClasses, datePickerStyle } from "./date-style.js";

export { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
export { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
export type { Dayjs } from "dayjs";
export { datePickerClasses, datePickerStyle } from "./date-style.js";

export interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}

export const DatePickerRoot = /*#__PURE__*/ styled(MuiDatePicker<Dayjs>)(
  datePickerStyle
) as typeof MuiDatePicker<Dayjs>;

export const DatePicker = /*#__PURE__*/ React.memo(function DatePicker({
  labelPosition = "top",
  value,
  hidden,
  sx,
  className,
  ...rest
}: DatePickerProps) {
  return (
    <DatePickerRoot
      className={[
        labelPosition === "left" ? datePickerClasses.left : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      value={value === undefined ? undefined : value === null ? null : dayjs(value)}
      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
});

export interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}

export const DateTimePickerRoot = /*#__PURE__*/ styled(
  MuiDateTimePicker<Dayjs>
)(datePickerStyle) as typeof MuiDateTimePicker<Dayjs>;

export const DateTimePicker = /*#__PURE__*/ React.memo(function DateTimePicker({
  labelPosition = "top",
  value,
  hidden,
  sx,
  className,
  ...rest
}: DateTimePickerProps) {
  return (
    <DateTimePickerRoot
      className={[
        labelPosition === "left" ? datePickerClasses.left : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      value={value === undefined ? undefined : value === null ? null : dayjs(value)}
      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
});

export interface TimePickerProps extends MuiTimePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}

export const TimePickerRoot = /*#__PURE__*/ styled(MuiTimePicker<Dayjs>)(
  datePickerStyle
) as typeof MuiTimePicker<Dayjs>;

export const TimePicker = /*#__PURE__*/ React.memo(function TimePicker({
  labelPosition = "top",
  value,
  hidden,
  sx,
  className,
  ...rest
}: TimePickerProps) {
  return (
    <TimePickerRoot
      className={[
        labelPosition === "left" ? datePickerClasses.left : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      value={value === undefined ? undefined : value === null ? null : dayjs(value)}
      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
});
