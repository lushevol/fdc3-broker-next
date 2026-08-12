import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_multi_exceptions`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(
  css`
    margin-bottom: 10px;
  `
);

export default Root;
