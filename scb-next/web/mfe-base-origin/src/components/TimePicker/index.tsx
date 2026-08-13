import React from "react";
import dayjs from "dayjs";
import Root, { classes, PREFIX } from "./common/style";
import { TimePickerProps } from "./common/interface";

const TimePicker: React.FC<TimePickerProps> = ({
  labelPosition = "top",
  value: _value,
  hidden,
  sx,
  ...rest
}: TimePickerProps): React.ReactElement => {
  return (
    <Root
      className={labelPosition === "left" ? classes.left : undefined}
      data-testid={`${PREFIX}`}
      value={_value ? dayjs(_value) : null}
      slotProps={{ textField: { slotProps: { inputLabel: { shrink: true } } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
};

export default React.memo(TimePicker);
