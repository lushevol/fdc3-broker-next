import { lighten } from "@mui/material/styles";
import { legacyTokens as custom } from "../tokens/legacy.js";

const getControlTheme = () => ({
  palette: {
    mode: "dark",
    primary: {
      main: `${custom.color["blue"]}`,
    },
    secondary: {
      main: "#008738",
    },
    // text: {
    //   primary: `${props.fontColor} !important`,
    // },
    background: {
      default: `${custom.color["mirage-52"]}`,
      paper: "rgba(27, 39, 58, 1)",
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        "& .MuiDialogTitle-root": {
          backgroundColor: `${custom.color["mirage-52"]}`,
        },
        "& .MuiDialogContent-root": {
          backgroundColor: `${custom.color["mirage-52"]}`,
        },
        "& .MuiDialogActions-root": {
          backgroundColor: `${custom.color["mirage-52"]}`,
        },
        border: `1px solid rgba(42,42,42,1)`,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      outlined: {
        backgroundColor: "rgba(17, 23, 29, 1)",
        border: "1px solid transparent !important",
        background: `linear-gradient(to right,rgba(17, 23, 29, 1),rgba(17, 23, 29, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1),rgba(29, 31, 34, 1)) border-box`,
      },
    },
  },
  MuiInputBase: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      input: {
        "&:focus": {
          backgroundColor: "transparent",
        },
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "rgba(255, 255, 255, 0.7)",
        },
        "&::placeholder": {
          color: "rgba(255, 255, 255, 0.9)",
          opacity: 1,
        },
      },
    },
  },
  MuiInput: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      root: {
        transition: "none",
        "&:hover": {
          ":not(.Mui-disabled, .Mui-error)": {
            "&:before": {
              borderBottom: "2px solid",
              borderColor: lighten("rgba(65, 73, 85, 1)", 0.1),
            },
          },
        },
        "&:before": {
          borderBottom: "2px solid rgba(65, 73, 85, 1)",
        },
        "& .MuiSvgIcon-root": {
          color: "rgba(141, 141, 141, 1)",
        },
      },
      input: {
        "&:focus": {
          backgroundColor: "transparent",
        },
      },
    },
  },
  MuiFilledInput: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      root: {
        backgroundColor: "rgba(17, 23, 29, 1)",
        transition: "none",
        "&:hover": {
          backgroundColor: lighten("rgba(17, 23, 29, 1)", 0.01),
          ":not(.Mui-disabled, .Mui-error)": {
            "&:before": {
              borderBottom: "2px solid",
              borderColor: lighten("rgba(65, 73, 85, 1)", 0.1),
            },
          },
        },
        "&:before": {
          borderBottom: "2px solid rgba(65, 73, 85, 1)",
        },
        "& .MuiSvgIcon-root": {
          color: "rgba(141, 141, 141, 1)",
        },
      },
      input: {
        "&:focus": {
          backgroundColor: "rgba(17, 23, 29, 1)",
        },
      },
      sizeSmall: {
        "& .MuiFilledInput-input": {
          marginBottom: "4px",
        },
      },
    },
  },
  MuiOutlinedInput: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      root: {
        backgroundColor: "rgba(17, 23, 29, 1)",
        border: "1px solid transparent !important",
        background: `linear-gradient(to right,rgba(17, 23, 29, 1),rgba(17, 23, 29, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1),rgba(29, 31, 34, 1)) border-box`,
        "&.Mui-error": {
          background: `linear-gradient(to right,rgba(17, 23, 29, 1),rgba(17, 23, 29, 1)) padding-box,
                         linear-gradient(to right, rgba(244, 67, 54, 1),rgba(28, 1, 1, 1)) border-box`,
        },
        "&.Mui-focused": {
          outline: `2px solid ${custom.color["blue"]}`,
          outlineOffset: "1px",
        },
        "& input": {
          border: 0,
          zIndex: 1,
        },
        "& svg": {
          zIndex: 1,
        },
        "& .MuiSelect-outlined": {
          zIndex: 1,
        },
        "& textarea": {
          border: 0,
          zIndex: 1,
        },
        "& .MuiSvgIcon-root": {
          color: "rgba(141, 141, 141, 1)",
        },
        "& .MuiSelect-select": {
          zIndex: 1,
        },
      },
      notchedOutline: {
        display: "none",
      },
    },
  },
  MuiInputLabel: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      outlined: {
        "&.MuiInputLabel-shrink": {
          backgroundColor: "rgba(17, 23, 29, 1)",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
});
export default getControlTheme;
