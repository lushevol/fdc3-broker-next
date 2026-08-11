import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_info_pop`;
export const classes = {
  selector: `${PREFIX}-selector`,
  viewBtn: `${PREFIX}-view-btn`,
  partHeader: `${PREFIX}-part-header`,
};

export const RootStyle = styled("div")(
  ({ theme, className }) =>
    () =>
      css`
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        .trade-status-change-grid,
        .value-change-grid {
          width: 735px;
          .ant-popover-title {
            color: var(--theme-color-modal-header-font);
          }
          .ant-popover-inner-content {
            & > div {
              height: 200px;
            }
            .multiple-grid {
              display: flex;
              flex-direction: column;
              height: 400px;
              & > div {
                flex: 1;
                height: 100%;
              }
            }
          }
          .ant-popover-inner {
            background-color: var(--theme-color-popover-bg);
          }
        }

        .history-grid {
          height: 100%;
          padding: 5px;
          border: 1px solid var(--theme-color-border-color);
          .ag-root-wrapper {
            min-height: 100px;
            border: 1px solid var(--theme-color-border-color);
          }
        }

        .history-detail-footer {
          padding-top: 10px;
        }
      `
);
