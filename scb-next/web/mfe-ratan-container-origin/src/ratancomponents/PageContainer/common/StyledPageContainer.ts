import { styled, css } from "@mui/material";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_page_container`;
export const classes = {
  header: `${PREFIX}_header`,
  page: `${PREFIX}_page`,
  headerItem: `${PREFIX}_header_item`,
};
const StyledPageContainer = styled("section")(
  css`
    display: initial;
    .${classes.header} {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .${classes.headerItem} {
      display: flex;
      padding-right: 10px;
    }
    .${classes.page} {
      height: calc(100% - 30px);
      overflow: auto;
    }
  `
);
export default StyledPageContainer;
