import React, { ReactElement } from "react";
import Select from "antd/lib/select";
import Theme from "../Theme";
const Comp: React.FC = (props): ReactElement => (
  <Theme>
    <Select {...props} />
  </Theme>
);
export default Comp;
