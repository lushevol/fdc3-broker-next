import { css, styled } from "@mui/material/styles";
import { Popover } from "antd";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_info_pop`;
export const classes = {
  infoPopoverbtn: `${PREFIX}-info-popover-btn`,
  infoContentPop: `${PREFIX}-info-content-pop`,
  selector: `${PREFIX}-selector`,
  viewBtn: `${PREFIX}-view-btn`,
};

export const RootStyle = styled(Popover)(
  ({ theme, className }) =>
    () =>
      css`
        max-height: 400px;
        .${classes.infoContentPop} {
          max-height: 400px;
          table {
            position: relative;
            display: inline-block;
            max-width: 100%;
            z-index: 102;
            padding-right: 5px;
            tr {
              line-height: 1.5;
              font-size: 14px;
              color: var(--theme-color-info-content);
              td {
                padding-right: 10px;
                color: var(--theme-color-info-content);
              }
              td:nth-child(2) {
                color: var(--theme-color-info-content-value);
              }
            }
          }
        }
        ${classes.infoPopoverbtn} {
          position: relative;
          height: 100%;
          width: 6px;
          background: none;
          font-size: 13px;
          border: none;
          color: var(--theme-color-font-color);
          cursor: pointer;
          &:focus {
            outline: none;
          }
          &.disabled {
            opacity: 0.4;
          }
        }
      `
);
