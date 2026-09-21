import React from "react";
import MuiToggleButton, {
  type ToggleButtonProps as MuiToggleButtonProps,
} from "@mui/material/ToggleButton";
import type { PaletteMode } from "@mui/material";
import { darken, styled, type Theme } from "@mui/material/styles";
import {
  getWebkitActionState,
  getWebkitActionStyle,
} from "./action-style.js";
import type { DesignGeneration } from "./theme/index.js";

export type ToggleButtonProps = MuiToggleButtonProps;

const defaultStyle = (theme: Theme) => ({
  minWidth: "100px",
  padding: "4px 16px",
  fontWeight: 600,
  border: 0,
  "& svg": {
    marginRight: theme.shape.borderRadius,
    transform: "scale3d(0.8, 0.8, 0.8)!important",
  },
});

const selectedStyle = {
  borderRadius: "5px!important",
  border: "1px solid transparent !important",
  transform: "scale3d(1.11, 1.11, 1.11)",
  zIndex: 1,
};

export const modeStyle = (
  theme: Theme,
  mode: PaletteMode,
  generation: DesignGeneration = theme.ratan?.designGeneration ?? "legacy"
) => {
  if (generation === "webkit") {
    const webkit = getWebkitActionStyle("secondary", false);
    const disabled = getWebkitActionState("secondary", "disabled");
    return {
      ...webkit,
      "&.MuiButtonBase-root": {
        ...webkit["&.MuiButtonBase-root"],
        ...defaultStyle(theme),
      },
      "&.Mui-selected": {
        ...getWebkitActionState("secondary", "select"),
        ...selectedStyle,
        "&:hover": getWebkitActionState("secondary", "select"),
        "&:active": getWebkitActionState("secondary", "press"),
        "&.Mui-disabled": { ...disabled, opacity: 1 },
      },
    };
  }
  if (mode === "dark") {
    return {
      color: "rgba(141, 141, 141, 1)",
      "&.MuiToggleButton-root": {
        backgroundColor: "rgba(33,41,50,1)",
        ...defaultStyle(theme),
        "&:hover": { backgroundColor: darken("rgba(33,41,50,1)", 0.1) },
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(41, 49, 58, 1)",
        background: `linear-gradient(to right,rgba(41, 49, 58, 1),rgba(41, 49, 58, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1), rgba(41, 49, 58, 1)) border-box`,
        ...selectedStyle,
        "&:hover": {
          background: `linear-gradient(to right,rgba(31, 39, 48, 1),rgba(31, 39, 48, 1)) padding-box,
                     linear-gradient(to right, rgba(65, 73, 85, 1), rgba(31, 39, 48, 1)) border-box`,
        },
      },
      "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.3) !important" },
    };
  }
  return {
    "&.MuiToggleButton-root": {
      backgroundColor: "rgba(237,237,237,1)",
      ...defaultStyle(theme),
      "&:hover": { backgroundColor: darken("rgba(237,237,237,1)", 0.1) },
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(237,237,237,1)",
      background: `linear-gradient(to right, rgba(237,237,237,1), rgba(237,237,237,1)) padding-box,
                     linear-gradient(to right, rgba(148,148,148, 1), rgba(210,210,215,1)) border-box`,
      ...selectedStyle,
      "&:hover": {
        background: `linear-gradient(to right,${darken("rgba(237,237,237,1)", 0.1)},${darken("rgba(237,237,237,1)", 0.1)}) padding-box,
                     linear-gradient(to right, rgba(148, 148, 148, 1), ${darken("rgba(210,210,215,1)", 0.1)}) border-box`,
      },
    },
    "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.26) !important" },
  };
};

const ToggleButtonRoot = /*#__PURE__*/ styled(MuiToggleButton)(({ theme }) =>
  modeStyle(theme, theme.palette.mode, theme.ratan?.designGeneration)
);

export const ToggleButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(function ToggleButton(props, ref) {
  return <ToggleButtonRoot {...props} ref={ref} />;
});
