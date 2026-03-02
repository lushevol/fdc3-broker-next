import { useState } from 'react';

const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  helperText = '',
  validationText = '',
  intent = 'neutral' as 'neutral' | 'error' | 'warning' | 'success',
  disabled = false,
  required = false,
  prefix = '',
  suffix = '',
  iconLeading,
  maxLength,
  showCharacterCount = false,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  validationText?: string;
  intent?: 'neutral' | 'error' | 'warning' | 'success';
  disabled?: boolean;
  required?: boolean;
  prefix?: string;
  suffix?: string;
  iconLeading?: React.ReactNode;
  maxLength?: number;
  showCharacterCount?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getBorderColor = () => {
    if (disabled) return 'var(--sc-color-grey-200)';
    if (intent === 'error') return 'var(--sc-color-red-500)';
    if (intent === 'warning') return 'var(--sc-color-amber-500)';
    if (intent === 'success') return 'var(--sc-color-green-500)';
    if (isFocused) return 'var(--sc-color-blue-500)';
    if (isHovered) return 'var(--sc-color-blue-200)';
    return 'var(--sc-color-grey-300)';
  };

  const getValidationColor = () => {
    if (intent === 'error') return 'var(--sc-color-red-500)';
    if (intent === 'warning') return 'var(--sc-color-amber-700)';
    if (intent === 'success') return 'var(--sc-color-green-700)';
    return 'var(--sc-color-foundation-content-helper-text)';
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            color: disabled
              ? 'var(--sc-color-grey-400)'
              : 'var(--sc-color-foundation-content-body)',
            marginBottom: '4px',
            fontWeight: '500',
          }}
        >
          {label}
          {required && ' *'}
        </label>
      )}

      <div
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          border: `1px solid ${getBorderColor()}`,
          borderRadius: '6px',
          backgroundColor: disabled
            ? 'var(--sc-color-grey-50)'
            : 'var(--sc-color-white)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow:
            isFocused && !disabled
              ? '0 0 0 3px var(--sc-color-blue-100)'
              : 'none',
          overflow: 'hidden',
        }}
      >
        {iconLeading && (
          <div
            style={{
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--sc-color-grey-600)',
            }}
          >
            {iconLeading}
          </div>
        )}

        {prefix && (
          <div
            style={{
              padding: '0 12px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-grey-600)',
              borderRight: '1px solid var(--sc-color-grey-200)',
            }}
          >
            {prefix}
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => {
            e.stopPropagation();
            onChange(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          style={{
            flex: 1,
            height: '100%',
            padding: '0 12px',
            border: 'none',
            outline: 'none',
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            backgroundColor: 'transparent',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />

        {suffix && (
          <div
            style={{
              padding: '0 12px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-grey-600)',
              borderLeft: '1px solid var(--sc-color-grey-200)',
            }}
          >
            {suffix}
          </div>
        )}

        {value && !disabled && isFocused && (
          <button
            onClick={() => onChange('')}
            style={{
              width: '20px',
              height: '20px',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              backgroundColor: 'var(--sc-color-grey-300)',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--sc-color-white)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-grey-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-grey-300)';
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" fill="currentColor" />
              <path
                d="M8 4L4 8M4 4L8 8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {(helperText || validationText || showCharacterCount) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: validationText
                ? getValidationColor()
                : 'var(--sc-color-foundation-content-helper-text)',
            }}
          >
            {validationText || helperText}
          </div>
          {showCharacterCount && maxLength && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function TextInputShowcase() {
  // State for all inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('JohnDoe');
  const [website, setWebsite] = useState('');
  const [amount, setAmount] = useState('');
  const [weight, setWeight] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [warningUsername, setWarningUsername] = useState('admin');
  const [successCode, setSuccessCode] = useState('ABC123');
  const [bio, setBio] = useState('Product designer based in Singapore');
  const [accountId, setAccountId] = useState('ACC-2024-001');

  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Text input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Text input is a foundational form control for single-line text entry. It
        supports labels, helper text, character counts, validation, and
        prefix/suffix.
      </p>

      {/* Basic inputs */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic text inputs
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <TextInput
            label="Email address"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            helperText="We'll never share your email"
            required
          />

          <TextInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter password"
            helperText="Must be at least 8 characters"
            required
          />

          <TextInput
            label="Username"
            value={username}
            onChange={setUsername}
            helperText="This field is optional"
          />
        </div>
      </section>

      {/* With prefix/suffix */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With prefix and suffix
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <TextInput
            label="Website"
            value={website}
            onChange={setWebsite}
            placeholder="example.com"
            prefix="https://"
            helperText="Enter your website URL"
          />

          <TextInput
            label="Amount"
            value={amount}
            onChange={setAmount}
            placeholder="0.00"
            prefix="SGD"
            helperText="Enter the transaction amount"
          />

          <TextInput
            label="Weight"
            value={weight}
            onChange={setWeight}
            placeholder="0"
            suffix="kg"
            helperText="Enter weight in kilograms"
          />
        </div>
      </section>

      {/* Validation states */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Validation states
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <TextInput
            label="Email"
            value={errorEmail}
            onChange={setErrorEmail}
            placeholder="Enter email"
            intent="error"
            validationText="Email address is required"
            required
          />

          <TextInput
            label="Username"
            value={warningUsername}
            onChange={setWarningUsername}
            intent="warning"
            validationText="Username already exists"
          />

          <TextInput
            label="Verification code"
            value={successCode}
            onChange={setSuccessCode}
            intent="success"
            validationText="Code verified successfully"
          />
        </div>
      </section>

      {/* With character count */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With character count
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <TextInput
            label="Bio"
            value={bio}
            onChange={setBio}
            placeholder="Tell us about yourself"
            maxLength={100}
            showCharacterCount
            helperText="Brief description for your profile"
          />
        </div>
      </section>

      {/* Disabled state */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Disabled state
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <TextInput
            label="Account ID"
            value={accountId}
            onChange={setAccountId}
            disabled
            helperText="This field cannot be edited"
          />
        </div>
      </section>
    </div>
  );
}
