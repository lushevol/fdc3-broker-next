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
      .${classes.block} {
        &:first-child {
          height: 300px;
        }
        &:last-child {
          flex: 1;
          .${classes.datagrid} {
            height: 100%;
          }
        }
        .${classes.subtitle} {
        }
      }
    `
);

export default Root;
