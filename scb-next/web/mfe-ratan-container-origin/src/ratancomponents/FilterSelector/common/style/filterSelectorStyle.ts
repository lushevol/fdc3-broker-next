import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_filter_selector`;
export const classes = {
  filterSelector: `${PREFIX}-filter-selector`,
  selector: `${PREFIX}-selector`,
  viewClearBtn: `${PREFIX}-clear-btn`,
  viewBtn: `${PREFIX}-view-btn`,
  clearBtn: `${PREFIX}-clear-btn`,
};

const Root = styled("div")(
  css`
    margin-bottom: 5px;
    width: 100%;
    .${classes.filterSelector} {
      width: 100%;
      .field-label {
        flex: 1;
      }
      & .${classes.selector} {
        flex: 1;
        width: 200px;
        color: rgb(114, 243, 131);
      }
      & .${classes.viewBtn} {
        margin-left: 10px;
        min-width: 116px;
        max-width: 116px;
        span {
          width: 5px !important;
        }
      }
      & .${classes.viewClearBtn} {
        margin-left: 10px;
        min-width: 64px;
        max-width: 64px;
      }
    }
  `
);

export default Root;
