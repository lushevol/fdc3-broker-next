import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_settlement_method_update_table`;
export const classes = {
  updateDataGrid: `${PREFIX}-update-data-grid`,
};
const StyledRoot = styled("div")(
  () => () =>
    css`
      .${classes.updateDataGrid} {
        height: fit-content;
      }
      .ag-grid-ratan {
        > div {
          height: unset;
        }
        .ag-theme-alpine,
        .ag-theme-alpine-dark {
          .ag-layout-auto-height .ag-center-cols-viewport {
            min-height: unset;
            .ag-center-cols-container {
              min-height: unset;
            }
          }
        }
      }
    `
);

export default StyledRoot;
