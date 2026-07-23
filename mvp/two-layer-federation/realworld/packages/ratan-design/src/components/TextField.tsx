import { TextField as MuiTextField, styled, type TextFieldProps as MuiTextFieldProps } from '@mui/material';
import type { ChangeEvent } from 'react';

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, 'label' | 'onChange' | 'size' | 'sx' | 'value'> {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

const StyledTextField = styled(MuiTextField)({
  '& .MuiInputLabel-root': { color: 'var(--ratan-color-content-secondary)' },
  '& .MuiOutlinedInput-root': {
    minHeight: 'var(--ratan-control-height)',
    color: 'var(--ratan-color-content-primary)',
    background: 'var(--ratan-color-surface-raised)',
    borderRadius: 'var(--ratan-radius-control)',
    '& fieldset': { borderColor: 'var(--ratan-color-border-strong)' },
    '&:hover fieldset': { borderColor: 'var(--ratan-color-action-primary)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--ratan-color-focus-ring)' },
    '&.Mui-focused': {
      outline: 'var(--ratan-focus-width) solid var(--ratan-color-focus-ring)',
      outlineOffset: 'var(--ratan-focus-offset)',
    },
  },
});

export function TextField({ onChange, inputProps, ...props }: TextFieldProps) {
  return (
    <StyledTextField
      {...props}
      inputProps={{ ...inputProps, 'data-ratan-control': 'text-field' }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      variant="outlined"
    />
  );
}
