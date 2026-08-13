import { DateRangePickerProps as MuiDateRangePickerProps } from "@mui/x-date-pickers-pro";
import type { Dayjs } from "dayjs";

export interface DateRangePickerProps
  extends MuiDateRangePickerProps<Dayjs, boolean> {
  labelPosition?: "top" | "left";
  hidden?: boolean;
}
