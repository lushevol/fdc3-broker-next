import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_toggleVisibleDivider`;
export const classes = {
  hideSearchBar: `${PREFIX}-hide-search-bar`,
  showSearchBar: `${PREFIX}-show-search-bar`,
};

const Root = styled("div")(
  () => () =>
    css`
      .${classes.hideSearchBar}, .${classes.showSearchBar} {
        cursor: pointer;
        font-size: 12px;
        padding-left: 15px;
        padding-right: 15px;
        .fa {
          font-size: 12px;
        }
      }
    `
);

export default Root;
