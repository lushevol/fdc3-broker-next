import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface FieldGroupProps
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'title'> {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
}

export function FieldGroup({
  title,
  description,
  children,
  className,
  ...props
}: FieldGroupProps) {
  return (
    <fieldset
      {...props}
      className={['ratan-field-group', className].filter(Boolean).join(' ')}
      data-ratan-component="field-group"
    >
      {title ? <legend className="ratan-field-group-title">{title}</legend> : null}
      {description ? <p className="ratan-field-group-description">{description}</p> : null}
      <div className="ratan-field-group-fields">{children}</div>
    </fieldset>
  );
}
