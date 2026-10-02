import { getThemeOptions } from "../theme/index.js";
import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import custom from "./common.js";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type { getPortalTheme } from "../portal-theme.js";

type ThemeConfig = ReturnType<typeof getPortalTheme>;

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
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: "-2px",
            },
            "&:focus-within": {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: "-2px",
            },
          },
          columnHeaderTitle: {
            fontWeight: 700,
          },
          row: {
            marginBottom: "6px",
            "&:nth-of-type(odd):not(:hover, .Mui-selected)": {
              backgroundColor: props.backgroundColorOddRow,
            },
            "&:nth-of-type(even):not(:hover, .Mui-selected)": {
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
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: "-2px",
            },
            "&:focus-within": {
              outline: `2px solid ${props.palette.primary.main} !important`,
              outlineOffset: "-2px",
            },
            "&:first-of-type": {
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
  return { config: config as typeof config & { theme: ThemeConfig; customColor: typeof custom.color } };
};

export default Config;
