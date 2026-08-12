import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_affirmation`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(css``);

export default Root;
