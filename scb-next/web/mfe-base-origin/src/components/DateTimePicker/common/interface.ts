import { DateTimePickerProps as MuiDateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import type { Dayjs } from "dayjs";

export interface DateTimePickerProps
  extends MuiDateTimePickerProps<Dayjs, boolean> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
