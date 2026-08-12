import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_view_selector`;
export const classes = {
  viewSelector: `${PREFIX}-view-selector`,
  selector: `${PREFIX}-selector`,
  viewBtn: `${PREFIX}-view-btn`,
  clearBtn: `${PREFIX}-clear-btn`,
};

const Root = styled("div")(
  css`
    width: 100%;
    .${classes.viewSelector} {
      width: 100%;
      .field-label {
        flex: 1;
      }
      & .${classes.selector} {
        flex: 1;
        width: 160px;
        color: rgb(114, 243, 131);
      }
      & .${classes.viewBtn} {
        margin-left: 10px;
        span {
          width: 5px !important;
        }
      }
    }
  `
);

export default Root;
