import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
  segmentCount?: number;
  intent?: 'neutral' | 'error' | 'success';
  validationMessage?: string;
  groupLabel?: string;
  helperText?: string;
  isHidden?: boolean;
}

const OTPInput = ({
  segmentCount = 6,
  intent = 'neutral',
  validationMessage,
  groupLabel,
  helperText,
  isHidden = false,
}: OTPInputProps) => {
  const [values, setValues] = useState<string[]>(Array(segmentCount).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getBorderColor = () => {
    if (intent === 'error') return 'var(--sc-color-red-500)';
    if (intent === 'success') return 'var(--sc-color-green-600)';
    if (focusedIndex >= 0) return 'var(--sc-color-blue-500)';
    return 'var(--sc-color-grey-300)';
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Auto-focus next input
    if (value && index < segmentCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < segmentCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newValues = [...values];

    for (let i = 0; i < Math.min(pasteData.length, segmentCount); i++) {
      newValues[i] = pasteData[i];
    }

    setValues(newValues);

    // Focus on the next empty cell or the last one
    const nextIndex = Math.min(pasteData.length, segmentCount - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div>
      {groupLabel && (
        <label
          style={{
            display: 'block',
            fontSize: 'var(--sc-text-label-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-label-text)',
            marginBottom: '8px',
          }}
        >
          {groupLabel}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type={isHidden ? 'password' : 'text'}
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            style={{
              width: '44px',
              height: '44px',
              textAlign: 'center',
              fontSize: 'var(--sc-text-title-sub)',
              lineHeight: '24px',
              fontWeight: '500',
              color: 'var(--sc-color-foundation-content-body)',
              backgroundColor: 'var(--sc-color-white)',
              border: `1px solid ${focusedIndex === index ? 'var(--sc-color-blue-500)' : getBorderColor()}`,
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
          />
        ))}
      </div>

      {helperText && (
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {helperText}
        </p>
      )}

      {validationMessage && (
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color:
              intent === 'error'
                ? 'var(--sc-color-red-550)'
                : 'var(--sc-color-green-700)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
};

export default function OTPPinInputShowcase() {
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
        OTP and PIN input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        OTP and PIN inputs provide a controlled numeric entry experience across
        multiple cells. Each cell accepts exactly one digit, and focus moves
        automatically as users type.
      </p>

      {/* 6-segment OTP */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          6-segment OTP
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <OTPInput
            segmentCount={6}
            groupLabel="Enter verification code"
            helperText="Enter the 6-digit code sent to your email"
          />
        </div>
      </section>

      {/* 4-segment PIN */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          4-segment PIN
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <OTPInput
            segmentCount={4}
            groupLabel="Enter PIN"
            isHidden={true}
            helperText="Enter your 4-digit PIN"
          />
        </div>
      </section>

      {/* Split layout (3-3) */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Split layout (3-3 segment)
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-label-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-label-text)',
                marginBottom: '8px',
              }}
            >
              Enter authentication code
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <OTPInput segmentCount={3} />
              <span
                style={{
                  fontSize: 'var(--sc-text-title-main)',
                  lineHeight: '26px',
                  color: 'var(--sc-color-grey-400)',
                }}
              >
                -
              </span>
              <OTPInput segmentCount={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Error state */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Error state
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <OTPInput
            segmentCount={6}
            groupLabel="Enter verification code"
            intent="error"
            validationMessage="Invalid code. Please try again"
          />
        </div>
      </section>

      {/* Success state */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Success state
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <OTPInput
            segmentCount={6}
            groupLabel="Enter verification code"
            intent="success"
            validationMessage="Code verified successfully"
          />
        </div>
      </section>
    </div>
  );
}
