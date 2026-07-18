import { Button as MuiButton, styled, type ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps
  extends Omit<MuiButtonProps, 'color' | 'size' | 'sx' | 'variant'> {
  readonly variant?: ButtonVariant;
}

const StyledButton = styled(MuiButton)({
  minHeight: 'var(--ratan-control-height)',
  paddingInline: 'var(--ratan-control-padding-inline)',
  borderRadius: 'var(--ratan-radius-control)',
  fontSize: 'var(--ratan-font-size-body)',
  fontWeight: 'var(--ratan-font-weight-strong)',
  '&[data-ratan-variant="primary"]': {
    color: 'var(--ratan-color-action-on-primary)',
    background: 'var(--ratan-color-action-primary)',
    '&:hover': { background: 'var(--ratan-color-action-primary-hover)' },
  },
  '&[data-ratan-variant="secondary"]': {
    color: 'var(--ratan-color-content-primary)',
    borderColor: 'var(--ratan-color-border-strong)',
    background: 'var(--ratan-color-surface-interactive)',
  },
  '&[data-ratan-variant="danger"]': {
    color: 'var(--ratan-color-action-danger)',
    borderColor: 'currentColor',
    background: 'transparent',
  },
  '&[data-ratan-variant="ghost"]': {
    color: 'var(--ratan-color-action-primary)',
    background: 'transparent',
  },
  '&.Mui-focusVisible': {
    outline: 'var(--ratan-focus-width) solid var(--ratan-color-focus-ring)',
    outlineOffset: 'var(--ratan-focus-offset)',
  },
});

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  const muiVariant = variant === 'ghost' ? 'text' : variant === 'primary' ? 'contained' : 'outlined';
  return <StyledButton {...props} variant={muiVariant} data-ratan-variant={variant} />;
}
