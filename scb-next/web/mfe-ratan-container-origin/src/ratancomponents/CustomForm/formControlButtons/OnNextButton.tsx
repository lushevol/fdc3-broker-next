import Button from "@mui/material/Button";
import { buttonAttribute } from "./ButtonUtils";
const OnNextButton = ({ onNext, enable, onFinishFailed, onFinish }) => {
  const buttonAttributeProps = buttonAttribute(enable, onFinish);
  return (
    onNext && (
      <Button
        className="custom-next-btn"
        {...buttonAttributeProps}
        onMouseDown={onFinishFailed}
      >
        Next
      </Button>
    )
  );
};
export default OnNextButton;
