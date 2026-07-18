import { Alert, AlertTitle, styled } from '@mui/material';
import { useId, type ReactNode } from 'react';
import { Button } from './Button';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'error';

export interface InlineAlertProps {
  readonly tone: InlineAlertTone;
  readonly title?: string;
  readonly message: ReactNode;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

const StyledAlert = styled(Alert)({
  color: 'var(--ratan-color-content-primary)',
  background: 'var(--ratan-color-surface-interactive)',
  border: '1px solid var(--ratan-color-border-subtle)',
  borderRadius: 'var(--ratan-radius-control)',
  '& .MuiAlert-icon': { color: 'currentColor' },
  '&[data-ratan-tone="error"]': {
    color: 'var(--ratan-color-action-danger)',
    borderColor: 'var(--ratan-color-action-danger)',
  },
});

export function InlineAlert({
  tone,
  title,
  message,
  actionLabel,
  onAction,
}: InlineAlertProps) {
  const titleId = useId();
  const action =
    actionLabel && onAction ? (
      <Button variant="ghost" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : undefined;

  return (
    <StyledAlert
      severity={tone}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-labelledby={title ? titleId : undefined}
      data-ratan-tone={tone}
      action={action}
    >
      {title ? <AlertTitle id={titleId}>{title}</AlertTitle> : null}
      {message}
    </StyledAlert>
  );
}
