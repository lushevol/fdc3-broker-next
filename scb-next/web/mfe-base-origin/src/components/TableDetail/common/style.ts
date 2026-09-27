import { styled } from "ratan-design-origin/theme";
import Dialog from "../../Dialog";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_table_detail`;
export const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  center: `${PREFIX}-center`,
};

const Root = styled(Dialog)(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`& .${classes.content}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    "& .MuiFormControl-root": {
      marginBottom: "8px",
    },
  },
  [`& .${classes.center}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  "& .MuiDialogTitle-root": {
    textTransform: "capitalize",
  },
  "& .MuiInputBase-root": {
    width: "600px",
  },
  "& .MuiButton-root": {
    minWidth: "108px",
  },
  "& .MuiMenuItem-root": {
    textTransform: "none",
  },
}));

export default Root;
