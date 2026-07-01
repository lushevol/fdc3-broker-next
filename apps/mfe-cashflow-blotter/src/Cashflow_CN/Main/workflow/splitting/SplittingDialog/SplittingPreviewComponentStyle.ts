import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_net-preview-component`;
export const classes = {
  root: `${PREFIX}-root`,
  subtitle: `${PREFIX}-subtitle`,
  datagrid: `${PREFIX}-datagrid`,
  block: `${PREFIX}-block`,
};

const Root = styled(Box)(
  () => () =>
    css`
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 610px;
      .${classes.block} {
        &:first-child {
          height: 155px;
          .${classes.subtitle} {
            margin-top: 5px;
            font-size: 14px;
          }
          .${classes.datagrid} {
            .ag-root-wrapper {
              min-height: 120px;
            }
            height: 120px;
            padding-top: 5px;
          }
        }
        &:last-child {
          flex: 1;
          height: 340px;
          .${classes.subtitle} {
            margin-top: 10px;
            font-size: 14px;
          }
          .${classes.datagrid} {
            .ag-root-wrapper {
              min-height: 300px;
            }
            height: 100%;
            padding-top: 5px;
          }
        }
      }
    `
);

export default Root;
