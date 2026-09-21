import React from "react";
import MuiButton, { type ButtonProps } from "@mui/material/Button";
import { lighten, styled } from "@mui/material/styles";
import { getWebkitActionStyle } from "./action-style.js";

export interface ResetButtonProps extends ButtonProps {}

const ResetButtonRoot = /*#__PURE__*/ styled(MuiButton)(({ theme }) => {
  if (theme.ratan?.designGeneration === "webkit") {
    const webkit = getWebkitActionStyle("secondary", true);
    return {
      ...webkit,
      "&.MuiButtonBase-root": {
        ...webkit["&.MuiButtonBase-root"],
        minWidth: "108px",
      },
      "&.MuiButton-sizeSmall": { fontSize: "12px" },
    };
  }
  return {
    "&.MuiButtonBase-root": {
      backgroundColor: theme.palette.mode === "dark" ? "#29313A" : "#ededed",
      minWidth: "108px",
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#1A2028",
    },
    "&.MuiButton-sizeSmall": {
      fontSize: "12px",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
    },
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? lighten("#29313A", 0.05)
          : lighten("#ededed", 0.05),
    },
  };
});

export const ResetButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  ResetButtonProps
>(function ResetButton(props, ref) {
  return <ResetButtonRoot {...props} ref={ref} />;
});
