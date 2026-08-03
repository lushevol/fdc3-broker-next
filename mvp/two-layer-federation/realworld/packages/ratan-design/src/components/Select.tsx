import {
  Button as ReactAriaButton,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as ReactAriaSelect,
  SelectValue,
  Text,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface SelectOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectProps {
  readonly id: string;
  readonly label: string;
  readonly options: readonly SelectOption[];
  readonly selectedId?: string;
  readonly onChange: (id: string) => void;
  readonly placeholder?: string;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function Select({
  id,
  label,
  options,
  selectedId,
  onChange,
  placeholder = 'Select an option',
  helperText,
  error = false,
  required = false,
  disabled = false,
  className,
}: SelectProps) {
  return (
    <ReactAriaSelect
      className={['ratan-field ratan-select', className].filter(Boolean).join(' ')}
      data-ratan-component="select"
      isDisabled={disabled}
      isInvalid={error}
      isRequired={required}
      selectedKey={selectedId ?? null}
      onSelectionChange={(key) => onChange(String(key))}
    >
      <Label className="ratan-field-label">{label}</Label>
      <ReactAriaButton id={id} className="ratan-select-trigger">
        <SelectValue>{({ selectedText }) => selectedText || placeholder}</SelectValue>
        <span aria-hidden="true">⌄</span>
      </ReactAriaButton>
      <Popover className="ratan-select-popover">
        <ListBox className="ratan-select-list" items={options}>
          {(option) => (
            <ListBoxItem
              className="ratan-select-option"
              id={option.id}
              isDisabled={option.disabled}
              textValue={option.label}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
      {helperText ? (
        error ? (
          <FieldError className="ratan-field-message ratan-field-error">{helperText}</FieldError>
        ) : (
          <Text className="ratan-field-message" slot="description">{helperText}</Text>
        )
      ) : null}
    </ReactAriaSelect>
  );
}
