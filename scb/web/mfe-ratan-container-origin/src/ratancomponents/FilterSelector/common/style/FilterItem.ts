import { css, styled } from "@mui/material/styles";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_filteritem`;
export const classes = {
  root: `${PREFIX}_root`,
};

const rootStyle = css`
  .filter-item {
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    .cascader {
      width: 281px;
    }
    .select {
      margin: 0 10px;
      width: 150px;
      height: 32px;
    }
    .dynamic-component {
      width: 504px;
      height: 32px;
    }
  }
`;
const Root = styled("div")(rootStyle);
export default Root;
