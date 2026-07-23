import { useState, useRef, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

export default function TimeInputShowcase() {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('09:30');
  const [time3, setTime3] = useState('');
  const [time4, setTime4] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const TimeInput = ({
    value,
    onChange,
    label = '',
    supportingText = '',
    helperText = '',
    placeholder = 'HH:MM',
    required = false,
    intent = 'neutral' as 'neutral' | 'error' | 'warning' | 'success',
    validationMessage = '',
    disabled = false,
    includeSeconds = false,
  }: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    supportingText?: string;
    helperText?: string;
    placeholder?: string;
    required?: boolean;
    intent?: 'neutral' | 'error' | 'warning' | 'success';
    validationMessage?: string;
    disabled?: boolean;
    includeSeconds?: boolean;
  }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [selectedHour, setSelectedHour] = useState('00');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [selectedSecond, setSelectedSecond] = useState('00');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, '0'),
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, '0'),
    );
    const seconds = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, '0'),
    );

    useEffect(() => {
      setInputValue(value);
      if (value) {
        const parts = value.split(':');
        if (parts.length >= 2) {
          setSelectedHour(parts[0]);
          setSelectedMinute(parts[1]);
          if (includeSeconds && parts.length >= 3) {
            setSelectedSecond(parts[2]);
          }
        }
      }
    }, [value, includeSeconds]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      if (showDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showDropdown]);

    const handleTimeSelect = (
      hour: string,
      minute: string,
      second?: string,
    ) => {
      const newTime = includeSeconds
        ? `${hour}:${minute}:${second}`
        : `${hour}:${minute}`;
      setInputValue(newTime);
      onChange(newTime);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      if (includeSeconds && second) {
        setSelectedSecond(second);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Always update the parent value to allow typing
      onChange(newValue);

      // Validate format for visual feedback (can be used for validation state)
      const timeRegex = includeSeconds
        ? /^\d{2}:\d{2}:\d{2}$/
        : /^\d{2}:\d{2}$/;
      if (timeRegex.test(newValue)) {
        // Parse and update selected values when valid
        const parts = newValue.split(':');
        setSelectedHour(parts[0]);
        setSelectedMinute(parts[1]);
        if (includeSeconds && parts[2]) {
          setSelectedSecond(parts[2]);
        }
      }
    };

    const handleClear = () => {
      setInputValue('');
      onChange('');
      setSelectedHour('00');
      setSelectedMinute('00');
      setSelectedSecond('00');
    };

    const getBorderColor = () => {
      switch (intent) {
        case 'error':
          return 'var(--sc-color-red-500)';
        case 'warning':
          return 'var(--sc-color-amber-500)';
        case 'success':
          return 'var(--sc-color-green-600)';
        default:
          return 'var(--sc-color-grey-300)';
      }
    };

    const getValidationColor = () => {
      switch (intent) {
        case 'error':
          return 'var(--sc-color-red-550)';
        case 'warning':
          return 'var(--sc-color-amber-700)';
        case 'success':
          return 'var(--sc-color-green-700)';
        default:
          return 'var(--sc-color-foundation-content-helper-text)';
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        {label && (
          <div style={{ marginBottom: '8px' }}>
            <label
              style={{
                fontSize: 'var(--sc-text-label-main)',
                lineHeight: '16px',
                color: disabled
                  ? 'var(--sc-color-grey-400)'
                  : 'var(--sc-color-foundation-content-label-text)',
                display: 'block',
              }}
            >
              {label}
              {required && ' *'}
            </label>
            {supportingText && (
              <div
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginTop: '4px',
                }}
              >
                {supportingText}
              </div>
            )}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => !disabled && setShowDropdown(true)}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              height: '32px',
              padding: '0 36px 0 12px',
              backgroundColor: disabled
                ? 'var(--sc-color-grey-50)'
                : 'var(--sc-color-white)',
              border: `1px solid ${getBorderColor()}`,
              borderRadius: '6px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: disabled
                ? 'var(--sc-color-grey-400)'
                : 'var(--sc-color-foundation-content-input-text)',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onFocus={(e) => {
              if (!disabled && intent === 'neutral') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-500)';
              }
            }}
            onBlur={(e) => {
              if (!disabled && intent === 'neutral') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
              }
            }}
          />

          {inputValue && !disabled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--sc-color-grey-300)',
                border: 'none',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X size={12} style={{ color: 'var(--sc-color-white)' }} />
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--sc-color-grey-500)',
                pointerEvents: 'none',
              }}
            >
              <Clock size={16} />
            </div>
          )}
        </div>

        {(helperText || validationMessage) && (
          <div
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: validationMessage
                ? getValidationColor()
                : 'var(--sc-color-foundation-content-helper-text)',
              marginTop: '6px',
            }}
          >
            {validationMessage || helperText}
          </div>
        )}

        {showDropdown && !disabled && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              backgroundColor: 'var(--sc-color-white)',
              border: '1px solid var(--sc-color-grey-300)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {/* Hours column */}
            <div
              style={{
                borderRight: '1px solid var(--sc-color-grey-200)',
                width: '80px',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  fontWeight: '600',
                  color: 'var(--sc-color-foundation-content-header)',
                  backgroundColor: 'var(--sc-color-grey-50)',
                  borderBottom: '1px solid var(--sc-color-grey-200)',
                }}
              >
                Hours
              </div>
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() =>
                      handleTimeSelect(hour, selectedMinute, selectedSecond)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor:
                        selectedHour === hour
                          ? 'var(--sc-color-blue-50)'
                          : 'transparent',
                      color:
                        selectedHour === hour
                          ? 'var(--sc-color-blue-600)'
                          : 'var(--sc-color-foundation-content-body)',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedHour !== hour) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedHour !== hour) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes column */}
            <div
              style={{
                borderRight: includeSeconds
                  ? '1px solid var(--sc-color-grey-200)'
                  : 'none',
                width: '80px',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  fontWeight: '600',
                  color: 'var(--sc-color-foundation-content-header)',
                  backgroundColor: 'var(--sc-color-grey-50)',
                  borderBottom: '1px solid var(--sc-color-grey-200)',
                }}
              >
                Minutes
              </div>
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() =>
                      handleTimeSelect(selectedHour, minute, selectedSecond)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor:
                        selectedMinute === minute
                          ? 'var(--sc-color-blue-50)'
                          : 'transparent',
                      color:
                        selectedMinute === minute
                          ? 'var(--sc-color-blue-600)'
                          : 'var(--sc-color-foundation-content-body)',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMinute !== minute) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMinute !== minute) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>

            {/* Seconds column */}
            {includeSeconds && (
              <div style={{ width: '80px' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    fontWeight: '600',
                    color: 'var(--sc-color-foundation-content-header)',
                    backgroundColor: 'var(--sc-color-grey-50)',
                    borderBottom: '1px solid var(--sc-color-grey-200)',
                  }}
                >
                  Seconds
                </div>
                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {seconds.map((second) => (
                    <button
                      key={second}
                      onClick={() =>
                        handleTimeSelect(selectedHour, selectedMinute, second)
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        backgroundColor:
                          selectedSecond === second
                            ? 'var(--sc-color-blue-50)'
                            : 'transparent',
                        color:
                          selectedSecond === second
                            ? 'var(--sc-color-blue-600)'
                            : 'var(--sc-color-foundation-content-body)',
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSecond !== second) {
                          e.currentTarget.style.backgroundColor =
                            'var(--sc-color-grey-50)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSecond !== second) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {second}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
        Time input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Time input is a specialised form control for selecting or entering time
        values in HH:MM or HH:MM:SS format. Includes dropdown with
        hour/minute/second selectors with headers.
      </p>

      {/* Basic time input */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic time input
        </h3>

        <div style={{ maxWidth: '300px' }}>
          <TimeInput
            value={time1}
            onChange={setTime1}
            label="Select time"
            helperText="Choose a time from the dropdown"
          />
        </div>
      </section>

      {/* With pre-filled value */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With pre-filled value
        </h3>

        <div style={{ maxWidth: '300px' }}>
          <TimeInput
            value={time2}
            onChange={setTime2}
            label="Appointment time"
            supportingText="Scheduled appointment time"
            helperText={`Your appointment is at ${time2 || '--:--'}`}
          />
        </div>
      </section>

      {/* With seconds */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With seconds (HH:MM:SS)
        </h3>

        <div style={{ maxWidth: '300px' }}>
          <TimeInput
            value={time4}
            onChange={setTime4}
            label="Log timestamp"
            placeholder="HH:MM:SS"
            includeSeconds
            helperText="Include seconds for precise timing"
          />
        </div>
      </section>

      {/* With validation states */}
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
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '300px',
          }}
        >
          <TimeInput
            value={time3}
            onChange={setTime3}
            label="Meeting time"
            required
            intent={time3 ? 'success' : 'error'}
            validationMessage={
              time3 ? 'Time selected' : 'This field is required'
            }
          />

          <TimeInput
            value="14:30"
            onChange={() => {}}
            label="Warning state"
            intent="warning"
            validationMessage="Selected time is outside business hours"
          />

          <TimeInput
            value=""
            onChange={() => {}}
            label="Disabled time input"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
