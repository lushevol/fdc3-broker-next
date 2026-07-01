import React, { ReactElement } from "react";
import Select from "antd/lib/select";
import Theme from "../Theme";
const OptGroup: React.FC<any> = (props: any): ReactElement => (
  <Theme>
    <Select.OptGroup {...props} />
  </Theme>
);
export default OptGroup;
