import type { ReactNode } from 'react';

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly icon?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={['ratan-empty-state', className].filter(Boolean).join(' ')}
      data-ratan-component="empty-state"
    >
      {icon ? <span className="ratan-empty-state-icon" aria-hidden="true">{icon}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action ? <div className="ratan-empty-state-action">{action}</div> : null}
    </section>
  );
}
