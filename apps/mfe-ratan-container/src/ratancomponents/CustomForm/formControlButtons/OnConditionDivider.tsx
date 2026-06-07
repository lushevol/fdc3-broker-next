import { Divider } from "antd";
const OnConditionDivider = ({ onReject, enableReset, editable, onSubmit }) => {
  return (
    (onReject || (enableReset && editable) || onSubmit) && (
      <Divider className="custom-form-line bottom" />
    )
  );
};
export default OnConditionDivider;
