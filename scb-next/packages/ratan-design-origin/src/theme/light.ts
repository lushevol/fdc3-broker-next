import { lighten } from "@mui/material/styles";

const getControlTheme = () => ({
  palette: {
    mode: "light",
    primary: {
      main: "#2C3F5E",
    },
    secondary: {
      main: "#008738",
    },
    // text: {
    //   primary: `${props.fontColor} !important`,
    // },
    background: {
      default: "#F7F9FD",
      paper: "rgba(245,245,245,1)",
    },
  },
  MuiDialog: {},
  MuiChip: {
    styleOverrides: {
      outlined: {
        backgroundColor: "rgba(245,245,245,1)",
        border: "1px solid transparent !important",
        background: `linear-gradient(to right,rgba(245,245,245,1),rgba(245,245,245,1)) padding-box,
        linear-gradient(to right, rgba(186,186,186, 1),rgba(245,245,245,1)) border-box`,
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
          WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
        },
        "&::placeholder": {
          color: "rgba(0, 0, 0, 0.9)",
          opacity: 1,
        },
      },
    },
  },
  MuiInput: {
    defaultProps: {
      margin: "dense",
    },
  },
  MuiFilledInput: {
    defaultProps: {
      margin: "dense",
    },
    styleOverrides: {
      root: {
        backgroundColor: "rgba(245,245,245,1)",
        transition: "none",
        "&:hover": {
          backgroundColor: lighten("rgba(245,245,245,1)", 0.01),
          ":not(.Mui-disabled, .Mui-error)": {
            "&:before": {
              borderBottom: "2px solid",
              borderColor: lighten("rgba(186,186,186, 1)", 0.1),
            },
          },
        },
        "&:before": {
          borderBottom: "2px solid rgba(186,186,186, 1)",
        },
        "& .MuiSvgIcon-root": {
          color: "rgba(141, 141, 141, 1)",
        },
      },
      input: {
        "&:focus": {
          backgroundColor: "rgba(245,245,245,1)",
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
        backgroundColor: "rgba(255,255,255,1)",
        border: "1px solid transparent !important",
        background: `linear-gradient(to right,rgba(255,255,255,1),rgba(237,237,237,1)) padding-box,
                     linear-gradient(to right, rgba(186,186,186, 1),rgba(245,245,245,1)) border-box`,
        "&.Mui-error": {
          background: `linear-gradient(to right,rgba(255,255,255,1),rgba(237,237,237,1)) padding-box,
                         linear-gradient(to right, rgba(255, 0, 0, 1),rgba(245,245,245,1)) border-box`,
        },
        "&.Mui-focused": {
          outline: "2px solid #2C3F5E",
          outlineOffset: "1px",
        },
        "& input": {
          border: 0,
          zIndex: 1,
          "&::placeholder": {
            color: "rgba(0, 0, 0, 0.87)",
            opacity: 0.8,
          },
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
      shrink: {
        backgroundColor: "rgba(255,255,255,1)",
      },
    },
  },
  MuiPaper: {},
});
export default getControlTheme;
