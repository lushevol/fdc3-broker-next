import { css, styled } from "@mui/material/styles";
import Sider from "antd/es/layout/Sider";

const COLOR_PRIMARY = "#0250a3";
const COLOR_WHITE = "#fff";
const COLOR_HOVER_BG = "#9ac7f6";
const COLOR_SELECTED_BG = "#81b9f4";
const COLOR_DARK_HOVER_BG = "#012e5d";
const COLOR_DARK_SELECTED_BG = "#023975";
const COLOR_DARK_TEXT = "#e5f1fc";
const COLOR_DARK_ICON = "#cccccc";

const StyledSider = styled(Sider)(
  css`
    position: relative;
    border-right-width: 1px;
    border-right-style: solid;
    box-shadow: 4px 0px 10px 0px rgba(0, 0, 0, 0.1);
    .dark & {
      border-right-color: #121e25;
    }

    .ant-menu {
      padding: 16px;

      .ant-menu-item-group-title {
        height: 16px;
        line-height: 16px;
        margin-bottom: 12px;
        padding-left: 12px;
        display: flex;
        align-items: center;
      }

      &.ant-menu-inline-collapsed {
        padding: 16px 0;

        .ant-menu-item-group-title {
          display: none;
        }

        .ant-menu-title-content {
          display: none !important;
        }

        .ant-menu-item-icon {
          margin-inline-end: 0 !important;
        }

        .ant-menu-item {
          width: 40px !important;
          height: 32px !important;
          margin: 0 auto 8px !important;
          padding-inline: 0 !important;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ant-menu-submenu-title {
          width: 40px !important;
          height: 32px !important;
          margin: 0 auto 8px !important;
          padding-inline: 0 !important;
          border-radius: 6px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          .ant-menu-submenu-expand-icon {
            display: none !important;
          }
        }
      }

      &:not(.ant-menu-inline-collapsed) {
        .ant-menu-item {
          width: 100%;
          height: 32px;
          margin: 0;
          padding-left: 12px !important;
          padding-right: 0 !important;

          .ant-menu-title-content {
            height: 32px;
            line-height: 32px;
            margin-left: 8px;
          }

          &:not(:last-child) {
            margin-bottom: 8px;
          }
        }

        .ant-menu-submenu-title {
          width: 100%;
          height: 32px;
          margin: 0 0 8px 0;
          padding-left: 12px !important;
          padding-right: 0 !important;
        }

        .ant-menu-sub.ant-menu-inline .ant-menu-item {
          padding-left: 8px !important;
          margin: 0 0 8px 0 !important;
        }
      }
    }

    .ant-menu-item-group + .ant-menu-item-group {
      margin-top: 32px;
    }

    .ant-menu-item:hover {
      background: #b3d5f8 !important;
      .dark & {
        background: ${COLOR_DARK_HOVER_BG} !important;
      }

      .ant-menu-title-content,
      .flowzero-iconfont {
        color: ${COLOR_PRIMARY};
        .dark & {
          color: ${COLOR_DARK_TEXT};
        }
      }

      .task-count-badge {
        background: #4f9df0;
        color: ${COLOR_WHITE};
      }
    }

    .ant-menu-item:has(.selected) {
      background: ${COLOR_HOVER_BG} !important;
      color: ${COLOR_PRIMARY} !important;
      .dark & {
        background: ${COLOR_DARK_SELECTED_BG} !important;
      }

      .ant-menu-title-content {
        color: ${COLOR_PRIMARY} !important;
        .dark & {
          color: ${COLOR_DARK_TEXT} !important;
        }
      }
    }

    .ant-menu-item-selected .task-count-badge {
      background: ${COLOR_PRIMARY};
      color: ${COLOR_WHITE};
    }

    .ant-menu-submenu-title {
      .flowzero-iconfont {
        color: #333333;
        .dark & {
          color: ${COLOR_DARK_ICON} !important;
        }
      }

      .ant-menu-title-content span {
        .dark & {
          color: ${COLOR_DARK_ICON} !important;
        }
      }

      &:has(.submenu-selected) {
        background: ${COLOR_SELECTED_BG} !important;
        color: ${COLOR_PRIMARY} !important;
        .dark & {
          background: ${COLOR_DARK_SELECTED_BG} !important;
        }

        .ant-menu-title-content span,
        .flowzero-iconfont {
          color: ${COLOR_PRIMARY} !important;
          .dark & {
            color: ${COLOR_DARK_TEXT} !important;
          }
        }
      }

      &:hover {
        background: ${COLOR_HOVER_BG} !important;
        .dark & {
          background: ${COLOR_DARK_HOVER_BG} !important;
        }

        .flowzero-iconfont,
        .ant-menu-title-content span {
          color: ${COLOR_PRIMARY} !important;
          .dark & {
            color: ${COLOR_DARK_TEXT} !important;
          }
        }
      }
    }

    .ant-menu-sub.ant-menu-inline {
      .ant-menu-item-selected {
        color: ${COLOR_PRIMARY} !important;
        background: ${COLOR_SELECTED_BG} !important;
        .dark & {
          background: ${COLOR_DARK_HOVER_BG} !important;
        }
      }

      .ant-menu-item:hover {
        background: ${COLOR_HOVER_BG};
        .dark & {
          background: ${COLOR_DARK_HOVER_BG};
        }
      }
    }

    .assign-to-me-item {
      &.ant-menu-item-selected {
        background: ${COLOR_SELECTED_BG};
      }

      &:hover {
        background: ${COLOR_HOVER_BG};
      }
    }

    .ant-menu-root.ant-menu-inline {
      border-inline-end: 0;
    }

    .ant-menu-light.ant-menu-root.ant-menu-vertical {
      border-inline-end: 0;
    }

    .ant-menu-inline-collapsed-tooltip {
      .ant-tooltip-inner {
        background: ${COLOR_PRIMARY} !important;
        color: ${COLOR_WHITE} !important;
        font-weight: 500;
        font-size: 14px;
      }
      .ant-tooltip-arrow::before {
        background-color: ${COLOR_PRIMARY} !important;
      }
    }
  `
);

export default StyledSider;
