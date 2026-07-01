import Button from "@mui/material/Button";
import { buttonAttribute } from "./ButtonUtils";
const OnSubmitButton = ({ onSubmit, enable, onFinishFailed, onFinish }) => {
  const buttonAttributeProps = buttonAttribute(enable, onFinish);
  return (
    onSubmit && (
      <Button
        className="custom-submit-btn"
        data-testid="custom-form-submit-btn"
        disabled={enable.rejecting || enable.ruleError}
        loading={enable.submiting}
        onMouseDown={onFinishFailed}
        {...buttonAttributeProps}
      >
        Submit
      </Button>
    )
  );
};
export default OnSubmitButton;
