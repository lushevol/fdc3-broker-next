import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_counterparty_details_v2`;
export const classes = {
  infoPopoverbtn: `${PREFIX}-info-popover-btn`,
  infoContentPop: `${PREFIX}-info-content-pop`,
  selector: `${PREFIX}-selector`,
  viewBtn: `${PREFIX}-view-btn`,
  isPartTwo: `${PREFIX}-is-part-two`,
};

export const RootStyle = styled("div")(
  ({ theme, className }) =>
    () =>
      css`
        * {
          user-select: text !important;
        }

        .counterparty-details-pop {
          min-width: 240px;
          min-height: 100px;
          max-height: 95%;
          .label-details-pop {
            line-height: 0;
            .label-details-pop-name {
              display: flex;
              min-width: 100%;
              padding-top: 5px;
              color: var(--base-color-grey-light);
              font-size: 13px;
              position: absolute;
              &::after {
                content: "";
                flex: 1;
                margin-left: 5px;
                margin-top: 9px;
                display: inline-block;
                height: 1px;
                background: rgba(128, 142, 153, 0.3);
              }
            }
            .label-details-pop-title-main {
              margin: 0;
              font-size: 20px;
              color: var(--theme-color-popover-title);
              width: 330px;
              font-weight: 200;
              line-height: 1.3;
            }

            table {
              position: relative;
              display: inline-block;
              min-width: 100%;

              .label-details-pop-label {
                &:last-child {
                  display: none;
                }
              }
              tr {
                line-height: 1.6;
                font-size: 14px;
                color: var(--theme-color-cashflow-dialog-content);

                td {
                  padding-right: 10px;
                  height: 26px;
                  color: var(--theme-color-cashflow-dialog-content);
                }

                td:nth-child(2) {
                  padding-right: 20px;
                  color: var(--theme-color-dialog-key-data);
                }

                td:nth-child(4) {
                  color: var(--theme-color-dialog-key-data);
                }
              }
            }
          }

          .counterparty-status {
            padding-left: 3px;
            font-size: 13px;
            .counterparty-status-circle {
              display: inline-block;
              width: 10px;
              height: 10px;
              margin-right: 5px;
              background-color: var(--theme-status-color-status);
              border-radius: 5px;
            }
            .red {
              background-color: var(--theme-status-color-red);
            }
          }

          .counterparty-empty-warning {
            text-align: center;
            padding-right: 20px;
            padding-top: 20px;
            font-size: 13px;
            margin-bottom: 20px;
          }

          .ssi-cashflow-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            z-index: 10;
          }
          .loader {
            padding-right: 15px;
          }
        }
        .details-dialog-counterparty-popover,
        .cashflow-counterparty-popover {
          .ant-popover-inner-content {
            position: relative;
            padding-top: 15px;
            padding-bottom: 35px;
            .close-btn {
              position: absolute;
              top: 0;
              right: 0;
              z-index: 2;
              justify-content: end;
            }
          }
        }

        .repair-dialog {
          z-index: 1032;
        }
        .${classes.isPartTwo} {
          padding-left: 20px;
          border-left: 1px solid rgba(128, 142, 153, 0.3);
        }
      `
);
