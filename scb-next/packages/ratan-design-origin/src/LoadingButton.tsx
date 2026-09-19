import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, type ButtonProps } from "./Button.js";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingSize?: number;
  loadingPosition?: "inline" | "startIcon";
}

const DEFAULT_LOADING_SIZE = 14;

export const LoadingButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(function LoadingButton(
  {
    loading,
    children,
    loadingSize = DEFAULT_LOADING_SIZE,
    loadingPosition = "inline",
    ...props
  },
  ref
) {
  if (loadingPosition === "startIcon") {
    return (
      <Button
        {...props}
        ref={ref}
        disabled={props.disabled || loading}
        aria-busy={loading || undefined}
        startIcon={
          loading ? (
            <CircularProgress aria-hidden="true" size={loadingSize} />
          ) : (
            props.startIcon
          )
        }
      >
        {children}
      </Button>
    );
  }
  return loading ? (
    <Button {...props} ref={ref} disabled aria-busy>
      <CircularProgress
        aria-hidden="true"
        color="inherit"
        size={loadingSize}
        style={{ marginRight: loadingSize }}
      />
      {children}
    </Button>
  ) : (
    <Button {...props} ref={ref}>
      <span style={{ width: loadingSize }} />
      {children}
      <span style={{ width: loadingSize }} />
    </Button>
  );
});
