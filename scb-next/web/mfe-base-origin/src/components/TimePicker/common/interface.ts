import { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
export interface TimePickerProps extends MuiTimePickerProps<false> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
