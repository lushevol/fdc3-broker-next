import React from "react";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import dayjs from "dayjs";
import Root, { classes, PREFIX } from "./common/style";
import { DateRangePickerProps } from "./common/interface";

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  labelPosition = "top",
  slots: _slots,
  value: _value,
  hidden,
  sx,
  ...rest
}: DateRangePickerProps): React.ReactElement => {
  return (
    <Root
      className={labelPosition === "left" ? classes.left : undefined}
      data-testid={`${PREFIX}`}
      value={
        _value?.length === 2 ? [dayjs(_value[0]), dayjs(_value[1])] : undefined
      }
      slots={{ field: SingleInputDateRangeField }}
      slotProps={{ textField: { slotProps: { inputLabel: { shrink: true } } } }}
      sx={{ ...sx, display: hidden ? "none!important" : undefined }}
      {...rest}
    />
  );
};

export default React.memo(DateRangePicker);
