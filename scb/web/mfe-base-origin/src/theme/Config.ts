import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import custom from "./config/common";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type { getTheme } from "./config/utils";

type ThemeConfig = ReturnType<typeof getTheme>;

export const Config = (props: ThemeConfig) => {
  let config = createTheme({
    theme: { ...props },
    customColor: custom.color,
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
            textTransform: "capitalize",
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        ...props.MuiCssBaseline,
      },
      MuiAppBar: { ...props.MuiAppBar },
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
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderWidth: 0,
          },
          toolbarContainer: {
            justifyContent: "end",
            "& .MuiBox-root": {
              display: "none",
            },
          },
          columnHeaders: {
            borderWidth: 0,
          },
          columnHeader: {
            borderWidth: 0,
            "&:focus": {
              outline: "0 !important",
            },
            "&:focus-within": {
              outline: "0 !important",
            },
          },
          columnHeaderTitle: {
            fontWeight: 700,
          },
          row: {
            marginBottom: "6px",
            "&:nth-child(odd):not(:hover, .Mui-selected)": {
              backgroundColor: props.backgroundColorOddRow,
            },
            "&:nth-child(even):not(:hover, .Mui-selected)": {
              backgroundColor: props.backgroundColorEvenRow,
            },
            "&.Mui-selected": {
              backgroundColor: props.backgroundColorSelectedRow,
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: props.backgroundColorSelectedRow,
                borderRadius: "5px",
              },
            },
            "&:hover": {
              backgroundColor: props.backgroundColorSelectedRow,
              borderRadius: "5px",
            },
          },
          cell: {
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: `${props.borderColor}!important`,
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: `${props.borderColor}!important`,
            "&:focus": {
              outline: "0 !important",
            },
            "&:focus-within": {
              outline: "0 !important",
            },
            "&:nth-child(1)": {
              borderLeft: `1px solid ${props.borderColor}`,
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
            },
            "&:last-child": {
              borderRight: `1px solid ${props.borderColor}`,
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            },
          },
          virtualScroller: {
            width: "calc(100% - 20px)",
          },
          footerContainer: {
            borderWidth: 0,
          },
        },
      },
    },
  } as ThemeOptions);
  config = responsiveFontSizes(config);
  return { config };
};

export default Config;
