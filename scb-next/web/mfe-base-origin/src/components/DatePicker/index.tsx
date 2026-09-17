import React from "react";
import {
  DatePicker as PackageDatePicker,
  type DatePickerProps
} from "ratan-design-origin/dates";
import { PREFIX, classes } from "./common/style";

const DatePicker: React.FC<DatePickerProps> = (props) => (
  <PackageDatePicker
    data-testid={PREFIX}
    className={props.labelPosition === "left" ? classes.left : undefined}
    {...props}
  />
);

export default React.memo(DatePicker);
