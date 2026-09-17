import { getThemeOptions } from "ratan-design-origin/theme";
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
  const sharedOptions = getThemeOptions(props);
  let config = createTheme({
    ...sharedOptions,
    theme: { ...props },
    customColor: custom.color,
    components: {
      ...sharedOptions.components,
      MuiCssBaseline: {
        ...props.MuiCssBaseline,
      },
      MuiAppBar: { ...props.MuiAppBar },
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
