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
        padding: 5px;
        height: 100%;
        .${classes.partHeader} {
          color: #fff;
          text-align: center;
        }
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
      `
);
