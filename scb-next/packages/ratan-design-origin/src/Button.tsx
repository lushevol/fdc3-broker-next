import React from "react";
import MuiButton, { type ButtonProps } from "@mui/material/Button";

export const Button = /*#__PURE__*/ React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(props, ref) {
  return <MuiButton {...props} ref={ref} />;
});

export type { ButtonProps };
