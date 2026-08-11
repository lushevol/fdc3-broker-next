import { DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
export interface DateRangePickerProps extends MuiDateRangePickerProps<any> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
