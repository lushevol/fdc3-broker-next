import Button from "@mui/material/Button";
const OnPreButton = ({ onPre }) => {
  return (
    onPre && (
      <Button className="custom-pre-btn" onClick={onPre} variant="outlined">
        Previous
      </Button>
    )
  );
};
export default OnPreButton;
