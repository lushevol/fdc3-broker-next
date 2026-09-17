import type { ThemeOptions } from "@mui/material/styles";
import { legacyTokens as custom } from "../tokens/legacy.js";
import type { ControlThemeConfig } from "./index.js";

export const getThemeOptions = (props: ControlThemeConfig): ThemeOptions =>
  ({
    typography: {
      fontFamily: custom.font.fontFamilyPoppins,
      fontSize: custom.font.fontSizeM,
      button: {
        textTransform: "none",
      },
    },
    palette: {
      ...props.palette,
    },
    shape: {
      borderRadius: 5,
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            outline: "0 !important",
            ":focus": {
              outline: "0 !important",
            },
            "&.Mui-focusVisible": {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: 2,
            },
            textTransform: "capitalize",
            fontWeight: 600,
          },
        },
      },
      MuiDialog: { ...props.MuiDialog },
      MuiChip: { ...props.MuiChip },
      MuiInputBase: { ...props.MuiInputBase },
      MuiInput: { ...props.MuiInput },
      MuiFilledInput: { ...props.MuiFilledInput },
      MuiOutlinedInput: { ...props.MuiOutlinedInput },
      MuiPaper: { ...props.MuiPaper },
      MuiInputLabel: { ...props.MuiInputLabel },
      MuiFormControl: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          margin: "dense",
          size: "small",
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: "8px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            marginLeft: "4px",
            marginRight: "4px",
          },
          dense: {
            padding: "3px 16px",
            height: "26px",
            minHeight: "26px",
          },
        },
      },
      MuiToolbar: {
        defaultProps: {
          variant: "dense",
        },
      },
      MuiToggleButton: {
        defaultProps: {
          size: "small",
        },
      },
      MuiButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            outline: "0 !important",
            ":focus": {
              outline: "0 !important",
            },
            "&.Mui-focusVisible": {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: 2,
            },
            textTransform: "capitalize",
            fontWeight: 600,
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTable: {
        defaultProps: {
          size: "small",
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            userSelect: "text",
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            maxWidth: "62%",
          },
        },
      },
    },
  }) as ThemeOptions;
