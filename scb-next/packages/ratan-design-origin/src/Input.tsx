import React from "react";
import { styled } from "@mui/material/styles";
import MuiTextField, {
  type TextFieldProps,
  type TextFieldVariants,
} from "@mui/material/TextField";
import { InputStyled } from "./input-style.js";

const classes = { left: "ratan-design-input-left" };
const TextField = /*#__PURE__*/ styled(MuiTextField)(InputStyled(classes));

export interface InputProps extends Omit<TextFieldProps, "variant"> {
  labelPosition?: "top" | "left";
  variant: TextFieldVariants;
  hidden?: boolean;
  slotProps?: {
    input?: TextFieldProps["InputProps"];
    inputLabel?: TextFieldProps["InputLabelProps"];
    htmlInput?: TextFieldProps["inputProps"];
    formHelperText?: TextFieldProps["FormHelperTextProps"];
    select?: TextFieldProps["SelectProps"];
  };
}

export const Input = /*#__PURE__*/ React.forwardRef<HTMLDivElement, InputProps>(
  function Input(
    {
      labelPosition = "top",
      hidden,
      disabled: disabledProp,
      error,
      required: requiredProp,
      slotProps,
      InputProps,
      InputLabelProps,
      inputProps,
      FormHelperTextProps,
      SelectProps,
      className,
      style,
      ...rest
    },
    ref
  ) {
    const disabled =
      slotProps?.input?.disabled ??
      slotProps?.htmlInput?.disabled ??
      InputProps?.disabled ??
      inputProps?.disabled ??
      disabledProp;
    const required =
      slotProps?.htmlInput?.required ?? inputProps?.required ?? requiredProp;
    return (
      <TextField
        {...rest}
        ref={ref}
        disabled={disabled}
        error={error}
        required={required}
        className={[
          labelPosition.toLowerCase() === "left" ? classes.left : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        InputLabelProps={{
          shrink: true,
          ...InputLabelProps,
          ...slotProps?.inputLabel,
        }}
        InputProps={{ ...InputProps, ...slotProps?.input, disabled }}
        inputProps={{ ...inputProps, ...slotProps?.htmlInput, disabled, required }}
        FormHelperTextProps={{
          ...FormHelperTextProps,
          ...slotProps?.formHelperText,
        }}
        SelectProps={{ ...SelectProps, ...slotProps?.select }}
        style={{ display: hidden ? "none" : undefined, ...style }}
      />
    );
  }
);
