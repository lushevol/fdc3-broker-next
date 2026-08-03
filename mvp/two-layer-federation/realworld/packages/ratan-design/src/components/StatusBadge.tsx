import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

export type StatusTone = 'ready' | 'review' | 'blocked' | 'neutral';

export interface StatusBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  readonly status?: StatusTone;
  readonly children: ReactNode;
}

export function StatusBadge({
  status = 'neutral',
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      {...props}
      className={['ratan-status-badge', className].filter(Boolean).join(' ')}
      data-ratan-component="status-badge"
      data-status={status}
    >
      {children}
    </span>
  );
}
