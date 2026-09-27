import { styled } from "ratan-design-origin/theme";
import { Alert } from "ratan-design-origin/primitives";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_version`;
export const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Alert)(() => ({
  [`&.${classes.root}`]: {
    width: "fit-content",
    fontSize: "10px",
    padding: "1px 8px",
    background: "rgb(237,237,237)",
    "& .MuiAlert-icon": {
      padding: 0,
      fontSize: "14px",
      marginRight: "4px",
      height: "14px",
    },
    "& .MuiAlert-message": {
      padding: 0,
    },
    "& .MuiTypography-root": {
      color: "black",
      fontSize: "10px",
      fontWeight: "400",
      lineHeight: 1.5,
      textTransform: "lowercase",
    },
    "& .MuiSvgIcon-root": {
      color: "black",
      fontWeight: "400",
    },
  },
}));

export default Root;
