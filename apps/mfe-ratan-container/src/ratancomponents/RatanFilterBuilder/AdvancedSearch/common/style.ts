import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_advancedsearch`;
export const classes = {
  root: `${PREFIX}-root`,
  filterList: `${PREFIX}-filter-list`,
  filterListSearch: `${PREFIX}-filter-list-search`,
  filterListSearchInput: `${PREFIX}-filter-list-search-input`,
  filterListContent: `${PREFIX}-filter-list-content`,
  filterListAction: `${PREFIX}-filter-list-action`,
  filterListItem: `${PREFIX}-filter-list-item`,
  filterListItemHighlight: `${PREFIX}-filter-list-item-highlight`,
  filterListItemIcon: `${PREFIX}-filter-list-item-icon`,
  filterBuilder: `${PREFIX}-filter-builder`,
  filterBuilderHeader: `${PREFIX}-filter-builder-header`,
  filterBuilderPublic: `${PREFIX}-filter-builder-public`,
  filterBuilderInfo: `${PREFIX}-filter-builder-info`,
  filterBuilderName: `${PREFIX}-filter-builder-name`,
  filterBuilderNameInput: `${PREFIX}-filter-builder-name-input`,
  filterBuilderBody: `${PREFIX}-filter-builder-body`,
  filterBuilderActions: `${PREFIX}-filter-builder-actions`,
  filterBuilderActionBtn: `${PREFIX}-filter-builder-action-btn`,
  filterBuilderEngine: `${PREFIX}-filter-builder-engine`,
  filterBuilderEngineItem: `${PREFIX}-filter-builder-engine-item`,
  filterBuilderEngineItemCascader: `${PREFIX}-filter-builder-engine-item-cascader`,
  filterBuilderEngineItemOperator: `${PREFIX}-filter-builder-engine-item-operator`,
  filterBuilderEngineItemValue: `${PREFIX}-filter-builder-engine-item-value`,
  filterBuilderEngineItemAction: `${PREFIX}-filter-builder-engine-item-action`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        justify-content: center;
        column-gap: 20px;
        height: 100%;
        padding: 8px 0;
        .${classes.filterList} {
          display: flex;
          flex-direction: column;
          width: 190px;
          height: 100%;
          overflow-y: auto;
          .${classes.filterListSearch} {
            padding: 8px 8px 0px 8px;
            .${classes.filterListSearchInput} {
              width: 100%;
            }
          }
          .${classes.filterListAction} {
            width: 100%;
          }
          .${classes.filterListContent} {
            flex: 1;
            overflow-y: auto;
            ul {
              padding-inline-start: 0;
            }
            .${classes.filterListItem} {
              .${classes.filterListItemHighlight} {
                color: ${theme.palette.warning.main};
              }
              .${classes.filterListItemIcon} {
                min-width: 25px;
                justify-content: flex-end;
              }
            }
          }
        }
        .${classes.filterBuilder} {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 100%;
          .${classes.filterBuilderHeader} {
            margin-bottom: 12px;
            .${classes.filterBuilderName} {
              width: 250px;
              .${classes.filterBuilderNameInput} {
                width: 100%;
              }
            }
            .${classes.filterBuilderPublic} {
              display: flex;
            }
            .${classes.filterBuilderInfo} {
              flex: 1;
              display: flex;
              place-content: flex-end;
            }
          }
          .${classes.filterBuilderBody} {
            width: 100%;
            flex: 1;
            .${classes.filterBuilderEngine} {
              display: flex;
              flex-direction: column;
              .${classes.filterBuilderEngineItem} {
                display: flex;
                margin-bottom: 5px;
                .${classes.filterBuilderEngineItemCascader} {
                  width: 300px;
                  margin-right: 5px;
                }
                .${classes.filterBuilderEngineItemOperator} {
                  margin-right: 5px;
                  width: 120px;
                }
                .${classes.filterBuilderEngineItemValue} {
                  margin-right: 5px;
                  width: 250px;
                }
                .${classes.filterBuilderEngineItemAction} {
                }
              }
            }
          }
          .${classes.filterBuilderActions} {
            .${classes.filterBuilderActionBtn} {
              margin-right: 5px;
            }
          }
        }
      `
);

export default Root;
