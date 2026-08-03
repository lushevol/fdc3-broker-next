import {
  Link as ReactAriaLink,
  type LinkProps as ReactAriaLinkProps,
} from 'react-aria-components';
import type {
  AnchorHTMLAttributes,
  ReactNode,
} from 'react';

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  readonly children: ReactNode;
  readonly variant?: 'default' | 'button';
}

export function Link({
  children,
  className,
  variant = 'default',
  ...props
}: LinkProps) {
  return (
    <ReactAriaLink
      {...props as ReactAriaLinkProps}
      className={['ratan-link', className].filter(Boolean).join(' ')}
      data-ratan-component="link"
      data-ratan-variant={variant}
    >
      {children}
    </ReactAriaLink>
  );
}
