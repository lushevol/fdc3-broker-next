import type { ReactNode } from 'react';
import { Button } from './Button';
import { Dialog, type DialogWidth } from './Dialog';

export type ConfirmationTone = 'default' | 'danger';

export interface ConfirmationDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: ReactNode;
  readonly confirmLabel: string;
  readonly cancelLabel?: string;
  readonly tone?: ConfirmationTone;
  readonly loading?: boolean;
  readonly confirmDisabled?: boolean;
  readonly width?: DialogWidth;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  confirmDisabled = false,
  width = 'small',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onCancel}
      width={width}
      dismissible={!loading}
      actions={
        <>
          <Button variant="ghost" disabled={loading} onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            disabled={loading || confirmDisabled}
            aria-busy={loading || undefined}
            aria-label={loading ? `${confirmLabel} in progress` : undefined}
            onClick={onConfirm}
          >
            {loading ? `${confirmLabel}…` : confirmLabel}
          </Button>
        </>
      }
    >
      {message}
    </Dialog>
  );
}
