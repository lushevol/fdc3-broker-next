import { IconButton } from './IconButton';

export interface ToastProps {
  readonly message: string;
  readonly onDismiss?: () => void;
  readonly tone?: 'info' | 'success' | 'error';
  readonly className?: string;
}

export function Toast({
  message,
  onDismiss,
  tone = 'info',
  className,
}: ToastProps) {
  return (
    <div
      className={['ratan-toast', className].filter(Boolean).join(' ')}
      data-ratan-component="toast"
      data-ratan-tone={tone}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span>{message}</span>
      {onDismiss ? (
        <IconButton
          label="Dismiss notification"
          icon="×"
          variant="ghost"
          onClick={onDismiss}
        />
      ) : null}
    </div>
  );
}
