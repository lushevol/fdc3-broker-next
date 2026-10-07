import React from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  DateTimePicker as MuiDateTimePicker,
  type DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { datePickerClasses, datePickerStyle } from './date-style.js';
import { composePickerTextFieldSlotProps } from './picker-slot-props.js';
import { composeSx } from './sx.js';

export interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}

export const DateTimePickerRoot = /*#__PURE__*/ styled(MuiDateTimePicker<Dayjs>)(
  datePickerStyle,
) as typeof MuiDateTimePicker<Dayjs>;

export const DateTimePicker = /*#__PURE__*/ React.memo(function DateTimePicker({
  labelPosition = 'top',
  value,
  hidden,
  sx,
  className,
  slotProps,
  ...rest
}: DateTimePickerProps) {
  return (
    <DateTimePickerRoot
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
