import type { DateTimePickerProps as MuiDateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
export interface DateTimePickerProps extends MuiDateTimePickerProps<any> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}
