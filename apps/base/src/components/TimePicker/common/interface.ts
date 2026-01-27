import type { TimePickerProps as MuiTimePickerProps } from '@mui/x-date-pickers/TimePicker';

type TDate = /*unresolved*/ any;
export interface TimePickerProps extends MuiTimePickerProps<TDate> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}
