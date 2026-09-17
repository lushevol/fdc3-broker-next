import type { Dayjs } from "dayjs";
import { DateTimePickerProps as MuiDateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
export interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
