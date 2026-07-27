import {
  Form as ReactAriaForm,
  type FormProps as ReactAriaFormProps,
} from 'react-aria-components';
import type {
  FormHTMLAttributes,
  ReactNode,
} from 'react';

export interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
  readonly children: ReactNode;
  readonly validationErrors?: Readonly<Record<string, string | string[]>>;
}

export function Form({
  children,
  className,
  validationErrors,
  ...props
}: FormProps) {
  return (
    <ReactAriaForm
      {...props as ReactAriaFormProps}
      className={['ratan-form', className].filter(Boolean).join(' ')}
      data-ratan-component="form"
      validationErrors={validationErrors}
    >
      {children}
    </ReactAriaForm>
  );
}
