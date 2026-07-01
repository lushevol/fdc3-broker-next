import { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
type TDate = any;
export interface DatePickerProps extends MuiDatePickerProps<TDate> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
export {};
