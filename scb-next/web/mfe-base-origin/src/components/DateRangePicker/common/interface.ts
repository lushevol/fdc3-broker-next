import type { Dayjs } from "dayjs";
import { DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
export interface DateRangePickerProps extends MuiDateRangePickerProps<Dayjs> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
