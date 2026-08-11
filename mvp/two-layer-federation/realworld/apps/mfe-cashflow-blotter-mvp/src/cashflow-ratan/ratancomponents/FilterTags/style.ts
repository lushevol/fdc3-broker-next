import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_filter-tags`;
export const classes = {
  tags: `${PREFIX}-filter-tags`,
};

const Root = styled(Box)(
  css`
    padding-left: 20px;
    display: flex;
    flex-direction: row;
    .${classes.tags} {
      margin-left: 20px;
      .ant-tag {
        border-radius: 4px;
      }
    }
  `
);

export default Root;
