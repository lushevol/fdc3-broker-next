import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_message_modal`;
export const classes = {
  root: `${PREFIX}-root`,
  pre: `${PREFIX}-pre`,
  noSwiftMessage: `${PREFIX}-no-swift-message`,
};

const Root = styled("div")(
  css`
    background-color: var(--theme-color-collapse-bg);
    overflow: auto;
    height: calc(100% - 35px);
    min-width: 0px;
    min-height: 0px;
    .${classes.pre} {
      width: 800px;
    }
    .${classes.noSwiftMessage} {
      text-align: center;
      top: 50%;
      line-height: 100px;
      font-size: 13px;
    }
  `
);

export default Root;
