import {
  ToggleButton as ReactAriaToggleButton,
  type ToggleButtonProps as ReactAriaToggleButtonProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface ToggleButtonProps {
  readonly children: ReactNode;
  readonly selected: boolean;
  readonly onChange: (selected: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly ariaLabel?: string;
}

export function ToggleButton({
  children,
  selected,
  onChange,
  disabled = false,
  className,
  ariaLabel,
}: ToggleButtonProps) {
  const props: ReactAriaToggleButtonProps = {
    isSelected: selected,
    isDisabled: disabled,
    onChange,
    'aria-label': ariaLabel,
  };
  return (
    <ReactAriaToggleButton
      {...props}
      className={['ratan-toggle-button', className].filter(Boolean).join(' ')}
      data-ratan-component="toggle-button"
    >
      {children}
    </ReactAriaToggleButton>
  );
}
