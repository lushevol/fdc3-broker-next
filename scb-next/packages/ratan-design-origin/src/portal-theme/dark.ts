import { getControlTheme } from "../theme/index.js";
import { css, darken } from "@mui/material/styles";
import color from "../tokens/color.js";
import colordark from "../tokens/color.dark.js";
import legacyColor from "../tokens/color.legacy.js";
import legacyDark from "../tokens/color.dark.legacy.js";
import custom from "./common.js";
import scroll from "./scroll.dark.js";
import normalize from "./normalize.js";

// when we change to new design, we need to change the function back to dark variable
// And do some changes based on isNewLayout is true
// And need revert the import from getDarkTheme to dark, getLightTheme to light, revert the function call to dark or light virable
const getDarkTheme = (isNewLayout = false, newStyles = false) => ({
  ...getControlTheme("dark"),
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        ":root": css`
          ${newStyles ? color : legacyColor}
          ${newStyles ? colordark : legacyDark}
          //overide after this line
          --theme-color-modal-header: ${custom.color["mirage-52"]};
          --theme-color-modal-header-border: ${darken(
            custom.color["mirage-52"],
            0.3
          )};
          --ag-header-background-color: ${custom.color["mirage-52"]};
          --ag-border-color: ${darken(custom.color["mirage-52"], 0.3)};
        ` as ReturnType<typeof css>,
      },
      body: {
        background: `${custom.color["mirage-52"]}`,
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
        backdropFilter: !isNewLayout ? "blur(37.5px)" : undefined,
        background: !isNewLayout ? "#1A2028" : "transparent",
        backgroundImage: !isNewLayout
          ? "linear-gradient(90deg, rgba(50,58,66,1) 0%, rgba(23,29,36,1) 20%, rgba(13,32,38,1) 30%, rgba(42,79,90, 0.5) 63%, rgba(13,32,38,1) 70%, rgba(23,29,36,1) 80%, rgba(46,55,69,1) 100%)"
          : undefined,
        borderBottom: "1px solid rgba(50,58,66,0.5)",
      },
    },
  },
  LoginPage: {
    ...custom.loginPage,
    main: {
      background: `linear-gradient(to right bottom, rgb(26, 32, 40) 0%, rgba(26, 32, 40, 0) 50%, rgb(26, 32, 40) 100%) padding-box,
    linear-gradient(to right bottom, rgb(65, 73, 85), rgba(44, 50, 59, 0)) border-box `,
    },
  },
  Avatar: {},
  SwitchComponent: {
    backgroundColor: custom.color["mako"],
    color: custom.color["white"],
    MuiSwitch: {
      "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
          transform: "translateX(12px)",
          "& + .MuiSwitch-track": {
            opacity: 1,
            background: `linear-gradient(to right,rgba(0, 0, 0, 1),rgba(0, 0, 0, 0.3)) padding-box,
            linear-gradient(to right, rgba(65, 73, 85, 1), rgba(44, 50, 59, 0)) border-box`,
          },
        },
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: custom.color["swithThumb"],
        boxShadow: "none",
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      "& .MuiSwitch-track": {
        borderRadius: 8,
        opacity: 1,
        background: `linear-gradient(to right,rgba(0, 0, 0, 1),rgba(0, 0, 0, 0.3)) padding-box,
        linear-gradient(to right, rgba(65, 73, 85, 1), rgba(44, 50, 59, 0)) border-box`,
      },
    },
  },
  NewTileComponent: {
    backgroundColor: custom.color["newTileOxford"],
    boxShadow: isNewLayout ? "none" : "0px 5px 20px rgba(42, 67, 90, 0.5)",
    fontWeight: 300,
    root: {
      border: "1px solid transparent",
      background: isNewLayout
        ? "unset"
        : `linear-gradient(to right,rgba(26, 32, 40, 1),rgba(26, 32, 40, 0)) padding-box,
      linear-gradient(to right, rgba(65, 73, 85, 1), rgba(44, 50, 59, 0)) border-box`,
      borderRadius: "15px",
      padding: "2px 16px 2px 5px",
      "&:hover": {
        background: isNewLayout
          ? "unset"
          : `linear-gradient(to right,rgba(26, 32, 40, 1),rgba(26, 32, 40, 1)) padding-box,
      linear-gradient(to right, rgba(65, 73, 85, 1), rgba(44, 50, 59, 0)) border-box`,
      },
    },
  },
  DrawerComponent: {
    backgroundColor: custom.color["mirage2"],
    title: {
      color: custom.color["silver"],
      backgroundImage:
        "linear-gradient(90deg, rgba(33,38,42,1) 0%, rgba(23,29,36,0.8) 40%, rgba(23,29,36,1) 50%, rgba(23,29,36,0.8) 90%, rgba(28,34,42,1) 100%)",
    },
  },
  TileComponent: {
    background: `linear-gradient( to bottom right, rgba(26, 32, 40, 1) 0%, rgba(26, 32, 40, 0) 50%, rgba(26, 32, 40, 1) 100%) padding-box,
    linear-gradient(to bottom right, rgba(65, 73, 85, 1), rgba(44, 50, 59, 0)) border-box`,
    boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)`,
    border: "1px solid transparent",
    title: {
      color: custom.color["white"],
      fontWeight: 300,
    },
    button: {
      backgroundColor: "rgba(50,58,66,0.7)",
      boxShadow: "0px 0px 8px rgba(50,58,66,0.9)",
      border: "1px solid rgba(50,58,66,1)",
      color: custom.color["silver"],
      "&:hover": {
        backgroundColor: "rgba(50,58,66,0.9)",
      },
    },
  },
  TabItem: {
    TextBox: {
      "& input": {
        textOverflow: "ellipsis",
        color: "#c0c0c0",
      },
    },
    Button: {
      color: custom.color["grey"],
      width: 22,
      height: 22,
    },
  },
  HomePage: {
    Addtab: {
      background: "rgba(255,255,255,0.4)",
      color: "inherit",
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
        background: "rgba(255,255,255,0.4)",
        color: "inherit",
      },
    },
    Box: {
      boxShadow:
        "0px 2px 4px -1px rgb(50,58,66,0.9), 0px 4px 5px 0px rgb(50,58,66,0.9), 0px 1px 10px 0px rgb(50,58,66,0.9)",
    },
    "MuiTabs-indicator": {
      borderLeft: "1px solid rgba(50,58,66,1)",
      borderRight: "1px solid rgba(50,58,66,1)",
      borderTop: "1px solid rgba(50,58,66,1)",
      background: "#171d24",
      boxShadow: "0px -1px 3px rgba(50,58,66,0.9)",
    },
  },
  MenuItem: {
    Title: {
      color: custom.color["silver"],
    },
  },
  borderColor: "rgba(81, 81, 81, 1)",
  backgroundColorOddRow: "#202631",
  backgroundColorEvenRow: `${custom.color["mirage-52"]}`,
  backgroundColorSelectedRow: "rgba(42,79,90, 0.5)",
});

export default getDarkTheme;
