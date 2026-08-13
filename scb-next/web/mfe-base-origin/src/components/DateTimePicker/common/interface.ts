import { DateTimePickerProps as MuiDateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
export interface DateTimePickerProps extends MuiDateTimePickerProps<false> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
