import { TextField as MuiTextField, styled } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';

export interface NumberFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: number | null;
  readonly onChange: (value: number | null) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly onBlur?: () => void;
}

const StyledNumberField = styled(MuiTextField)({
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

export function NumberField({
  value,
  onChange,
  min,
  max,
  step,
  ...props
}: NumberFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue === '') {
      onChange(null);
      return;
    }
    const nextValue = Number(rawValue);
    onChange(Number.isFinite(nextValue) ? nextValue : null);
  };

  return (
    <StyledNumberField
      {...props}
      value={value ?? ''}
      type="number"
      inputProps={{ min, max, step, 'data-ratan-control': 'number-field' }}
      onChange={handleChange}
      variant="outlined"
    />
  );
}
