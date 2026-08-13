import { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

export interface DatePickerProps extends MuiDatePickerProps<Dayjs, boolean> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
