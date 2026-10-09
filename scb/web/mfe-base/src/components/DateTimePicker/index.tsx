import React from "react";
import {
  DateTimePicker as PackageDateTimePicker,
  type DateTimePickerProps
} from "ratan-design-origin/dates";
import { PREFIX, classes } from "./common/style";

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => (
  <PackageDateTimePicker
    data-testid={PREFIX}
    className={props.labelPosition === "left" ? classes.left : undefined}
    {...props}
  />
);

export default React.memo(DateTimePicker);
