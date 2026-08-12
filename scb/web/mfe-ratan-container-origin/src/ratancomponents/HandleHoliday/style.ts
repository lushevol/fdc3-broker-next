import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_handleholiday`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div")(
  ({ theme }) =>
    () =>
      css`
        .${classes.root} {
          display: flex;
          align-items: center;
          color: var(--theme-color-dialog-key-data);
          &.in-holiday {
            color: #ff6961;
          }
          .loader {
            position: relative;
            top: 2px;
            width: 40px;
          }
        }
      `
);

export default Root;
