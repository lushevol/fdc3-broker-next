import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_limitation-data-grid`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        height: 100%;
        .${classes.root} {
          height: 100%;
          padding: 0 10px;
          .ag-paging-panel {
            border-top-color: var(--theme-color-border-color);
          }
        }
      `
);

export default Root;
