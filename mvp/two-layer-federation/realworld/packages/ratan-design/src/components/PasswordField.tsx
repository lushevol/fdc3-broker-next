import {
  Button as ReactAriaButton,
  FieldError,
  Group,
  Input,
  Label,
  Text,
  TextField as ReactAriaTextField,
} from 'react-aria-components';
import {
  useState,
  type FocusEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface PasswordFieldProps {
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
  readonly autoFocus?: boolean;
  readonly autoComplete?: string;
  readonly className?: string;
  readonly revealLabel?: string;
  readonly hideLabel?: string;
  readonly inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'value' | 'onChange' | 'type'
  >;
  readonly onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function PasswordField({
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
  autoFocus,
  autoComplete = 'current-password',
  className,
  revealLabel = 'Show password',
  hideLabel = 'Hide password',
  inputProps,
  onBlur,
}: PasswordFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <ReactAriaTextField
      className={['ratan-field', className].filter(Boolean).join(' ')}
      data-ratan-component="password-field"
      isDisabled={disabled}
      isInvalid={error}
      isReadOnly={readOnly}
      isRequired={required}
      name={name}
      value={value}
      onChange={onChange}
    >
      <Label className="ratan-field-label">{label}</Label>
      <Group className="ratan-password-group">
        <Input
          {...inputProps}
          id={id}
          className="ratan-field-input ratan-password-input"
          data-ratan-control="password-field"
          type={isRevealed ? 'text' : 'password'}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          onBlur={onBlur}
        />
        <ReactAriaButton
          className="ratan-password-toggle"
          aria-label={isRevealed ? hideLabel : revealLabel}
          onPress={() => setIsRevealed((current) => !current)}
        >
          <span aria-hidden="true">{isRevealed ? 'Hide' : 'Show'}</span>
        </ReactAriaButton>
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
    </ReactAriaTextField>
  );
}
