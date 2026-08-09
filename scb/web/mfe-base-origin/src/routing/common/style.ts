import { styled } from "@mui/material/styles";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_routing`;
export const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
};

const Root = styled("section")(() => ({
  [`&.${classes.root}`]: {
    margin: 0,
    padding: 0,
  },
  [`& .${classes.header}`]: {},
}));

export default Root;
