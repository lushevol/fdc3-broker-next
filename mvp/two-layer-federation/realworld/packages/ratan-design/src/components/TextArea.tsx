import {
  FieldError,
  Label,
  Text,
  TextArea as ReactAriaTextArea,
  TextField as ReactAriaTextField,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface TextAreaProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly name?: string;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly className?: string;
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  helperText,
  error = false,
  required = false,
  disabled = false,
  readOnly = false,
  name,
  placeholder,
  rows = 5,
  className,
}: TextAreaProps) {
  return (
    <ReactAriaTextField
      className={['ratan-field', className].filter(Boolean).join(' ')}
      data-ratan-component="text-area"
      isDisabled={disabled}
      isInvalid={error}
      isReadOnly={readOnly}
      isRequired={required}
      name={name}
      value={value}
      onChange={onChange}
    >
      <Label className="ratan-field-label">{label}</Label>
      <ReactAriaTextArea
        id={id}
        className="ratan-field-input ratan-text-area"
        data-ratan-control="text-area"
        placeholder={placeholder}
        rows={rows}
      />
      {helperText ? (
        error ? (
          <FieldError className="ratan-field-message ratan-field-error">{helperText}</FieldError>
        ) : (
          <Text className="ratan-field-message" slot="description">{helperText}</Text>
        )
      ) : null}
    </ReactAriaTextField>
  );
}
