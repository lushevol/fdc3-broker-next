import Button, { ButtonProps } from "@mui/material/Button";
import { styled, lighten } from "@mui/material/styles";

export interface SearchButtonProps extends ButtonProps {}

const ResetButton = styled(Button)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    backgroundColor: theme.palette.mode === "dark" ? "#29313A" : "#ededed",
    minWidth: "108px",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#1A2028",
  },
  "&.MuiButton-sizeSmall": {
    fontSize: "12px",
  },
  "&.Mui-disabled": {
    opacity: 0.5,
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? lighten("#29313A", 0.05)
        : lighten("#ededed", 0.05),
  },
}));
export default ResetButton;
