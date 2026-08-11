import React, { ReactElement } from "react";
import Input from "antd/lib/input";
import Theme from "../Theme";
const TextAreaComp: React.FC = (props): ReactElement => (
  <Theme>
    <Input.TextArea {...props} />
  </Theme>
);
export default TextAreaComp;
