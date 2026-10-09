import React from "react";
import {
  TimePicker as PackageTimePicker,
  type TimePickerProps
} from "ratan-design-origin/dates";
import { PREFIX, classes } from "./common/style";

const TimePicker: React.FC<TimePickerProps> = (props) => (
  <PackageTimePicker
    data-testid={PREFIX}
    className={props.labelPosition === "left" ? classes.left : undefined}
    {...props}
  />
);

export default React.memo(TimePicker);
