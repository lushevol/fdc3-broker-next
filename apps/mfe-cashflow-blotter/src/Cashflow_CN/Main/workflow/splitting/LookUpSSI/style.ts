import { css, styled } from "@mui/material/styles";
import { MuiDialog } from "Import/ratancomponents";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_split-look-up-ssi-comp`;

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .component-cashflow-dialog-body {
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      height: 98%;
    }
    .bottom-btn {
      padding: 10px;
      .btn {
        & + .btn {
          margin-left: 10px;
        }
      }
    }
  `
);

export default StyledMuiDialog;
