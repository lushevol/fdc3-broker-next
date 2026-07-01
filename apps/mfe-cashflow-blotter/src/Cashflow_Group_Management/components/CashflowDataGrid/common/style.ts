import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_datagrid`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div")(
  () => () =>
    css`
      flex: 1;
      display: flex;
      > div {
        height: unset;
        flex: 1;
      }
      .${classes.root} {
        height: 100%;
        padding: 0 10px;
      }
    `
);

export default Root;
