import { styled } from "@mui/material/styles";
import MuiSwitch from "@mui/material/Switch";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_switch`;
export const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  switch: `${PREFIX}-switch`,
  label: `${PREFIX}-label`,
};

const Root = styled("section")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    height: "49px",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${classes.icon}`]: {
    backgroundColor: theme.theme["SwitchComponent"]["backgroundColor"],
    color: theme.theme["SwitchComponent"]["color"],
    borderRadius: "50%",
    marginRight: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30px",
    width: "30px",
  },
  [`& .${classes.switch}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${classes.label}`]: {
    textTransform: "capitalize",
    fontSize: "0.625rem",
    marginBottom: "0.25rem",
    fontWeight: 500,
    height: "15px",
  },
  [`&.switch-theme-wrapper`]: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    marginLeft: "24px",
    height: "unset",
  },
  [`&.switch-theme-wrapper .${classes.label}`]: {
    lineHeight: "1.4375em",
    marginBottom: "4px",
    display: "inline-block",
    height: "13px",
  },
  [`.dark &.switch-theme-wrapper .${classes.label}`]: {
    color: "#1A1A1A",
  },
  [`.light &.switch-theme-wrapper .${classes.label}`]: {
    color: "#E5E5E5",
  },
  [`&.switch-theme-wrapper .${classes.icon}`]: {
    backgroundColor: "unset",
    borderRadius: "50%",
    padding: "8px",
    width: "36px",
    height: "36px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0 !important",
  },
  [`.light &.switch-theme-wrapper .${classes.icon}`]: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  [`.dark &.switch-theme-wrapper .${classes.icon}`]: {
    backgroundColor: "rgba(26, 26, 26, 0.2)",
  },
  [`&.switch-theme-wrapper .${classes.switch} > div`]: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const SwitchStyled = styled(MuiSwitch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  border: "1px solid transparent",
  borderRadius: 8,
  display: "flex",
  ...theme.theme["SwitchComponent"]["MuiSwitch"],
  "&.custom-switch .MuiSwitch-switchBase": {
    color: "#b5bdc8",
  },
  "&.custom-switch .MuiSwitch-thumb": {
    background: "#999999",
  },
  "&.custom-switch .MuiSwitch-track": {
    background: "#262626 !important",
    border: "1px solid #737373 !important",
    opacity: 1,
  },
  "&.custom-switch .MuiSwitch-switchBase.Mui-checked": {
    color: "#ffffff",
    transform: "translateX(12px)",
  },
  "&.custom-switch .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    background: "#2f80ed !important",
    border: "1px solid #2f80ed !important",
    opacity: 1,
  },
  "&.custom-switch .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    background: "#ffffff",
  },
  "&.custom-switch .MuiSwitch-switchBase:hover .MuiSwitch-thumb": {
    background: "#4F9DF0",
  },
  "&.custom-switch .MuiSwitch-switchBase:hover + .MuiSwitch-track": {
    background: "#333333 !important",
    border: "1px solid #4F9DF0 !important",
  },
  "&.custom-switch .MuiSwitch-switchBase.Mui-checked:hover + .MuiSwitch-track":
    {
      background: "#4F9DF0 !important",
    },
  "&.custom-switch .MuiSwitch-switchBase.Mui-checked:hover .MuiSwitch-thumb": {
    background: "#ffffff",
  },
}));

export default Root;
