import React, { ReactElement } from "react";
import Input from "antd/lib/input";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <Input {...props} />
  </Theme>
);
export default Comp;
