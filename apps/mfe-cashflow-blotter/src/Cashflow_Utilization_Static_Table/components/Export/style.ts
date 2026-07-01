import { css, styled } from "@mui/material/styles";
import { MuiDialog } from "src/Root/import/ratancomponents";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_exportfile`;
export const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  label: `${PREFIX}-label`,
  btn: `${PREFIX}-btn`,
};

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .${classes.root} {
      padding: 30px;
      #export-file-format,
      #export-file-name {
        width: 170px;
      }
      .${classes.item} {
        display: flex;
        justify-content: flex-start;
        // justify-content: space-between;
        align-items: center;
        padding: 0 20px 10px 0;
        text-align: top;
        .${classes.label} {
          display: inline-block;
          padding-right: 10px;
          /* font-size: 11px; */
          width: 120px;
          text-align: right;
          color: var(--theme-color-modal-label);
        }
      }
      .${classes.btn} {
        display: block;
        /* margin: 0 auto; */
        width: 70px;
      }
    }
  `
);

export default StyledMuiDialog;
