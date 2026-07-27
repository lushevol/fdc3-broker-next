import {
  Switch as ReactAriaSwitch,
  type SwitchProps as ReactAriaSwitchProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface SwitchProps {
  readonly label: ReactNode;
  readonly selected: boolean;
  readonly onChange: (selected: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly name?: string;
}

export function Switch({
  label,
  selected,
  onChange,
  disabled = false,
  className,
  name,
}: SwitchProps) {
  const props: ReactAriaSwitchProps = {
    isSelected: selected,
    isDisabled: disabled,
    onChange,
    name,
  };
  return (
    <ReactAriaSwitch
      {...props}
      className={['ratan-switch', className].filter(Boolean).join(' ')}
      data-ratan-component="switch"
    >
      <span className="ratan-switch-track" aria-hidden="true">
        <span className="ratan-switch-thumb" />
      </span>
      <span className="ratan-switch-label">{label}</span>
    </ReactAriaSwitch>
  );
}
