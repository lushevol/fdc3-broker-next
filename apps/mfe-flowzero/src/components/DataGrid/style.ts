import { css, styled } from "@mui/material/styles";

export const classes = {
  mainBlotter: "main-blotter-data-grid",
  commonGrid: "common-data-grid",
  baseGrid: "base-data-grid",
  baseGridHeight: "base-data-grid-height",
  viewComment: "validation_view_comment",
  removeMinHeight: "remove-min-height",
  commentGrid: "comments-grid",
};

const rowBorder = "1px solid var(--theme-color-ag-row-border)";
const rowBorderRadius = "10px";
const defaultFontSize = "11px";
const defaultFontFamily = '"Poppins",Helvetica!important';

const Root = styled("div")(
  ({ theme }) => css`
    height: 100%;
    &.ag-grid-flowzero {
      .ag-icon-filter,
      .ag-icon-menu-alt {
        color: ${theme.palette.mode === "dark" ? "#818181" : "#8D8D8D"};
        &:hover {
          color: var(--ag-alpine-active-color);
        }
      }
      .ag-theme-alpine,
      .ag-theme-alpine-dark {
        --ag-font-size: ${defaultFontSize};
        --ag-font-family: ${defaultFontFamily};
        --ag-icon-font-color: ${theme.palette.mode === "dark"
          ? "#fff"
          : "#8D8D8D"};

        &.${classes.mainBlotter} {
          --ag-borders: none;
          --ag-header-background-color: transparent;
          --ag-background-color: transparent;
          --ag-column-hover-color: transparent;
          --ag-header-foreground-color: ${theme.palette.mode === "dark"
            ? "#818181"
            : "#8D8D8D"};
          --ag-line-height: 34px;
          --ag-card-radius: ${rowBorderRadius};
          --ag-border-color: #68686e66;
          --theme-color-ag-row: ${theme.palette.mode === "dark"
            ? "#171d24"
            : "#F7F9FD"};
          .ag-row {
            background-color: var(--theme-color-ag-row);
          }
          .ag-row-odd {
            background-color: var(--theme-color-ag-row-odd);
          }
          .ag-menu-list {
            background-color: var(--theme-color-ag-control-panel-bg);
          }
          // header
          .ag-header-cell {
            .ag-cell-label-container {
              padding: 10px 0;
              .ag-header-cell-label:has(
                  .ag-sort-indicator-icon:not(.ag-hidden),
                  .ag-filter-icon:not(.ag-hidden),
                  .ag-sort-ascending-icon:not(.ag-hidden),
                  .ag-sort-descending-icon:not(.ag-hidden)
                ) {
                background-color: #9a9a9a;
                padding: 0 10px;
                border-radius: 4px;
                .ag-header-cell-text {
                  color: ${theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300]};
                }
              }
            }

            // resize line
            .ag-header-cell-resize {
              visibility: hidden;
              opacity: 0;
              transition: visibility 1s 2s, opacity 1s 2s;
            }
            &:hover {
              .ag-header-cell-resize {
                visibility: visible;
                opacity: 1;
                transition: visibility 0s 0s, opacity 0s 0s;
              }
            }
          }
          .ag-body-horizontal-scroll-viewport {
            &:hover::-webkit-scrollbar {
              height: 9px;
              max-height: 9px;
              min-height: 9px;
            }
            height: 9px !important;
            max-height: 9px !important;
            min-height: 9px !important;
            bottom: 7px;
          }
          .ag-body-viewport {
            // row
            .ag-row {
              height: 36px !important;
              border-top: ${rowBorder};
              border-bottom: ${rowBorder};
            }
            // left pinned row
            .ag-pinned-left-cols-container .ag-row {
              border: none;
              background-color: transparent;
              // strip bg color
              &::before {
                background-color: transparent;
              }
              // checkbox selected hover
              &.ag-row-hover.ag-row-selected::before {
                background-image: none;
              }
              .ag-cell {
                // checkbox cell
                background-color: var(--theme-color-ag-row);
                &:first-child:not(.ag-cell-value) {
                  // hide highlight border when trigger select.
                  background-color: transparent;
                  border: none;
                  // rest left pinned cols next to checkbox
                  & + .ag-cell-value {
                    border-left: ${rowBorder};
                    border-top-left-radius: ${rowBorderRadius};
                    border-bottom-left-radius: ${rowBorderRadius};
                  }
                }
                // rest left pinned cols
                &.ag-cell-value {
                  border-top: ${rowBorder};
                  border-bottom: ${rowBorder};
                  // if no checkbox at first col
                  &:first-child {
                    border-left: ${rowBorder};
                    border-top-left-radius: ${rowBorderRadius};
                    border-bottom-left-radius: ${rowBorderRadius};
                  }
                  &:last-child {
                    border-right: 1px solid var(--theme-color-ag-row);
                  }
                }
              }
              &.ag-row-hover {
                .ag-cell {
                  &::before {
                    content: "";
                    background-color: var(--ag-row-hover-color);
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                  }
                  &:first-child:not(.ag-cell-value) {
                    &::before {
                      display: none;
                    }
                  }
                }
              }
              &.ag-row-selected {
                .ag-cell {
                  &::before {
                    background-color: var(--ag-selected-row-background-color);
                    content: "";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                  }
                  &:first-child:not(.ag-cell-value) {
                    ::before {
                      display: none;
                    }
                  }
                }

                &.ag-row-hover {
                  .ag-cell {
                    &::before {
                      background-color: var(
                        --theme-color-ag-row-selected-hover
                      );
                    }
                    &:first-child:not(.ag-cell-value) {
                      background-color: transparent;
                      &::before {
                        background-color: transparent;
                      }
                    }
                  }
                }
              }
            }
            .ag-pinned-left-cols-container .ag-row-odd {
              .ag-cell {
                background-color: var(--theme-color-ag-row-odd);
                &:first-child:not(.ag-cell-value) {
                  background-color: transparent;
                }
                &.ag-cell-value {
                  &:last-child {
                    border-right: 1px solid var(--theme-color-ag-row-odd);
                  }
                }
              }
            }
            // center row
            .ag-center-cols-container .ag-row {
              border-left: ${rowBorder};
              border-right: ${rowBorder};
              border-radius: ${rowBorderRadius};
              &::before {
                border-radius: ${rowBorderRadius};
              }
              border-color: var(--theme-color-ag-row-border);
            }
            // if has left pinned and it's not hide and it's not checkbox
            &:has(
                .ag-pinned-left-cols-container:not(.ag-hidden):has(
                    .ag-cell-value
                  )
              ) {
              // center row
              .ag-center-cols-container .ag-row {
                border-left: none;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                &::before {
                  border-top-left-radius: 0;
                  border-bottom-left-radius: 0;
                }
              }
            }
            // if has right pinned
            &:has(.ag-pinned-right-cols-container:not(.ag-hidden)) {
              // center row
              .ag-center-cols-container .ag-row {
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                &::before {
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                }
                border-color: var(--theme-color-ag-row-border);
              }
            }
            // right pinned row
            .ag-pinned-right-cols-container .ag-row {
              border-right: ${rowBorder};
              border-radius: 0 ${rowBorderRadius} ${rowBorderRadius} 0;
              &::before {
                border-radius: 0 ${rowBorderRadius} ${rowBorderRadius} 0;
              }
              border-color: var(--theme-color-ag-row-border);
              border-left: 3px solid;
              border-left-color: var(--theme-color-ag-pinned-border);
            }
          }
          .ag-checkbox-input-wrapper {
            &::after {
              color: var(--theme-color-ag-checkbox-unchecked);
            }
          }
          .ag-checkbox-input-wrapper.ag-checked {
            &::after {
              color: var(--theme-color-ag-checkbox-checked);
            }
          }
        }
        .ag-root-wrapper {
          min-height: 150px;
          height: 100%;
        }
        &.${classes.commonGrid} {
          .ag-root-wrapper {
            min-height: 250px;
          }
        }
        &.${classes.baseGrid} {
          --ag-background-color: transparent;
          --ag-header-background-color: var(--theme-color-ag-header-bg);
          .ag-row {
            background-color: var(--theme-color-ag-row);
          }
          .ag-row-odd {
            background-color: var(--theme-color-ag-row-odd);
          }
          .ag-checkbox-input-wrapper {
            &::after {
              color: var(--theme-color-ag-checkbox-unchecked);
            }
          }
          .ag-checkbox-input-wrapper.ag-checked {
            &::after {
              color: var(--theme-color-ag-checkbox-checked);
            }
          }
          .ag-body-horizontal-scroll-viewport {
            &:hover::-webkit-scrollbar {
              height: 9px;
              max-height: 9px;
              min-height: 9px;
            }
            height: 9px !important;
            max-height: 9px !important;
            min-height: 9px !important;
            bottom: 7px;
          }
        }
        &.${classes.baseGridHeight} {
          height: 100%;
        }
        &.${classes.commentGrid} {
          .ag-root-wrapper {
            min-height: 150px;
          }
        }
      }
    }

    .${classes.viewComment} {
      margin-bottom: 3.3px;
    }
    .${classes.removeMinHeight} {
      .ag-root-wrapper {
        min-height: auto;
      }
    }
  `
);

export default Root;
