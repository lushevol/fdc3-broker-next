import { css, styled } from "@mui/material/styles";

export const StyleRoot = styled("div")(css`
  .custom-field-fun-group {
    display: flex;
    align-items: center;
    .ant-select-selector {
      border-start-start-radius: unset;
      border-end-start-radius: unset;
    }
    .custom-field-fun-main-button {
      height: 32px;
      min-width: 25px;
      border-start-end-radius: unset;
      border-end-end-radius: unset;
      .MuiButton-startIcon {
        margin-right: 0;
      }
    }
  }
`);

export const StylePopRoot = styled("div")(css`
  .custom-field-popover-fun-content {
    display: flex;
    gap: 0.5rem;

    .custom-field-fun-menthod-select {
      width: 150px;
    }
    .custom-field-fun-menthod-input-string {
      width: 150px;
    }
    .custom-field-fun-menthod-input-number {
      width: 150px;
    }
    .custom-field-popover-fun-action {
      .custom-field-fun-button-submit {
        min-width: 30px;
        height: 25px;
        margin-top: 5px;
        margin-bottom: 5px;
        border: 0;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
        .MuiButton-startIcon {
          margin-right: 0;
        }
        .MuiSvgIcon-root {
          color: var(--theme-color-status-buy);
        }
      }

      .custom-field-fun-button-delete {
        min-width: 30px;
        height: 25px;
        margin-top: 5px;
        margin-bottom: 5px;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
        border: 0;
        .MuiButton-startIcon {
          margin-right: 0;
        }
        .MuiSvgIcon-root {
          color: var(--theme-color-cashflow-cutOff-red);
        }
      }
    }
  }
`);
