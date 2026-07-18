import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material';
import { useId, type ReactNode } from 'react';

export type DialogWidth = 'small' | 'medium' | 'large';

export interface DialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
  readonly onClose: () => void;
  readonly width?: DialogWidth;
  readonly dismissible?: boolean;
}

const maxWidths: Record<DialogWidth, 'sm' | 'md' | 'lg'> = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
};

const StyledDialog = styled(MuiDialog)({
  '& .MuiDialog-paper': {
    color: 'var(--ratan-color-content-primary)',
    background: 'var(--ratan-color-surface-raised)',
    border: '1px solid var(--ratan-color-border-subtle)',
    borderRadius: 'var(--ratan-radius-control)',
  },
  '& .MuiDialogTitle-root': {
    paddingInlineEnd: 'calc(var(--ratan-control-height) + var(--ratan-control-gap))',
    fontSize: 'var(--ratan-font-size-body)',
    fontWeight: 'var(--ratan-font-weight-strong)',
  },
  '& .MuiDialogContentText-root': { color: 'var(--ratan-color-content-secondary)' },
  '& .MuiDialogActions-root': { padding: 'var(--ratan-control-padding-inline)' },
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  insetBlockStart: 'var(--ratan-control-gap)',
  insetInlineEnd: 'var(--ratan-control-gap)',
  color: 'var(--ratan-color-content-secondary)',
  '&.Mui-focusVisible': {
    outline: 'var(--ratan-focus-width) solid var(--ratan-color-focus-ring)',
    outlineOffset: 'var(--ratan-focus-offset)',
  },
});

export function Dialog({
  open,
  title,
  description,
  children,
  actions,
  onClose,
  width = 'small',
  dismissible = true,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <StyledDialog
      open={open}
      onClose={dismissible ? onClose : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      maxWidth={maxWidths[width]}
      fullWidth
      PaperProps={{ 'data-ratan-width': width } as React.HTMLAttributes<HTMLDivElement>}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      {dismissible ? (
        <CloseButton aria-label={`Close ${title}`} onClick={onClose} size="small">
          <span aria-hidden="true">×</span>
        </CloseButton>
      ) : null}
      <DialogContent>
        {description ? <DialogContentText id={descriptionId}>{description}</DialogContentText> : null}
        {children}
      </DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </StyledDialog>
  );
}
