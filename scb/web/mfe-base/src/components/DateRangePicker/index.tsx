import React from "react";
import {
  DateRangePicker as PackageDateRangePicker,
  type DateRangePickerProps
} from "ratan-design-origin/date-range";
import { PREFIX, classes } from "./common/style";

const DateRangePicker: React.FC<DateRangePickerProps> = (props) => (
  <PackageDateRangePicker
    data-testid={PREFIX}
    className={props.labelPosition === "left" ? classes.left : undefined}
    {...props}
  />
);

export default React.memo(DateRangePicker);
