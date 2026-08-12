import { css, styled } from "@mui/material/styles";
import { MuiPortalDialog } from "Import/ratancomponents";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_split-look-up-ssi-comp`;

const StyledMuiDialog = styled(MuiPortalDialog)(
  () => css`
    .MuiDialogContent-root {
      background: var(--theme-color-modal-header);
    }
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

    .split-lookup-vostro-section {
      .ant-form-item-control-input-content {
        .ant-select,
        .ant-picker {
          width: 100%;
        }
      }
    }
  `
);

export default StyledMuiDialog;
