import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_exception_actions`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(
  css`
    margin-top: 16px;
    padding-right: 10px;
  `
);

export default Root;
