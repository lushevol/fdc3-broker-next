import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_App`;
export const classes = {
  ratanCashflow: `${PREFIX}-ratan-cashflow`,
  searchSection: `${PREFIX}-search-section`,
  searchSectionHeader: `${PREFIX}-search-section-header`,
  searchSectionBody: `${PREFIX}-search-section-body`,
  hide: `${PREFIX}-hide`,
  visible: `${PREFIX}-visible`,
  highlight: `${PREFIX}-search-section-header-highlight`,
  box: `${PREFIX}-search-section-body-box`,
  border: `${PREFIX}-search-section-body-border`,
  label: `${PREFIX}-search-section-body-label`,
  customFilterView: `${process.env.MFE_APP_PREFIX_STYLE}_CustomSearchView-selector`,
  filterCreateOrModifyBtn: "MicroWebUI_ratan_container_filter_selector-view-btn",
  viewCreateOrModifyBtn: "MicroWebUI_ratan_container_view_selector-view-btn",
};

export const BreakPoint = {
  Monitor: 1921,
  Middle: 1550,
  Laptop: 1281,
};

const Root = styled("div")(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        min-height: calc(100vh - 120px);
        padding-top: 8px;
        .${classes.searchSection} {
          display: flex;
          flex-direction: column;
          transition: ${theme.transitions.create(["height", "display"], {
            duration: theme.transitions.duration.enteringScreen,
          })};
          &.hide {
            height: 0;
            display: none;
          }
          .${classes.searchSectionHeader} {
            height: 32px;
            width: 100%;
            padding: 8px 10px 0 10px;
            display: flex;
            justify-content: end;
            .${classes.highlight} {
              color: ${theme.palette.warning.main};
            }
          }
          .${classes.searchSectionBody} {
            width: 100%;
            flex: 1;
            .${classes.hide} {
              display: none;
            }
            .${classes.visible} {
              width: 100%;
              min-height: 190px;
              display: flex;
              justify-content: center;
            }
            // rollback
            .${classes.box} {
              padding: 16px 10px 16px 8px;
              margin-top: -16px;
              display: flex;
              flex-direction: column;
              .${classes.border} {
                border: 1px solid var(--theme-color-border-color);
                border-radius: 5px;
                padding-bottom: 8px;
                display: flex;
                justify-content: start;
                overflow: hidden;
                flex-direction: column;
                flex: 1;
                /* min-height: 268px; */
                .${classes.label} {
                  font-weight: 600;
                  margin-bottom: 8px;
                  padding: 5px 10px;
                  background-color: var(--theme-color-panel-header);
                }
                .${classes.customFilterView} {
                  .${classes.filterCreateOrModifyBtn},.${classes.viewCreateOrModifyBtn} {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                  }
                }
              }
            }
          }
        }
      `
);

export default Root;
