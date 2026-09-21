import type { TextFieldProps } from "@mui/material/TextField";

type TextFieldSlotProps = Partial<TextFieldProps>;

type TextFieldSlotComponentProps<TOwnerState> =
  | TextFieldSlotProps
  | ((ownerState: TOwnerState) => TextFieldSlotProps);

export function composePickerTextFieldSlotProps<TOwnerState>(
  slotProps: TextFieldSlotComponentProps<TOwnerState> | undefined,
  hidden: boolean | undefined
): TextFieldSlotComponentProps<TOwnerState> {
  const mergeProps = (props: TextFieldSlotProps = {}): TextFieldSlotProps => ({
    ...props,
    InputLabelProps: { shrink: true, ...props.InputLabelProps },
    style: {
      ...props.style,
      display: hidden ? "none" : props.style?.display
    }
  });

  return typeof slotProps === "function"
    ? (ownerState) => mergeProps(slotProps(ownerState))
    : mergeProps(slotProps);
}
