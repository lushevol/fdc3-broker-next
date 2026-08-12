import { styled } from "@mui/material/styles";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Cashflow_Dashboard`;
export const classes = {
  root: `${PREFIX}-root`,
  section: `${PREFIX}-section`,
};

const Root = styled("section")(() => ({
  height: "100%",
  [`&.${classes.root}`]: {
    width: "100%",
  },
  [`& .${classes.section}`]: {
    width: "100%",
  },
}));

export default Root;
