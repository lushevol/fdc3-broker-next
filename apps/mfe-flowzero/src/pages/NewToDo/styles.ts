import { css, styled } from "@mui/material/styles";
import { createAgGridStyles } from "src/components/DataGrid";

import { GRID_NAME } from "./constants/index";

export const StyleRoot = styled("div")(
  () => css`
    flex: 1;
    .filter-btn {
      &:hover {
        color: #0367d2 !important;
        .filter-btn-icon,
        .filter-btn-text,
        .filter-close-btn,
        .filter-slash,
        .filter-number {
          color: #0367d2 !important;
        }
        border-color: #4f9df0 !important;
        background-color: #e5f1fc !important;
        .dark & {
          color: #4f9df0 !important;
          .filter-btn-icon,
          .filter-btn-text,
          .filter-close-btn,
          .filter-slash,
          .filter-number {
            color: #4f9df0 !important;
          }
          background-color: #262626 !important;
        }
      }
      &:active {
        background-color: #d4e7f9 !important;
        .dark & {
          background-color: #011a35 !important;
        }
      }
    }
    ${createAgGridStyles(GRID_NAME)}
    .ag-pinned-right-cols-container .ag-cell:first-child,
    .ag-pinned-right-header .ag-header-cell:first-child {
      border-left: none !important;
    }
  `
);
