import type { Dayjs } from "dayjs";
import { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
export interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
