import { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
type TDate = any;
export interface TimePickerProps extends MuiTimePickerProps<TDate> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
export {};
