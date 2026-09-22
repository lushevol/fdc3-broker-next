import type { ButtonProps as MuiButtonProps, DialogProps as MuiDialogProps } from '@mui/material';
import { CircularProgress as Spinner } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { Button as DesignButton } from './Button.js';
import { Dialog as DesignDialog } from './Dialog.js';
import { LoadingButton as DesignLoadingButton } from './LoadingButton.js';

export const Loader = { default: () => <Spinner aria-label="Loading" /> };

export const Time = {
  Time: ({
    value,
  }: {
    readonly value?: unknown;
    readonly field?: string;
    readonly isAccurateToDay?: boolean;
  }) => <>{String(value ?? '')}</>,
};

export interface BaseCompatibilityButtonProps extends Omit<MuiButtonProps, 'type'> {
  readonly type?: MuiButtonProps['type'] | 'primary';
}

function CompatibilityButton({ type, ...props }: BaseCompatibilityButtonProps) {
  return <DesignButton {...props} type={type === 'primary' ? 'button' : type} />;
}

export const Button = { default: CompatibilityButton };

export interface BaseCompatibilityLoadingButtonProps extends BaseCompatibilityButtonProps {
  readonly loading?: boolean;
  readonly loadingSize?: number;
}

function CompatibilityLoadingButton({
  children,
  disabled,
  loading = false,
  loadingSize = 16,
  startIcon,
  type,
  ...props
}: BaseCompatibilityLoadingButtonProps) {
  return (
    <DesignLoadingButton
      {...props}
      disabled={disabled}
      loading={loading}
      loadingPosition="startIcon"
      loadingSize={loadingSize}
      startIcon={startIcon}
      type={type === 'primary' ? 'button' : type}
    >
      {children}
    </DesignLoadingButton>
  );
}

export const LoadingButton = { default: CompatibilityLoadingButton };

export interface BaseCompatibilityDialogProps extends PropsWithChildren {
  readonly open?: boolean;
  readonly onClose?: () => void;
  readonly titleComponents?: ReactNode;
  readonly actionComponents?: ReactNode;
  readonly defaultWidth?: number | string;
  readonly defaultHeight?: number | string;
  readonly dividers?: boolean;
  readonly disablePortal?: boolean;
  readonly fullScreen?: boolean;
  readonly fullWidth?: boolean;
  readonly scroll?: MuiDialogProps['scroll'];
  readonly disableEscapeKeyDown?: boolean;
  readonly className?: string;
  readonly PaperProps?: MuiDialogProps['PaperProps'];
  readonly 'data-testid'?: string;
}

function cssSize(value: number | string | undefined, fallback: string) {
  if (value === undefined || value === 'auto') return fallback;
  return typeof value === 'number' ? `${value}px` : value;
}

function CompatibilityDialog({
  children,
  open = true,
  onClose,
  titleComponents,
  actionComponents,
  defaultWidth,
  defaultHeight,
  dividers,
  fullScreen,
  fullWidth,
  scroll = 'paper',
  disableEscapeKeyDown,
  className,
  PaperProps,
  'data-testid': testId,
}: BaseCompatibilityDialogProps) {
  const requestedWidth = cssSize(defaultWidth, 'auto');
  const requestedHeight = cssSize(defaultHeight, 'auto');

  return (
    <DesignDialog
      open={open}
      onClose={() => onClose?.()}
      disablePortal={false}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      scroll={scroll}
      disableEscapeKeyDown={disableEscapeKeyDown}
      className={className}
      data-testid={testId}
      maxWidth={false}
      titleComponents={titleComponents}
      actionComponents={actionComponents}
      onCloseButton={onClose}
      titleProps={{
        sx: {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 48,
          padding: '4px 8px 4px 16px',
        },
      }}
      dividers={dividers}
      contentProps={{
        sx: {
          minHeight: 0,
          overflow: 'auto',
          padding: dividers ? undefined : 0,
        },
      }}
      PaperProps={{
        ...PaperProps,
        style: {
          ...PaperProps?.style,
          width: requestedWidth === 'auto' ? 'auto' : `min(${requestedWidth}, calc(100vw - 32px))`,
          height:
            requestedHeight === 'auto' ? 'auto' : `min(${requestedHeight}, calc(100vh - 32px))`,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
          margin: 16,
        },
      }}
    >
      {children}
    </DesignDialog>
  );
}

export const Dialog = { default: CompatibilityDialog };
