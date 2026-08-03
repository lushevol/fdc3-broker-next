import {
  FieldError,
  Group,
  Input,
  Label,
  NumberField as ReactAriaNumberField,
  Text,
} from 'react-aria-components';
import type {
  FocusEventHandler,
  ReactNode,
} from 'react';

export interface NumberFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: number | null;
  readonly onChange: (value: number | null) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly name?: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly className?: string;
  readonly onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  helperText,
  error = false,
  required = false,
  disabled = false,
  readOnly = false,
  name,
  placeholder,
  autoFocus,
  className,
  onBlur,
}: NumberFieldProps) {
  return (
    <ReactAriaNumberField
      className={['ratan-field', 'ratan-number-field', className]
        .filter(Boolean)
        .join(' ')}
      data-ratan-component="number-field"
      isDisabled={disabled}
      isInvalid={error}
      isReadOnly={readOnly}
      isRequired={required}
      minValue={min}
      maxValue={max}
      step={step}
      name={name}
      value={value ?? Number.NaN}
      onChange={(nextValue) =>
        onChange(Number.isNaN(nextValue) ? null : nextValue)
      }
    >
      <Label className="ratan-field-label">{label}</Label>
      <Group className="ratan-field-control">
        <Input
          id={id}
          className="ratan-field-input"
          data-ratan-control="number-field"
          placeholder={placeholder}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      </Group>
      {helperText ? (
        error ? (
          <FieldError className="ratan-field-message ratan-field-error">
            {helperText}
          </FieldError>
        ) : (
          <Text className="ratan-field-message" slot="description">
            {helperText}
          </Text>
        )
      ) : null}
    </ReactAriaNumberField>
  );
}
