import {
  Button as MuiButton,
  Chip,
  TextField as MuiTextField,
  ThemeProvider,
  createTheme,
  styled,
  type ButtonProps as MuiButtonProps,
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import type { ChangeEvent, PropsWithChildren, ReactNode } from 'react';
import { useMemo } from 'react';
import './tokens.css';

export type DesignScheme = 'light' | 'dark';
export type DesignDensity = 'compact' | 'comfortable';

export interface DesignAppearance {
  scheme: DesignScheme;
  density: DesignDensity;
  direction: 'ltr' | 'rtl';
}

const palette = {
  light: {
    primary: '#006b5f',
    background: '#f5f7fb',
    paper: '#ffffff',
    text: '#172033',
  },
  dark: {
    primary: '#5eead4',
    background: '#0d1c2f',
    paper: '#11253c',
    text: '#edf5ff',
  },
} as const;

export function createRatanTheme(appearance: DesignAppearance) {
  const colors = palette[appearance.scheme];
  const compact = appearance.density === 'compact';
  return createTheme({
    direction: appearance.direction,
    palette: {
      mode: appearance.scheme,
      primary: { main: colors.primary },
      background: { default: colors.background, paper: colors.paper },
      text: { primary: colors.text },
    },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: compact ? 12 : 14,
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: { defaultProps: { size: compact ? 'small' : 'medium', disableElevation: true } },
      MuiTextField: { defaultProps: { size: compact ? 'small' : 'medium' } },
    },
  });
}

export function DesignSystemProvider({
  appearance,
  children,
}: PropsWithChildren<{ appearance: DesignAppearance }>) {
  const theme = useMemo(
    () => createRatanTheme(appearance),
    [appearance.density, appearance.direction, appearance.scheme],
  );
  return (
    <ThemeProvider theme={theme}>
      <div
        className="ratan-design-root"
        data-testid="ratan-design-root"
        data-ratan-theme={appearance.scheme}
        data-ratan-density={appearance.density}
        dir={appearance.direction}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

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

export interface ButtonProps
  extends Omit<MuiButtonProps, 'color' | 'size' | 'variant'> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  const muiVariant = variant === 'ghost' ? 'text' : variant === 'primary' ? 'contained' : 'outlined';
  return <StyledButton {...props} variant={muiVariant} data-ratan-variant={variant} />;
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

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, 'label' | 'onChange' | 'size' | 'value'> {
  id: string;
  label: string;
  value: string;
  onChange(value: string): void;
}

export function TextField({ onChange, ...props }: TextFieldProps) {
  return (
    <StyledTextField
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      variant="outlined"
    />
  );
}

export type StatusTone = 'ready' | 'review' | 'blocked' | 'neutral';

const StyledStatusBadge = styled(Chip)({
  height: 'calc(var(--ratan-control-height) * 0.75)',
  borderRadius: 'var(--ratan-radius-pill)',
  fontSize: 'var(--ratan-font-size-label)',
  fontWeight: 'var(--ratan-font-weight-strong)',
  '&[data-status="ready"]': {
    color: 'var(--ratan-color-status-ready-content)',
    background: 'var(--ratan-color-status-ready-surface)',
  },
  '&[data-status="review"]': {
    color: 'var(--ratan-color-status-review-content)',
    background: 'var(--ratan-color-status-review-surface)',
  },
  '&[data-status="blocked"]': {
    color: 'var(--ratan-color-status-blocked-content)',
    background: 'var(--ratan-color-status-blocked-surface)',
  },
  '&[data-status="neutral"]': {
    color: 'var(--ratan-color-status-neutral-content)',
    background: 'var(--ratan-color-status-neutral-surface)',
  },
});

export interface StatusBadgeProps {
  status?: StatusTone;
  children: ReactNode;
}

export function StatusBadge({ status = 'neutral', children }: StatusBadgeProps) {
  return <StyledStatusBadge data-status={status} label={children} size="small" />;
}
