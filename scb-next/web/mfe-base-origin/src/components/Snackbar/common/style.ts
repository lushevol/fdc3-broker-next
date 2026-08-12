import { styled } from "@mui/material/styles";
import MuiSnackbar from "@mui/material/Snackbar";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_snackbar`;

const Snackbar = styled(MuiSnackbar)(({ theme }) => ({
  borderRadius: "6px",
  backgroundColor: theme.palette.background.paper,
}));

export default Snackbar;
