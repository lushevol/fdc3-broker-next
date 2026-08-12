import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_custom-form-group`;

export const StyleRoot = styled("div")(
  css`
    .custom-form-group {
      display: flex;
      flex-direction: column;

      .custom-form-line {
        margin: 5px 0 20px;
        border-color: var(--theme-color-border-color);

        &:last-child {
          display: none;
        }

        &.bottom {
          margin: 5px 0;
        }
      }

      .form-group-box {
        display: flex;
        flex-direction: column;
        width: 100%;

        .ant-row {
          margin-bottom: 0px;
          margin-right: 0 !important;
          margin-left: 0 !important;
        }

        .form-group-row {
          display: flex;
          width: 100%;
        }

        .form-group-col {
          box-sizing: border-box;
        }

        .form-group-title {
          font-weight: bold;
          color: #333;
        }

        .form-child-group {
          justify-content: flex-start;
          align-items: flex-start;
        }

        .form-child-group.has-title .ant-row:first-of-type {
          margin-top: 8px;
        }

        .form-child-group-title {
          display: flex;
          align-items: center;
          height: 2px;
          box-sizing: border-box;
          margin-top: 2px;
          .form-child-group-title-text {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--theme-color-popover-label);
            white-space: nowrap;
            padding: 0 6px;
            margin-left: 45px;
            background-color: var(--theme-color-modal-header);
            z-index: 1;
          }
        }
        .custom-form-group-line {
          margin: 2px 0;
          border-color: var(--theme-color-border-color);
          font-size: 14px;

          .ant-divider-inner-text {
            color: var(--theme-color-modal-label);
          }

          &:last-child {
            display: none;
          }

          &.bottom {
            margin: 5px 0;
          }
        }

        .form-child-group-line {
          margin: 2px 0;
          font-size: 12px;

          .ant-divider-inner-text {
            color: var(--theme-color-modal-label);
          }
        }

        .custom-form-classify {
          width: 100%;
          text-align: left;
        }
      }

      .ant-form-item {
        width: 50%;
        text-align: left;
        justify-content: flex-end;
        padding-left: 5px;
        padding-right: 5px;
        margin-bottom: 10px;

        &.has-btn {
          .ant-form-item-control {
            padding-right: 50px;
          }
        }
      }

      .custom-form-classify {
        margin-bottom: 5px;
        width: 100%;
        text-align: left;
      }

      .custom-form-body {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 15px;
        overflow-y: auto;
      }

      .custom-form-bottom {
        text-align: right;
      }

      .custom-reset-btn {
        margin: 5px 15px 5px 15px;
        width: 84px;
      }

      .custom-next-btn {
        margin: 5px 15px 5px 15px;
        width: 84px;
        border: 1px solid var(--theme-color-btn-submit-border);
      }

      .custom-pre-btn {
        margin: 5px 15px 5px 15px;
        width: 84px;
      }

      .custom-submit-btn {
        margin: 5px 15px 5px 15px;
        width: 84px;
        border: 1px solid var(--theme-color-btn-submit-border);
      }

      .custom-reject-btn {
        margin: 5px 15px 5px 15px;
        width: 84px;
        border: 1px solid var(--theme-color-btn-reject-border);
      }

      .query-btn {
        margin-left: -50px;
        width: 50px;
      }

      .ant-picker,
      .ant-input-number {
        width: 100%;
      }
    }
  `
);
