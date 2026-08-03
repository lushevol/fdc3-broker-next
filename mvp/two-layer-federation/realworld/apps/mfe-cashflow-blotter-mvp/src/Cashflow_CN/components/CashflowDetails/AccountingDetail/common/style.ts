import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_accounting-detail`;
export const classes = {
  root: `${PREFIX}-account-grid`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 70vh;
        min-height: 70vh;
        .${classes.root} {
          flex: 1;
          height: 100%;
          min-height: 70vh;
        }
      `
);

export default Root;
