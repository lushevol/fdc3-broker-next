import { styled } from "@mui/material/styles";
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_DateTimePicker`;
export const classes = {
  left: `${PREFIX}-left`,
};

const Root = styled(MuiDateTimePicker)(({ theme }) => ({
  margin: 0,
  [`&.${classes.left}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& .MuiFormLabel-root": {
      marginRight: theme.spacing(1),
      marginBottom: 0,
    },
  },
  "& .MuiFormControl-root": {
    margin: 0,
  },
  "& .MuiOutlinedInput-root": {
    margin: 0,
  },
  "& .MuiFormLabel-root": {
    position: "static",
    fontSize: "inherit",
    transformOrigin: "center left",
    textOverflow: "inherit",
    overflow: "inherit",
    transform: "none",
    textTransform: "capitalize",
    marginRight: 0,
    marginBottom: theme.spacing(1),
    backgroundColor: "transparent!important",
  },
  "& legend": {
    display: "none",
  },
}));

export default Root;
