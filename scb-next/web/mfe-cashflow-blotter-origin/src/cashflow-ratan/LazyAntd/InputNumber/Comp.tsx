import React, { ReactElement } from "react";
import InputNumber from "antd/lib/input-number";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <InputNumber {...props} />
  </Theme>
);
export default Comp;
