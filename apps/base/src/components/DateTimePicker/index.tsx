import dayjs from 'dayjs';
import React from 'react';
import type { DateTimePickerProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  labelPosition = 'top',
  value: _value,
  hidden,
  sx,
  ...rest
}: DateTimePickerProps): React.ReactElement => {
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

export default React.memo(DateTimePicker);
