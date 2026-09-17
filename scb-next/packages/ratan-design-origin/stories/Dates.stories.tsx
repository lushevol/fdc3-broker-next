import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Stack from "@mui/material/Stack";
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  AdapterDayjs,
  LocalizationProvider
} from "../src/dates";
import { DateRangePicker } from "../src/date-range";

function Dates({ labelPosition = "top" }: { labelPosition?: "top" | "left" }) {
  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs("2026-09-18T15:30")
  );
  const [range, setRange] = React.useState<[Dayjs | null, Dayjs | null]>([
    dayjs("2026-09-18"),
    dayjs("2026-09-21")
  ]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ p: 3, maxWidth: 480 }}>
        <DatePicker
          label="Settlement"
          value={date}
          onChange={setDate}
          labelPosition={labelPosition}
        />
        <DateTimePicker
          label="Execution"
          value={date}
          onChange={setDate}
          labelPosition={labelPosition}
        />
        <TimePicker
          label="Cutoff"
          value={date}
          onChange={setDate}
          labelPosition={labelPosition}
        />
      <DateRangePicker
          label="Period"
          value={range}
          onChange={setRange}
        labelPosition={labelPosition}
        slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="Unavailable date"
          disabled
          labelPosition={labelPosition}
        />
      </Stack>
    </LocalizationProvider>
  );
}

const meta: Meta<typeof Dates> = { title: "Inputs/Dates", component: Dates };
export default meta;
export const Top: StoryObj<typeof Dates> = {};
export const Left: StoryObj<typeof Dates> = { args: { labelPosition: "left" } };
