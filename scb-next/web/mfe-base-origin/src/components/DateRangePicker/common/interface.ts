import { DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
export interface DateRangePickerProps extends MuiDateRangePickerProps {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
