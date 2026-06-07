import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Cashflow_Dashboard`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div")(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
      `
);

export default Root;
