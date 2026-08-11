import { Button } from "antd";
const OnRejectButton = ({ onReject, reject, enable }) => {
  return (
    onReject && (
      <Button
        className="custom-reject-btn"
        data-testid="custom-form-reject-btn"
        disabled={enable.submiting}
        loading={enable.rejecting}
        onClick={reject}
      >
        Reject
      </Button>
    )
  );
};
export default OnRejectButton;
