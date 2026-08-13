import { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
import type { Dayjs } from "dayjs";

export interface TimePickerProps extends MuiTimePickerProps<Dayjs, boolean> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
