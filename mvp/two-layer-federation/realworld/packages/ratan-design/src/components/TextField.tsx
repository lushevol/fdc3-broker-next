import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as ReactAriaTextField,
} from 'react-aria-components';
import type {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

export interface TextFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly type?: HTMLInputTypeAttribute;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly name?: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly autoComplete?: string;
  readonly className?: string;
  readonly inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'value' | 'onChange' | 'type'
  >;
  readonly onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  helperText,
  error = false,
  required = false,
  disabled = false,
  readOnly = false,
  name,
  placeholder,
  autoFocus,
  autoComplete,
  className,
  inputProps,
  onBlur,
}: TextFieldProps) {
  return (
    <ReactAriaTextField
      className={['ratan-field', className].filter(Boolean).join(' ')}
      data-ratan-component="text-field"
      isDisabled={disabled}
      isInvalid={error}
      isReadOnly={readOnly}
      isRequired={required}
      name={name}
      value={value}
      onChange={onChange}
    >
      <Label className="ratan-field-label">{label}</Label>
      <Input
        {...inputProps}
        id={id}
        className="ratan-field-input"
        data-ratan-control="text-field"
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onBlur={onBlur}
      />
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
    </ReactAriaTextField>
  );
}
