import { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
export interface DatePickerProps extends MuiDatePickerProps {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
