import { css, styled } from "@mui/material";
import { MuiDialog } from "Import/ratancomponents";

const PREFIX = "cashflow-blotter-bulk-fix-exceptions";
export const classes = {
  body: `${PREFIX}-body`,
  eligibleTable: `${PREFIX}-eligible-table`,
  insufficientTable: `${PREFIX}-insufficient-table`,
  extraForm: `${PREFIX}-extra-form`,
  bottom: `${PREFIX}-bottom`,
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
        display: flex;
        flex-direction: column;
      }
      .${classes.insufficientTable} {
      }
      .${classes.extraForm} {
      }
    }
    .${classes.bottom} {
      padding: 10px;
      .${classes.btnsWrap} {
        display: flex;
        margin-left: 10px;
      }
    }
  `
);
