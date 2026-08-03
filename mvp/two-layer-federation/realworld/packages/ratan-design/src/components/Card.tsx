import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <section
      {...props}
      className={['ratan-card', className].filter(Boolean).join(' ')}
      data-ratan-component="card"
    >
      {title || description || actions ? (
        <header className="ratan-card-header">
          <div>
            {title ? <h2 className="ratan-card-title">{title}</h2> : null}
            {description ? <p className="ratan-card-description">{description}</p> : null}
          </div>
          {actions ? <div className="ratan-card-actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="ratan-card-body">{children}</div>
    </section>
  );
}
