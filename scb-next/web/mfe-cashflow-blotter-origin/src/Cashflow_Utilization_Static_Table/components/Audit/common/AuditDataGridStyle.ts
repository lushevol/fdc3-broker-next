import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_audit-data-grid`;
export const classes = {
  gridRoot: `${PREFIX}-grid-root`,
};

const Root = styled("div")(
  css`
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    .${classes.gridRoot} {
      height: 95%;
    }
  `
);

export default Root;
