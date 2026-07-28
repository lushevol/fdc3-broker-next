import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_action_history`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(
  css`
    .ant-table-pagination {
      position: absolute;
      top: -10px;
      right: 10px;
    }
  `
);

export default Root;
