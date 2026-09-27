import { styled } from "ratan-design-origin/theme";
import { Stack } from "ratan-design-origin/primitives";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_category`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Stack)(() => ({
  [`&.${classes.root}`]: {
    width: "100%",
    marginTop: "16px",
  },
  "& .MicroWebUI_Base_simple_table-root": {
    height: "calc(100vh - 170px)",
  },
}));

export default Root;
