import React from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { datePickerClasses, datePickerStyle } from './date-style.js';
import { composePickerTextFieldSlotProps } from './picker-slot-props.js';
import { composeSx } from './sx.js';

export interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}

export const DatePickerRoot = /*#__PURE__*/ styled(MuiDatePicker<Dayjs>)(
  datePickerStyle,
) as typeof MuiDatePicker<Dayjs>;

export const DatePicker = /*#__PURE__*/ React.memo(function DatePicker({
  labelPosition = 'top',
  value,
  hidden,
  sx,
  className,
  slotProps,
  ...rest
}: DatePickerProps) {
  return (
    <DatePickerRoot
      className={[labelPosition === 'left' ? datePickerClasses.left : '', className]
        .filter(Boolean)
        .join(' ')}
      value={value === undefined ? undefined : value === null ? null : dayjs(value)}
      slotProps={{
        ...slotProps,
        textField: composePickerTextFieldSlotProps(slotProps?.textField, hidden),
      }}
      sx={composeSx(sx, hidden ? { display: 'none!important' } : undefined)}
      {...rest}
    />
  );
});
