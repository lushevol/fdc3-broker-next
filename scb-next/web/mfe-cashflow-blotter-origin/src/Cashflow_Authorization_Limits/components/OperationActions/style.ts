import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_operation-actions`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        .${classes.root} {
          padding-right: 10px;
        }
      `
);

export default Root;
