import React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { lighten, styled } from "@mui/material/styles";
import { getWebkitActionStyle } from "./action-style.js";
import type { LoadingButtonProps } from "./LoadingButton.js";

export interface SearchButtonProps extends LoadingButtonProps {}

const SearchButtonRoot = styled(MuiButton)(({ theme }) => {
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
>(function SearchButton(
  {
    loading,
    children,
    loadingSize = 14,
    loadingPosition = "inline",
    startIcon,
    ...props
  },
  ref
) {
  if (loadingPosition === "startIcon") {
    return (
      <SearchButtonRoot
        {...props}
        ref={ref}
        disabled={props.disabled || loading}
        aria-busy={loading || undefined}
        startIcon={
          loading ? <CircularProgress aria-hidden="true" size={loadingSize} /> : startIcon
        }
      >
        {children}
      </SearchButtonRoot>
    );
  }
  return loading ? (
    <SearchButtonRoot {...props} ref={ref} startIcon={startIcon} disabled aria-busy>
      <CircularProgress
        aria-hidden="true"
        color="inherit"
        size={loadingSize}
        style={{ marginRight: loadingSize }}
      />
      {children}
    </SearchButtonRoot>
  ) : (
    <SearchButtonRoot {...props} ref={ref} startIcon={startIcon}>
      <span style={{ width: loadingSize }} />
      {children}
      <span style={{ width: loadingSize }} />
    </SearchButtonRoot>
  );
});
