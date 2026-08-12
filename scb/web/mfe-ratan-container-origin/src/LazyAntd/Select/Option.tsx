import React, { ReactElement } from "react";
import Select from "antd/lib/select";
import Theme from "../Theme";
const Option: React.FC<any> = (props: any): ReactElement => (
  <Theme>
    <Select.Option {...props} />
  </Theme>
);
export default Option;
