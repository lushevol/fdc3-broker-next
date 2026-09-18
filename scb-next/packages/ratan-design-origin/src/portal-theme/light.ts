import { getControlTheme } from "../theme/index.js";
import { css } from "@mui/material/styles";
import color from "../tokens/color.js";
import light from "../tokens/color.light.js";
import legacyColor from "../tokens/color.legacy.js";
import legacyLight from "../tokens/color.light.legacy.js";
import custom from "./common.js";
import scroll from "./scroll.light.js";
import normalize from "./normalize.js";

// when we change to new design, we need to change the function back to dark variable
// And do some changes based on isNewLayout is true
const getLightTheme = (isNewLayout = false, newStyles = false) => ({
  ...getControlTheme("light"),
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        ":root": css`
          ${newStyles ? color : legacyColor}
          ${newStyles ? light : legacyLight} //overide after this line
        ` as ReturnType<typeof css>,
      },
      body: {
        background: `#F7F9FD !important`,
        overflow: "hidden",
        ...scroll,
        "*": {
          ...scroll,
          userSelect: "none",
        },
      },
      ...normalize,
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backdropFilter: !isNewLayout ? "blur(37.5px)" : "unset",
        color: "#1A2028",
        background: !isNewLayout ? "rgba(244, 246, 250, 0.01)" : "unset",
        backgroundImage: !isNewLayout
          ? `linear-gradient(90deg,
            rgba(217,217,217,1) 0%,
            rgba(253,253,253,1) 25%,
            rgba(190,203,207,1) 49%,
            rgba(193,209,213,1) 53%,
            rgba(245,245,245,1) 75%,
            rgba(255,255,255, 1) 100%)`
          : "unset",
        borderBottom: "1px solid rgb(211,224,225)",
        boxShadow:
          "0px 2px 4px 0px rgb(153,223,223,0.2), 0px 4px 5px 0px rgb(234,244,245,0.14), 0px 1px 10px 0px rgb(0,0,0,0.12)",
      },
    },
  },
  LoginPage: {
    ...custom.loginPage,
    main: {
      background: `linear-gradient(to right bottom, rgb(220,230,233) 0%,rgb(253,253,253)50%,rgb(220,230,233) 100%) padding-box padding-box,
    linear-gradient(to right bottom, rgb(65, 73, 85), rgba(44, 50, 59, 0)) border-box border-box`,
    },
  },
  Avatar: {},
  SwitchComponent: {
    backgroundColor: "#C5D0DF",
    color: custom.color["mako"],
    MuiSwitch: {
      "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
          transform: "translateX(12px)",
          "& + .MuiSwitch-track": {
            opacity: 1,
            background: "rgba(244, 246, 250, 1)",
            border: "1px solid rgba(216, 226, 241, 1)",
          },
        },
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#C5D0DF",
        boxShadow: "none",
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      "& .MuiSwitch-track": {
        borderRadius: 8,
        opacity: 1,
        background: "rgba(244, 246, 250, 1)",
        border: "1px solid rgba(216, 226, 241, 1)",
      },
    },
  },
  NewTileComponent: {
    backgroundColor: "#C5D0DF",
    boxShadow: isNewLayout ? "none" : "0px 5px 20px #C2D8DE",
    fontWeight: 500,
    root: {
      border: "1px solid transparent",
      backgroundColor: isNewLayout ? "none" : "rgba(194, 216, 222, 0.5)",
      background: isNewLayout
        ? "unset"
        : `linear-gradient(to right,rgba(194, 216, 222, 0.5),rgba(194, 216, 222, 0.5)) padding-box,
      linear-gradient(to right,rgba(216, 226, 241, 1), rgba(139, 156, 180, 0)) border-box`,
      borderRadius: "15px",
      padding: "2px 16px 2px 5px",
      "&:hover": {
        background: isNewLayout
          ? "unset"
          : `linear-gradient(to right,rgba(216, 226, 241, 1),rgba(139, 156, 180, 0.2)) padding-box,
        linear-gradient(to right,rgba(216, 226, 241, 1), rgba(139, 156, 180, 0)) border-box`,
      },
    },
  },
  DrawerComponent: {
    backgroundColor: "#F7F9FD",
    title: {
      color: "rgba(126, 131, 143, 1)",
      backgroundImage: `linear-gradient(90deg,
        rgba(217,217,217,1) 0%,
        rgba(253,253,253,1) 25%,
        rgba(220,230,233,1) 49%,
        rgba(220,230,233,1) 53%,
        rgba(245,245,245,1) 75%,
        rgba(255,255,255, 1) 100%)`,
    },
  },
  TileComponent: {
    background: `linear-gradient(to right bottom, rgb(220,230,233) 0%,rgb(253,253,253)50%,rgb(220,230,233) 100%) padding-box padding-box,
    linear-gradient(to right bottom, rgb(65, 73, 85), rgba(44, 50, 59, 0)) border-box border-box`,
    boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)`,
    border: "0px solid transparent",
    title: {
      color: "#1A2028",
      fontWeight: 600,
    },
    button: {
      backgroundColor: "rgba(213,222,234,0.8)",
      border: "1px solid rgba(213,222,234,1)",
      color: custom.color["silver"],
      "&:hover": {
        backgroundColor: "rgba(213,222,234,1)",
      },
    },
  },
  TabItem: {
    TextBox: {
      "& input": {
        textOverflow: "ellipsis",
        color: "#616670",
      },
    },
    Button: {
      color: "#616670",
      width: 22,
      height: 22,
    },
  },
  HomePage: {
    Addtab: {
      background: "#c6c8cb",
      color: "#1A2028",
      width: "24px",
      height: "24px",
      minWidth: "24px",
      minHeight: "24px",
      padding: "4px",
      "& svg": {
        width: "16px",
        height: "16px",
      },
      "&:hover": {
        background: "#c6c8cb",
        color: "#1A2028",
      },
    },
    Box: {
      boxShadow:
        "0px 2px 4px -1px rgb(153 223 223 / 20%), 0px 4px 5px 0px rgb(234 244 245 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    },
    "MuiTabs-indicator": {
      borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
      borderRight: "1px solid rgba(255, 255, 255, 0.2)",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      background: "#F7F9FD",
      boxShadow:
        "0px 2px 4px -1px rgb(153 223 223 / 20%), 0px 4px 5px 0px rgb(234 244 245 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    },
  },
  MenuItem: {
    Title: {
      color: "1A2028",
    },
  },
  borderColor: "rgba(224, 224, 224, 1)",
  backgroundColorOddRow: "rgba(49, 95, 99, 0.05)",
  backgroundColorEvenRow: "transparent",
  backgroundColorSelectedRow: "rgba(49, 95, 99, 0.15)",
});

export default getLightTheme;
