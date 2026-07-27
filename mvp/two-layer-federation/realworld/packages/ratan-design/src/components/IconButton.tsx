import type { ReactNode } from 'react';
import {
  Button,
  type ButtonProps,
  type ButtonVariant,
} from './Button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'aria-label' | 'children'> {
  readonly label: string;
  readonly icon: ReactNode;
  readonly variant?: ButtonVariant;
}

export function IconButton({
  label,
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      aria-label={label}
      className={['ratan-icon-button', className].filter(Boolean).join(' ')}
    >
      <span aria-hidden="true">{icon}</span>
    </Button>
  );
}
