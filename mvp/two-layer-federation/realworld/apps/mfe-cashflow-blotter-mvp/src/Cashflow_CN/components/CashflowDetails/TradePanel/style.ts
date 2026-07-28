import { Card } from "@mui/material";
import { css, styled } from "@mui/material/styles";

import { SPACE } from "../MultiExceptions/components/Layout/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_TradePanel`;
export const classes = {
  root: `${PREFIX}-root`,
  affirmed: `${PREFIX}-affirmed`,
  notAffirmed: `${PREFIX}-affirmed-not`,
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
          .${classes.affirmed} {
            margin-left: 10px;
            color: var(--theme-status-color-status);
            border: 1px solid;
            padding: 4px 8px 4px 8px;
            &-not {
              color: var(--theme-status-color-red);
            }
          }
        }
      `
);

export default Root;
