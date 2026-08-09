import React from "react";
import dayjs from "dayjs";
import Root, { classes, PREFIX } from "./common/style";
import { DateTimePickerProps } from "./common/interface";

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  labelPosition = "top",
  value: _value,
  hidden,
  sx,
  ...rest
}: DateTimePickerProps): React.ReactElement => {
  return (
    <Root
      className={labelPosition === "left" ? classes.left : undefined}
      data-testid={`${PREFIX}`}
      value={_value ? dayjs(_value) : null}
      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
};

export default React.memo(DateTimePicker);
