import { DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
export interface DateRangePickerProps extends MuiDateRangePickerProps<false> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
