import React from "react";
import dayjs from "dayjs";
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  AdapterDayjs,
  LocalizationProvider,
  type DatePickerProps
} from "ratan-design-origin/dates";
import {
  DateRangePicker,
  type DateRangePickerProps
} from "ratan-design-origin/date-range";

const dateProps: DatePickerProps = {
  value: dayjs("2026-09-18"),
  labelPosition: "left"
};
const rangeProps: DateRangePickerProps = {
  value: [dayjs("2026-09-18"), dayjs("2026-09-21")]
};

export function Dates() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker {...dateProps} label="Settlement" />
      <DateTimePicker label="Execution" />
      <TimePicker label="Cutoff" />
      <DateRangePicker {...rangeProps} label="Complete period" />
      <DateRangePicker value={[null, null]} label="Empty period" />
      <DateRangePicker
        value={[dayjs("2026-09-18"), null]}
        label="Open-ended period"
      />
      <DateRangePicker
        value={[null, dayjs("2026-09-21")]}
        label="Open-start period"
      />
    </LocalizationProvider>
  );
}
