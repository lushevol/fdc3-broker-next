import { AG_TABLE } from "src/theme";

export const createAgGridStyles = (containerClass: string) => `
  .${containerClass} {
    .ag-grid-flowzero {
      height: 100%;
      .ag-theme-alpine,
      .ag-theme-alpine-dark {
        --ag-grid-size: 8px;
      }
      .ag-root-wrapper {
        border-radius: 20px;
        border: none;
        .ag-select-list {
          .dark & {
            color: ${AG_TABLE.headerDarkTextColor};
            background: ${AG_TABLE.pagePanelDarkBg}!important;
          }
        }
      }
      .ag-center-cols-viewport,
        .ag-center-cols-container {
          min-height: 56px !important;
        }
  
        .ag-root-wrapper {
          background: transparent !important;
        }

        .ag-pinned-right-header {
          border: none !important;
        }
          
        .ag-header {
          border: none;
          margin-bottom: 4px;
          background: #f2f2f2;
          .dark & {
            background: ${AG_TABLE.headerDarkBg};
          }
          .ag-header-cell {
            .dark & {
              color: ${AG_TABLE.headerDarkTextColor};
            }
  
            font-size: 14px;
            .ag-header-cell-resize {
              display: none;
            }
  
            &.no-border-header {
              border-left: none !important;
              border-right: none !important;
            }
          }
        }
  
        .ag-row {
          border: none;
          background: transparent !important;
          padding-bottom: 4px !important;
        }

        .ag-row.ag-row-hover,
        .ag-row.ag-row-selected {
          background: transparent !important;
        }

        .ag-row.ag-row-selected::before,
        .ag-row.ag-row-hover.ag-row-selected::before {
          display: none !important;
        }

        .ag-row.ag-row-hover .ag-cell {
          background: rgba(4, 115, 234, 0.06) !important;
        }

        .ag-checkbox-input-wrapper {
          width: 16px !important;
          height: 16px !important;
          border-radius: 4px !important;
          border: 1px solid #d9d9d9 !important;
          background: #ffffff !important;
          box-shadow: none !important;
          overflow: hidden;
          &::after {
            display: none !important;
          }
          &.ag-checked {
            border-color: #1677ff !important;
            background: #1677ff !important;
            &::after {
              display: block !important;
              content: '' !important;
              position: absolute !important;
              left: 4px !important;
              top: 1px !important;
              width: 5px !important;
              height: 9px !important;
              border: 2px solid #fff !important;
              border-top: none !important;
              border-left: none !important;
              transform: rotate(45deg) !important;
            }
          }
          input {
            opacity: 0 !important;
            width: 100% !important;
            height: 100% !important;
            cursor: pointer !important;
          }
        }

        .ag-row.ag-row-even .ag-cell {
          background: #ffffff !important;
          .dark & {
            color: ${AG_TABLE.rowDarkTextColor}!important;
            background: ${AG_TABLE.rowOddDarkBg}!important;
          }
        }
        
        .ag-row.ag-row-odd .ag-cell {
          background: #f9f9f9 !important;
          .dark & {
            color: ${AG_TABLE.rowDarkTextColor}!important;
            background: ${AG_TABLE.rowEvenDarkBg}!important;
          }
        }
        
        .ag-row.ag-row-last {
          padding-bottom: 0;
        }
        
        .ag-row.ag-row-last .ag-cell {
          margin-bottom: 0;
        }
        
        .ag-cell {
          height: 56px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          text-align: left;
          font-size: 14px;
        }
          .ag-cell,
          .ag-cell * {
            user-select: text;
          } 
        
        .ag-horizontal-right-spacer {
          background: transparent !important;
          border: none !important;
        }
        
        .ag-paging-panel {
          height: 64px;
          border: none;
          border-radius: 0 0 20px 20px;
          background-color: #fff;

          .dark & {
            color: ${AG_TABLE.pagePanelDarkTextColor}!important;
            background: ${AG_TABLE.pagePanelDarkBg};
          }

          .ag-icon {
            .dark & {
              color: ${AG_TABLE.pagePanelDarkTextColor}!important;
            }
          }

          .ag-wrapper {
            .dark & {
              background: ${AG_TABLE.pagePanelDarkBg}!important;
            }
          }
            
          .ag-cell-wrapper {
            line-height: 38px;
          }
          
          .dataType-cell .flowzero-iconfont::before {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
`;

export const coverStyle = {
  position: "absolute" as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
};
