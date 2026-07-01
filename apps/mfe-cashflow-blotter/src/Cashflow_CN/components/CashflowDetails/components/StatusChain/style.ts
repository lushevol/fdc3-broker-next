import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_status-chain`;
export const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  operator: `${PREFIX}-operator`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        flex-direction: row;
        .${classes.item} {
          display: flex;
          align-items: center;
          .${classes.operator} {
            padding: 0 5px;
            display: flex;
          }
          &:last-child {
            .${classes.operator} {
              display: none;
            }
          }
        }
      `
);

export default Root;
