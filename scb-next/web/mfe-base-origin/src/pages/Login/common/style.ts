import { styled } from "ratan-design-origin/theme";
import { LoginPageTokens } from "../../../theme/config/common";
import svg1 from "./svg1.svg";
export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_login`;
export const classes = {
  root: `${PREFIX}-root`,
  gridleft: `${PREFIX}-gridleft`,
  left: `${PREFIX}-left`,
  gridright: `${PREFIX}-gridright`,
  right: `${PREFIX}-right`,
  description: `${PREFIX}-description`,
  formControl: `${PREFIX}-formControl`,
  button: `${PREFIX}-button`,
  box: `${PREFIX}-box`,
  divider: `${PREFIX}-divider`,
};

const Root = styled("section")(({ theme }) => {
  const login = (theme.theme as { LoginPage: LoginPageTokens }).LoginPage;

  return {
    [`&.${classes.root}`]: {},
    [`& .${classes.gridleft}`]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: login.leftBackground,
    },
    [`& .${classes.left}`]: {
      width: login.contentWidth,
      textAlign: "left",
      "& h3": {
        color: `${login.mutedText} !important`,
        fontSize: login.headingFontSize,
        fontStyle: "normal",
        fontWeight: login.headingFontWeight,
        marginBottom: login.headingMarginBottom,
        marginTop: 0,
        lineHeight: login.headingLineHeight,
        textTransform: "capitalize",
      },
    },
    [`& .${classes.formControl}`]: {
      width: "100%",
      marginBottom: login.formMarginBottom,
      marginTop: 0,
      "& .MuiFormLabel-root": {
        transform: "none",
        position: "unset",
        fontSize: login.labelFontSize,
        color: `${login.mutedText} !important`,
        fontWeight: login.labelFontWeight,
        lineHeight: login.labelLineHeight,
      },
      "& .MuiTextField-root": {
        borderRadius: theme.shape.borderRadius,
        display: "block",
        transform: "none",
        boxShadow: login.inputShadow,
        marginBottom: 0,
        color: `${login.inputText} !important`,
        "& input": {
          color: `${login.inputText} !important`,
        },
        "& input::placeholder": {
          color: `${login.inputText} !important`,
          fontSize: login.placeholderFontSize,
          lineHeight: login.placeholderLineHeight,
          fontWeight: login.labelFontWeight,
        },
      },
      "& svg": {
        color: `${login.mutedText} !important`,
      },
    },
    [`& .${classes.button}`]: {
      height: login.buttonHeight,
      fontSize: login.buttonFontSize,
      lineHeight: login.buttonLineHeight,
      fontWeight: login.buttonFontWeight,
      borderRadius: theme.shape.borderRadius,
      marginTop: login.buttonMarginTop,
    },
    [`& .${classes.gridright}`]: {
      background: login.heroBackground,
    },
    [`& .${classes.right}`]: {
      backgroundImage: `url(${svg1})`,
      mixBlendMode: "luminosity",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right",
      height: login.heroHeight,
      "& h2": {
        color: `${login.mutedText} !important`,
        fontSize: login.heroTitleFontSize,
        fontStyle: "normal",
        fontWeight: login.heroTitleFontWeight,
        lineHeight: login.heroTitleLineHeight,
        width: login.heroTitleWidth,
        marginTop: login.heroTitleMarginTop,
        marginLeft: login.heroContentMarginLeft,
        marginBottom: login.heroTitleMarginBottom,
      },
      [`& .${classes.description}`]: {
        color: `${login.mutedText} !important`,
        fontSize: login.descriptionFontSize,
        fontStyle: "normal",
        fontWeight: login.descriptionFontWeight,
        lineHeight: login.descriptionLineHeight,
        marginLeft: login.heroContentMarginLeft,
        textDecoration: "none !important",
        width: login.descriptionWidth,
      },
    },
    [`& .${classes.box}`]: {
      position: "fixed",
      bottom: login.tabsBottom,
      right: login.tabsRight,
      "& .MuiTab-root": {
        borderTop: `${login.tabIndicatorHeight} solid ${login.tabBorder} !important`,
      },
      "& .MuiSvgIcon-root": {
        fontSize: login.headingFontSize,
        color: login.tabActive,
      },
      "& .MuiTabs-indicator": {
        bottom: undefined,
        top: 0,
        backgroundColor: login.tabActive,
        height: login.tabIndicatorHeight,
      },
    },
    [`& .${classes.divider}`]: {
      marginTop: login.buttonMarginTop,
      borderColor: login.divider,
    },
  };
});

export default Root;
