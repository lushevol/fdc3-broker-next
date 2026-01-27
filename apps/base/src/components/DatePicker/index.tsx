import dayjs from 'dayjs';
import React from 'react';
import type { DatePickerProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const DatePicker: React.FC<DatePickerProps> = ({
  labelPosition = 'top',
  value: _value,
  hidden,
  sx,
  ...rest
}: DatePickerProps): React.ReactElement => {
  return (
    <Root
      className={labelPosition === 'left' ? classes.left : undefined}
      data-testid={`${PREFIX}`}
      value={_value ? dayjs(_value) : null}
      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
      sx={{ ...sx, display: hidden ? 'none!important' : undefined }}
      {...rest}
    />
  );
};

export default React.memo(DatePicker);
