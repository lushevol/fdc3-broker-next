import Button, {
  ToggleButtonProps as MuiToggleButtonProps,
} from "@mui/material/ToggleButton";
import { styled, darken, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export interface ToggleButtonProps extends MuiToggleButtonProps {}

const defStyle = (theme: Theme) => ({
  minWidth: "100px",
  padding: "4px 16px",
  fontWeight: 600,
  border: 0,
  "& svg": {
    marginRight: theme.shape.borderRadius,
    transform: "scale3d(0.8, 0.8, 0.8)!important",
  },
});
const defSelectedStyle = {
  borderRadius: "5px!important",
  border: "1px solid transparent !important",
  transform: "scale3d(1.11, 1.11, 1.11)",
  zIndex: 1,
};

export const modeStyle = (theme: Theme, mode: PaletteMode) => {
  if (mode === "dark") {
    return {
      color: "rgba(141, 141, 141, 1)",
      "&.MuiToggleButton-root": {
        backgroundColor: "rgba(33,41,50,1)",
        ...defStyle(theme),
        "&:hover": {
          backgroundColor: darken("rgba(33,41,50,1)", 0.1),
        },
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(41, 49, 58, 1)",
        background: `linear-gradient(to right,rgba(41, 49, 58, 1),rgba(41, 49, 58, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1), rgba(41, 49, 58, 1)) border-box`,
        ...defSelectedStyle,
        "&:hover": {
          background: `linear-gradient(to right,rgba(31, 39, 48, 1),rgba(31, 39, 48, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1), rgba(31, 39, 48, 1)) border-box`,
        },
      },
      "&.Mui-disabled": {
        color: "rgba(255, 255, 255, 0.3) !important",
      },
    };
  } else {
    return {
      "&.MuiToggleButton-root": {
        backgroundColor: "rgba(237,237,237,1)",
        ...defStyle(theme),
        "&:hover": {
          backgroundColor: darken("rgba(237,237,237,1)", 0.1),
        },
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(237,237,237,1)",
        background: `linear-gradient(to right, rgba(237,237,237,1), rgba(237,237,237,1)) padding-box,
                     linear-gradient(to right, rgba(148,148,148, 1), rgba(210,210,215,1)) border-box`,
        ...defSelectedStyle,
        "&:hover": {
          background: `linear-gradient(to right,${darken(
            "rgba(237,237,237,1)",
            0.1
          )},${darken("rgba(237,237,237,1)", 0.1)}) padding-box,
                     linear-gradient(to right, rgba(148, 148, 148, 1), ${darken(
                       "rgba(210,210,215,1)",
                       0.1
                     )}) border-box`,
        },
      },
      "&.Mui-disabled": {
        color: "rgba(0, 0, 0, 0.26) !important",
      },
    };
  }
};
const ToggleButton = styled(Button)(({ theme }) =>
  modeStyle(theme, theme.palette.mode)
);
export default ToggleButton;
