import dayjs from 'dayjs';
import React from 'react';
import type { TimePickerProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const TimePicker: React.FC<TimePickerProps> = ({
  labelPosition = 'top',
  value: _value,
  hidden,
  sx,
  ...rest
}: TimePickerProps): React.ReactElement => {
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

export default React.memo(TimePicker);
