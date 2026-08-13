import { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
export interface TimePickerProps extends MuiTimePickerProps {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
