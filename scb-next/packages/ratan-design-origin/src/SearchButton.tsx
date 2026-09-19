import React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { lighten, styled } from "@mui/material/styles";
import type { LoadingButtonProps } from "./LoadingButton.js";

export interface SearchButtonProps extends LoadingButtonProps {}

const SearchButtonRoot = styled(MuiButton)(() => ({
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
}));

export const SearchButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  SearchButtonProps
>(function SearchButton(
  { loading, children, loadingSize = 14, ...props },
  ref
) {
  return loading ? (
    <SearchButtonRoot {...props} ref={ref} disabled aria-busy>
      <CircularProgress
        aria-hidden="true"
        color="inherit"
        size={loadingSize}
        style={{ marginRight: loadingSize }}
      />
      {children}
    </SearchButtonRoot>
  ) : (
    <SearchButtonRoot {...props} ref={ref}>
      <span style={{ width: loadingSize }} />
      {children}
      <span style={{ width: loadingSize }} />
    </SearchButtonRoot>
  );
});
