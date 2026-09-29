import React from "react";
import MuiButton from "@mui/material/Button";
import { getLoadingButtonProps } from "./loading-button-props.js";
import { lighten, styled } from "@mui/material/styles";
import { getWebkitActionStyle } from "./action-style.js";
import type { LoadingButtonProps } from "./LoadingButton.js";

export type SearchButtonProps = LoadingButtonProps;

const SearchButtonRoot = /*#__PURE__*/ styled(MuiButton)(({ theme }) => {
  if (theme.ratan?.designGeneration === "webkit") {
    const webkit = getWebkitActionStyle("primary", true);
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
      backgroundColor: "#2C3F5E",
      minWidth: "108px",
      color: "#FFFFFF",
    },
    "&.MuiButton-sizeSmall": {
      fontSize: "12px",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
      color: "rgba(255,255,255,0.5)",
    },
    "&:hover": {
      backgroundColor: lighten("#2C3F5E", 0.05),
    },
  };
});

export const SearchButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  SearchButtonProps
>(function SearchButton(props, ref) {
  return <SearchButtonRoot {...getLoadingButtonProps(props)} ref={ref} />;
});
