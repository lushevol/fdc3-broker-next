import { useState } from 'react';
import { Check, Minus } from 'lucide-react';

export default function CheckboxShowcase() {
  // State for basic checkboxes
  const [isUnchecked, setIsUnchecked] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  // State for labeled checkboxes
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // State for checkbox group
  const [option1, setOption1] = useState(true);
  const [option2, setOption2] = useState(false);
  const [option3, setOption3] = useState(true);

  // Calculate select all state
  const allSelected = option1 && option2 && option3;
  const someSelected = (option1 || option2 || option3) && !allSelected;

  const handleSelectAll = () => {
    const newValue = !allSelected;
    setOption1(newValue);
    setOption2(newValue);
    setOption3(newValue);
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
        Checkboxes
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Checkboxes allow users to select one or more items from a set. Checkbox
        size: 16px, label gap: 8px, description baseline gap: 4px. Hit target:
        minimum 44×44px for accessibility.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
        }}
      >
        {/* Basic states */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '20px',
            }}
          >
            Basic states
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Unchecked */}
            <label
              onClick={() => setIsUnchecked(!isUnchecked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `2px solid ${isUnchecked ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                  backgroundColor: isUnchecked
                    ? 'var(--sc-color-blue-500)'
                    : 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sc-color-white)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isUnchecked && <Check size={16} />}
              </div>
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                }}
              >
                Unchecked
              </span>
            </label>

            {/* Checked */}
            <label
              onClick={() => setIsChecked(!isChecked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `2px solid ${isChecked ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                  backgroundColor: isChecked
                    ? 'var(--sc-color-blue-500)'
                    : 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sc-color-white)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isChecked && <Check size={16} />}
              </div>
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                }}
              >
                Checked
              </span>
            </label>

            {/* Indeterminate */}
            <label
              onClick={() => setIsIndeterminate(!isIndeterminate)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `2px solid ${isIndeterminate ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                  backgroundColor: isIndeterminate
                    ? 'var(--sc-color-blue-500)'
                    : 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sc-color-white)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isIndeterminate && <Minus size={16} />}
              </div>
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                }}
              >
                Indeterminate
              </span>
            </label>

            {/* Disabled unchecked */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: '2px solid var(--sc-color-grey-300)',
                  backgroundColor: 'var(--sc-color-grey-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-disabled-text)',
                }}
              >
                Disabled unchecked
              </span>
            </label>

            {/* Disabled checked */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: '2px solid var(--sc-color-grey-300)',
                  backgroundColor: 'var(--sc-color-grey-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sc-color-white)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                <Check />
              </div>
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-disabled-text)',
                }}
              >
                Disabled checked
              </span>
            </label>
          </div>
        </section>

        {/* With labels and helper text */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '20px',
            }}
          >
            With labels and helper text
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <label
                onClick={() => setEmailNotifications(!emailNotifications)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${emailNotifications ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    backgroundColor: emailNotifications
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sc-color-white)',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {emailNotifications && <Check size={16} />}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginBottom: '4px',
                    }}
                  >
                    Receive email notifications
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-helper-text)',
                    }}
                  >
                    Get notified about important updates via email
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label
                onClick={() => setSmsNotifications(!smsNotifications)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${smsNotifications ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    backgroundColor: smsNotifications
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {smsNotifications && <Check size={16} />}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginBottom: '4px',
                    }}
                  >
                    Receive SMS notifications
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-helper-text)',
                    }}
                  >
                    Get notified about urgent matters via text message
                  </div>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Checkbox group */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '8px',
            }}
          >
            Checkbox group
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-helper-text)',
              marginBottom: '16px',
            }}
          >
            Select your preferences
          </p>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <label
              onClick={handleSelectAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `2px solid ${allSelected || someSelected ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                  backgroundColor:
                    allSelected || someSelected
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sc-color-white)',
                  transition: 'all 0.15s ease',
                }}
              >
                {allSelected && <Check size={16} />}
                {someSelected && !allSelected && <Minus size={16} />}
              </div>
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  fontWeight: '500',
                }}
              >
                Select all
              </span>
            </label>

            <div
              style={{
                paddingLeft: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <label
                onClick={() => setOption1(!option1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${option1 ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    backgroundColor: option1
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sc-color-white)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {option1 && <Check size={16} />}
                </div>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Option one
                </span>
              </label>

              <label
                onClick={() => setOption2(!option2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${option2 ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    backgroundColor: option2
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {option2 && <Check size={16} />}
                </div>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Option two
                </span>
              </label>

              <label
                onClick={() => setOption3(!option3)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${option3 ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    backgroundColor: option3
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sc-color-white)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {option3 && <Check size={16} />}
                </div>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Option three
                </span>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
