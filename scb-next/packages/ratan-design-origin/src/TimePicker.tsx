import React from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  TimePicker as MuiTimePicker,
  type TimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers/TimePicker';
import { datePickerClasses, datePickerStyle } from './date-style.js';
import { composePickerTextFieldSlotProps } from './picker-slot-props.js';
import { composeSx } from './sx.js';

export interface TimePickerProps extends MuiTimePickerProps<Dayjs> {
  labelPosition?: 'top' | 'left';
  hidden?: boolean;
}

export const TimePickerRoot = /*#__PURE__*/ styled(MuiTimePicker<Dayjs>)(
  datePickerStyle,
) as typeof MuiTimePicker<Dayjs>;

export const TimePicker = /*#__PURE__*/ React.memo(function TimePicker({
  labelPosition = 'top',
  value,
  hidden,
  sx,
  className,
  slotProps,
  ...rest
}: TimePickerProps) {
  return (
    <TimePickerRoot
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
