import { Box, Tabs } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_cashflow_detail_dialog`;
export const classes = {
  //   root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  tabpanel: `${PREFIX}-tab-panel`,
  nodata: `${PREFIX}-no-data`,
  swiftMessage: `${PREFIX}-swift-message`,
  noSwiftMessage: `${PREFIX}-no-swift-message`,
};

const StyledBody = styled(Box)(
  css`
    height: 100%;
    overflow: hidden;
    background-color: var(--theme-color-modal-header);
    .MuiPaper-rounded {
      min-height: unset;
    }
    .${classes.tabpanel} {
      overflow-y: auto;
      height: 100%;
      .trade-detail-history {
        display: flex;
        flex-direction: column;
        height: 100%;
        > div:first-child {
          display: grid;
          flex: 1;
        }
        .history-grid {
          height: 100%;
        }
        .history-detail-footer {
          height: 50px;
          text-align: right;
          padding: 7px 10px;
          background-color: var(--theme-color-modal-header);
          .button {
            background-color: var(--theme-color-btn-exportfile);
            margin-right: 10px;
            height: 25px;
          }
        }
      }
      .${classes.swiftMessage} {
        display: flex;
        flex-wrap: wrap;
        padding-left: 10px;
        padding-top: 5px;
        font-size: 13px;
        margin-top: 0;
      }
      .${classes.noSwiftMessage} {
        text-align: center;
        top: 50%;
        line-height: 100px;
        font-size: 13px;
      }
    }

    .${classes.nodata} {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .fas {
        margin-right: 10px;
        color: var(--theme-status-color-orange);
      }
    }
  `
);

const StyledTabs = styled(Tabs)(css``);

export { StyledBody, StyledTabs };
