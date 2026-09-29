import React from "react";
import { getLoadingButtonProps } from "./loading-button-props.js";
import { Button, type ButtonProps } from "./Button.js";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingSize?: number;
  loadingPosition?: "inline" | "startIcon";
}

export const LoadingButton = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(function LoadingButton(props, ref) {
  return <Button {...getLoadingButtonProps(props)} ref={ref} />;
});
