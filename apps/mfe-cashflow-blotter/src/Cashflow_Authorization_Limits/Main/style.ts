import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_App`;
export const classes = {
  header: `${PREFIX}-header`,
  body: `${PREFIX}-body`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        height: calc(100vh - 155px);
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        .${classes.header} {
          height: 30px;
        }
        .${classes.body} {
          flex: 1;
        }
      `
);

export default Root;
