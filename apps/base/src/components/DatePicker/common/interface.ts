import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';

type TDate = /*unresolved*/ any;
export interface DatePickerProps extends MuiDatePickerProps<TDate> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}
