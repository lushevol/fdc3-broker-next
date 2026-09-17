import type { Dayjs } from "dayjs";
import { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
export interface TimePickerProps extends MuiTimePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
