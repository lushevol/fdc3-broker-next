import React from "react";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MuiSelect, {
  type SelectProps as MuiSelectProps,
} from "@mui/material/Select";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import { InputStyled } from "./input-style.js";

const classes = { left: "ratan-design-select-left" };
const SelectFormControl = /*#__PURE__*/ styled(FormControl)(
  InputStyled(classes)
);

export interface SelectProps extends Omit<MuiSelectProps, "variant"> {
  labelPosition?: "top" | "left";
  formControlClassName?: string;
  variant: "standard" | "outlined" | "filled" | undefined;
}

export const Select = /*#__PURE__*/ React.forwardRef<
  HTMLDivElement,
  SelectProps
>(function Select(
  {
    labelPosition = "top",
    label,
    labelId,
    id,
    variant,
    size,
    formControlClassName,
    ...props
  },
  ref
) {
  const generatedId = React.useId();
  const resolvedLabelId = labelId ?? `${generatedId}-label`;
  return (
    <SelectFormControl
      fullWidth
      size={size ?? "small"}
      variant={variant}
      className={[
        labelPosition === "left" ? classes.left : "",
        formControlClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <InputLabel id={resolvedLabelId} htmlFor={id}>
        {label}
      </InputLabel>
      <MuiSelect
        {...props}
        ref={ref}
        id={id}
        labelId={resolvedLabelId}
        IconComponent={props.IconComponent ?? KeyboardArrowDownIcon}
      />
    </SelectFormControl>
  );
});
