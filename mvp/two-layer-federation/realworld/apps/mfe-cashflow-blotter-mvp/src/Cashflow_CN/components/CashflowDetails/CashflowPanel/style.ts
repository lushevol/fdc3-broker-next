import { Card } from "@mui/material";
import { css, styled } from "@mui/material/styles";

import { SPACE } from "../MultiExceptions/components/Layout/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_CashflowPanel`;
export const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  payment: `${PREFIX}-payment`,
  valueDate: `${PREFIX}-value-date`,
  affirmed: `${PREFIX}-affirmed`,
};

const Root = styled(Card)(
  ({ theme }) =>
    () =>
      css`
        background-color: ${theme.palette.mode === "dark"
          ? "#1A2027"
          : "#F7F9FD"};
        .MuiCardContent-root {
          padding-top: ${SPACE};
          padding-bottom: ${SPACE} !important;
          .ant-descriptions-header {
            margin-bottom: 9px;
          }
          .${classes.title} {
            margin: 0;
          }
          .${classes.payment} {
            .key-data-show-span {
              &.receive {
                color: var(--theme-status-color-status);
              }
              &.pay {
                color: var(--theme-status-color-red);
              }
            }
            .key-data-show-color {
              color: var(--theme-color-dialog-key-data);
            }
            .key-data-show-amount {
              color: var(--theme-color-dialog-key-data);
            }
          }
          .${classes.valueDate} {
            display: flex;
          }
          .${classes.affirmed} {
            margin-left: 10px;
            color: var(--theme-status-color-status);
            border: 1px solid;
            padding: 4px 8px 4px 8px;
            &.not {
              color: var(--theme-status-color-red);
            }
          }
        }
      `
);

export default Root;
