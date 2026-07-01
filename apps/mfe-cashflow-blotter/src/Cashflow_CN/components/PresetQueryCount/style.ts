import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_PresetQueryCount`;
export const classes = {
  title: `${PREFIX}-title`,
  item: `${PREFIX}-item`,
};

const Root = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        display: flex;
        align-items: center;
        border: 1px solid var(--theme-color-border-color);
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 5px 0;
        .${classes.title} {
          width: 141px;
          font-weight: 600;
          padding: 5px 10px;
        }
        .${classes.item} {
          width: 153px;
          padding: 0 5px;
        }
      `
);

export default Root;
