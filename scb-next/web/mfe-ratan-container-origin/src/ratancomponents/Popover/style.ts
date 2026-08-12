import { css, styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_public_popover`;
export const classes = {
  detailsDialogHeader: `${PREFIX}-details-dialog-header`,
  tagWrap: `${PREFIX}-tag-wrap`,
  popoverBtn: `${PREFIX}-popover-btn`,
};

export const Root = styled("div")(
  css`
    position: relative;
    display: inline-block;
    max-width: 100%;
    .popover {
      position: relative;
      display: inline-block;
      max-width: 100%;
      .popover-name {
        display: flex;
        padding: 5px 10px 5px 0;
        color: var(--base-color-grey-light);
        font-size: 11px;
        position: relative;
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

      .popover-title {
        position: relative;
        display: flex;
        align-items: center;
        max-width: 100%;
        height: 24px;
        font-size: 13px;
        // border: 1px solid var(--theme-color-modal-header-border);
        .title-value {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .ant-popover-placement-right .ant-popover-arrow,
    .ant-popover-placement-rightTop .ant-popover-arrow,
    .ant-popover-placement-rightBottom .ant-popover-arrow {
      left: 0;
    }
    .ant-popover-placement-top .ant-popover-arrow,
    .ant-popover-placement-topLeft .ant-popover-arrow,
    .ant-popover-placement-topRight .ant-popover-arrow {
      bottom: 0.3px;
    }
    .ant-popover-placement-bottom .ant-popover-arrow,
    .ant-popover-placement-bottomLeft .ant-popover-arrow,
    .ant-popover-placement-bottomRight .ant-popover-arrow {
      top: 0;
    }
    .ant-popover-placement-left .ant-popover-arrow,
    .ant-popover-placement-leftTop .ant-popover-arrow,
    .ant-popover-placement-leftBottom .ant-popover-arrow {
      right: 0;
    }
    .ant-popover-arrow-content {
      width: 11.713709px;
      height: 11.713709px;
      background-color: #39a1cd;
    }
  `
);

export const PublicPopIconBtn = styled(IconButton)(
  css`
    position: relative;
    height: 100%;
    width: 26px;
    background: none;
    font-size: 13px;
    border: none;
    .${classes.popoverBtn} {
      position: relative;
      height: 100%;
      width: 26px;
      background: none;
      font-size: 13px;
      border: none;
      cursor: pointer;
      &:focus {
        outline: none;
        box-shadow: none !important;
      }
    }
  `
);
