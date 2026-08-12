import Button from "@mui/material/Button";
const OnResetButton = ({ enableReset, editable, enable, onReset }) => {
  return (
    enableReset &&
    editable && (
      <Button
        className="custom-reset-btn"
        disabled={enable.rejecting || enable.submiting || enable.ruleError}
        onClick={onReset}
        variant="outlined"
      >
        Reset
      </Button>
    )
  );
};
export default OnResetButton;
