import { css, styled } from "@mui/material";
import { MuiDialog } from "Import/ratancomponents";

const PREFIX = "cashflow-blotter-bulk-fix-exceptions";
export const classes = {
  body: `${PREFIX}-body`,
  eligibleTable: `${PREFIX}-eligible-table`,
  insufficientTable: `${PREFIX}-insufficient-table`,
  extraForm: `${PREFIX}-extra-form`,
  bottom: `${PREFIX}-bottom`,
  statistic: `${PREFIX}-statistic`,
  btnsWrap: `${PREFIX}-btn-wrap`,
  submitBtn: `${PREFIX}-submit-btn`,
};

export const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .${classes.body} {
      height: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      padding-bottom: 5px;
      .${classes.eligibleTable} {
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
      }
      .${classes.insufficientTable} {
      }
      .${classes.extraForm} {
      }
    }
    .${classes.bottom} {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding: 10px 0;
      .${classes.statistic} {
        flex: 1;
        display: flex;
      }
      .${classes.btnsWrap} {
        display: flex;
        gap: 10px;
      }
    }
  `
);
