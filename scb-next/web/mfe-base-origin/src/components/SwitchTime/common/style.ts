import { styled } from "ratan-design-origin/theme";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_switchTime`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  label: `${PREFIX}-label`,
};

const Root = styled("section")(({ theme }) => ({
  marginLeft: "2.5rem",
  minWidth: "55px",
  [`&.${classes.root}`]: {},
  [`& .${classes.form}`]: {
    marginBottom: 0,
    alignItems: "center",
    width: "60px",
    whiteSpace: "nowrap",
  },
  [`& .${classes.label}`]: {
    fontSize: "0.625rem",
    fontWeight: 500,
    height: "13px",
    color: `${theme.theme["SwitchComponent"]["color"]}!important`,
  },
  "&.switch-time-wrapper": {
    marginLeft: "24px",
    display: "flex",
    alignItems: "center",
  },
  "&.switch-time-wrapper > div": {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
  },
  "&.switch-time-wrapper span.switch-time-icon": {
    borderRadius: "50%",
    padding: "8px",
    width: "36px",
    height: "36px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".light &.switch-time-wrapper span.switch-time-icon": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  ".dark &.switch-time-wrapper span.switch-time-icon": {
    backgroundColor: "rgba(26, 26, 26, 0.2)",
  },
  [`&.switch-time-wrapper .${classes.form}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "0px !important",
  },
  [`.dark &.switch-time-wrapper .${classes.label}`]: {
    color: "#1A1A1A !important",
    marginBottom: "4px",
  },
  [`.light &.switch-time-wrapper .${classes.label}`]: {
    color: "#E5E5E5 !important",
    marginBottom: "4px",
  },
}));

export default Root;
