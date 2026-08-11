import React, { ReactElement } from "react";
import Checkbox from "antd/lib/checkbox";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <Checkbox {...props} />
  </Theme>
);
export default Comp;
