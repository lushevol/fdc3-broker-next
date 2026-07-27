import type { ReactNode } from 'react';

export interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function ErrorState({
  title,
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <section
      className={['ratan-error-state', className].filter(Boolean).join(' ')}
      data-ratan-component="error-state"
      role="alert"
    >
      <span className="ratan-error-state-marker" aria-hidden="true">!</span>
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {action ? <div className="ratan-error-state-action">{action}</div> : null}
    </section>
  );
}
