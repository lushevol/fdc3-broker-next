import {
  useId,
  type ReactNode,
} from 'react';
import { Button } from './Button';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'error';

export interface InlineAlertProps {
  readonly tone: InlineAlertTone;
  readonly title?: string;
  readonly message: ReactNode;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function InlineAlert({
  tone,
  title,
  message,
  actionLabel,
  onAction,
}: InlineAlertProps) {
  const titleId = useId();
  return (
    <div
      className="ratan-inline-alert"
      data-ratan-component="inline-alert"
      data-ratan-tone={tone}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-labelledby={title ? titleId : undefined}
    >
      <span className="ratan-inline-alert-marker" aria-hidden="true" />
      <div className="ratan-inline-alert-content">
        {title ? (
          <strong id={titleId} className="ratan-inline-alert-title">
            {title}
          </strong>
        ) : null}
        <div className="ratan-inline-alert-message">{message}</div>
      </div>
      {actionLabel && onAction ? (
        <Button variant="ghost" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
