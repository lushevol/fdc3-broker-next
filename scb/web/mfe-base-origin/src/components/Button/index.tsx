import React, { PropsWithChildren, ReactElement } from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  ...rest
}: ButtonProps): ReactElement => {
  return <MuiButton {...rest}>{children}</MuiButton>;
};

export default Button;
