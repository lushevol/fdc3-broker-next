import {
  Button as ReactAriaButton,
  type ButtonProps as ReactAriaButtonProps,
} from 'react-aria-components';
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'children' | 'value'
  > {
  readonly variant?: ButtonVariant;
  readonly pending?: boolean;
  readonly value?: string;
  readonly children: ReactNode;
}

function classes(className?: string): string {
  return ['ratan-button', className].filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  disabled = false,
  pending = false,
  className,
  children,
  'aria-busy': ariaBusy,
  ...props
}: ButtonProps) {
  const isPending = pending || ariaBusy === true || ariaBusy === 'true';
  const reactAriaProps = props as unknown as ReactAriaButtonProps;
  return (
    <ReactAriaButton
      {...reactAriaProps}
      aria-busy={isPending || undefined}
      className={classes(className)}
      data-ratan-component="button"
      data-ratan-variant={variant}
      isDisabled={disabled}
      isPending={isPending}
    >
      {children}
    </ReactAriaButton>
  );
}
