import React, { ReactElement } from "react";
import DatePicker from "antd/lib/date-picker";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <DatePicker {...props} />
  </Theme>
);
export default Comp;
