import React, { ReactElement } from "react";
import TimePicker from "antd/lib/time-picker";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <TimePicker {...props} />
  </Theme>
);
export default Comp;
