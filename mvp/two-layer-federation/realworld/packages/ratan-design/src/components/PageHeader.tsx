import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  readonly eyebrow?: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      {...props}
      className={['ratan-page-header', className].filter(Boolean).join(' ')}
      data-ratan-component="page-header"
    >
      <div className="ratan-page-header-content">
        {eyebrow ? <span className="ratan-page-header-eyebrow">{eyebrow}</span> : null}
        <h1 className="ratan-page-header-title">{title}</h1>
        {description ? (
          <p className="ratan-page-header-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="ratan-page-header-actions">{actions}</div> : null}
    </header>
  );
}
