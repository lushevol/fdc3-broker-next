import { useState } from 'react';
import {
  Check,
  User,
  CreditCard,
  FileText,
  Send,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function StepperShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tabStep, setTabStep] = useState(1);

  const StepperItem = ({
    stepNumber,
    label,
    description = '',
    isActive = false,
    isCompleted = false,
    isLast = false,
    type = 'numeric' as 'numeric' | 'dot' | 'icon',
    icon,
    onClick,
    intent = 'neutral' as 'neutral' | 'error' | 'success',
  }: {
    stepNumber: number;
    label: string;
    description?: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isLast?: boolean;
    type?: 'numeric' | 'dot' | 'icon';
    icon?: React.ReactNode;
    onClick?: () => void;
    intent?: 'neutral' | 'error' | 'success';
  }) => {
    const getStepIndicator = () => {
      if (type === 'dot') {
        return (
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor:
                intent === 'error'
                  ? 'var(--sc-color-red-500)'
                  : intent === 'success'
                    ? 'var(--sc-color-green-500)'
                    : isCompleted
                      ? 'var(--sc-color-blue-500)'
                      : isActive
                        ? 'var(--sc-color-blue-500)'
                        : 'var(--sc-color-grey-300)',
              transition: 'all 0.2s ease',
            }}
          />
        );
      }

      if (type === 'icon' && icon) {
        // Icon steppers show green circle with tick for success, red circle with cross for error
        if (intent === 'success') {
          return (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--sc-color-green-500)',
                border: '2px solid var(--sc-color-green-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sc-color-white)',
                transition: 'all 0.2s ease',
              }}
            >
              <Check size={20} />
            </div>
          );
        }

        if (intent === 'error') {
          return (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--sc-color-red-500)',
                border: '2px solid var(--sc-color-red-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sc-color-white)',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={20} />
            </div>
          );
        }

        return (
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: isCompleted
                ? 'var(--sc-color-blue-500)'
                : isActive
                  ? 'var(--sc-color-blue-100)'
                  : 'var(--sc-color-grey-100)',
              border: `2px solid ${isCompleted ? 'var(--sc-color-blue-500)' : isActive ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompleted
                ? 'var(--sc-color-white)'
                : isActive
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-grey-500)',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </span>
          </div>
        );
      }

      // Numeric type - numbers remain with color for error and success
      const getBorderColor = () => {
        if (intent === 'error') return 'var(--sc-color-red-500)';
        if (intent === 'success') return 'var(--sc-color-green-500)';
        if (isCompleted) return 'var(--sc-color-blue-500)';
        if (isActive) return 'var(--sc-color-blue-500)';
        return 'var(--sc-color-grey-300)';
      };

      const getBackgroundColor = () => {
        if (intent === 'error') return 'var(--sc-color-red-50)';
        if (intent === 'success') return 'var(--sc-color-green-50)';
        if (isCompleted) return 'var(--sc-color-blue-500)';
        if (isActive) return 'var(--sc-color-blue-100)';
        return 'var(--sc-color-grey-100)';
      };

      const getNumberColor = () => {
        if (intent === 'error') return 'var(--sc-color-red-500)';
        if (intent === 'success') return 'var(--sc-color-green-700)';
        if (isCompleted) return 'var(--sc-color-white)';
        if (isActive) return 'var(--sc-color-blue-500)';
        return 'var(--sc-color-grey-500)';
      };

      return (
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: getBackgroundColor(),
            border: `2px solid ${getBorderColor()}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <span
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              fontWeight: '600',
              color: getNumberColor(),
            }}
          >
            {stepNumber}
          </span>
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            onClick={onClick}
            disabled={!isCompleted && !isActive}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 4px',
              cursor: isCompleted || isActive ? 'pointer' : 'default',
            }}
          >
            {getStepIndicator()}
          </button>

          {!isLast && (
            <div
              style={{
                width: '2px',
                flex: 1,
                minHeight: '40px',
                backgroundColor: isCompleted
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-grey-300)',
                transition: 'all 0.2s ease',
              }}
            />
          )}
        </div>

        <div
          style={{
            flex: 1,
            paddingBottom: isLast ? 0 : '20px',
            paddingTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              fontWeight: '500',
              color: isActive
                ? 'var(--sc-color-foundation-content-header)'
                : isCompleted
                  ? 'var(--sc-color-foundation-content-body)'
                  : 'var(--sc-color-grey-500)',
              marginBottom: description ? '4px' : 0,
            }}
          >
            {label}
          </div>
          {description && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const HorizontalStepperItem = ({
    stepNumber,
    label,
    isActive = false,
    isCompleted = false,
    isLast = false,
    onClick,
  }: {
    stepNumber: number;
    label: string;
    isActive?: boolean;
    isCompleted?: boolean;
    isLast?: boolean;
    onClick?: () => void;
  }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* Step circle and connector container */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginBottom: '4px',
            }}
          >
            <button
              onClick={onClick}
              disabled={!isCompleted && !isActive}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 4px',
                cursor: isCompleted || isActive ? 'pointer' : 'default',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? 'var(--sc-color-blue-500)'
                    : isActive
                      ? 'var(--sc-color-blue-100)'
                      : 'var(--sc-color-grey-100)',
                  border: `2px solid ${isCompleted ? 'var(--sc-color-blue-500)' : isActive ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Numeric stepper - always show number, never icons */}
                <span
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    fontWeight: '600',
                    color: isCompleted
                      ? 'var(--sc-color-white)'
                      : isActive
                        ? 'var(--sc-color-blue-500)'
                        : 'var(--sc-color-grey-500)',
                  }}
                >
                  {stepNumber}
                </span>
              </div>
            </button>

            {!isLast && (
              <div
                style={{
                  height: '2px',
                  flex: 1,
                  backgroundColor: isCompleted
                    ? 'var(--sc-color-blue-500)'
                    : 'var(--sc-color-grey-300)',
                  transition: 'all 0.2s ease',
                }}
              />
            )}
          </div>

          {/* Label 4px below the step circle and connector container, left-aligned */}
          <div
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              fontWeight: '500',
              color: isActive
                ? 'var(--sc-color-foundation-content-header)'
                : isCompleted
                  ? 'var(--sc-color-foundation-content-body)'
                  : 'var(--sc-color-grey-500)',
              textAlign: 'left',
              width: '100%',
              paddingLeft: '4px',
            }}
          >
            {label}
          </div>
        </div>
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
        Stepper
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Steppers guide users through sequential workflows. They support dot,
        numeric, and icon types in both vertical and horizontal layouts.
      </p>

      {/* Vertical stepper */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Vertical stepper (numeric)
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <StepperItem
            stepNumber={1}
            label="Account details"
            description="Enter your personal information"
            isCompleted
            onClick={() => setCurrentStep(1)}
          />
          <StepperItem
            stepNumber={2}
            label="Payment method"
            description="Choose how you'd like to pay"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
            onClick={() => setCurrentStep(2)}
          />
          <StepperItem
            stepNumber={3}
            label="Review and submit"
            description="Check your details before submitting"
            isActive={currentStep === 3}
            isLast
            onClick={() => setCurrentStep(3)}
          />
        </div>
      </section>

      {/* Horizontal stepper */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Horizontal stepper
        </h3>

        <div style={{ display: 'flex', maxWidth: '600px' }}>
          <HorizontalStepperItem
            stepNumber={1}
            label="Details"
            isCompleted
            onClick={() => setCurrentStep(1)}
          />
          <HorizontalStepperItem
            stepNumber={2}
            label="Payment"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
            onClick={() => setCurrentStep(2)}
          />
          <HorizontalStepperItem
            stepNumber={3}
            label="Review"
            isActive={currentStep === 3}
            isCompleted={currentStep > 3}
            onClick={() => setCurrentStep(3)}
          />
          <HorizontalStepperItem
            stepNumber={4}
            label="Complete"
            isActive={currentStep === 4}
            isLast
            onClick={() => setCurrentStep(4)}
          />
        </div>
      </section>

      {/* With icons */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With custom icons
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <StepperItem
            stepNumber={1}
            label="Personal information"
            description="Tell us about yourself"
            type="icon"
            icon={<User size={20} />}
            isCompleted
          />
          <StepperItem
            stepNumber={2}
            label="Payment details"
            description="Add your payment method"
            type="icon"
            icon={<CreditCard size={20} />}
            isActive
          />
          <StepperItem
            stepNumber={3}
            label="Documents"
            description="Upload required documents"
            type="icon"
            icon={<FileText size={20} />}
          />
          <StepperItem
            stepNumber={4}
            label="Submit application"
            description="Review and submit"
            type="icon"
            icon={<Send size={20} />}
            isLast
          />
        </div>
      </section>

      {/* Dot style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Dot style
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <StepperItem
            stepNumber={1}
            label="Get started"
            type="dot"
            isCompleted
          />
          <StepperItem
            stepNumber={2}
            label="Configure settings"
            type="dot"
            isActive
          />
          <StepperItem
            stepNumber={3}
            label="Complete setup"
            type="dot"
            isLast
          />
        </div>
      </section>

      {/* Validation states - Numeric */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Validation states (numeric)
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Numbers remain with colour for error and success states
        </p>

        <div style={{ maxWidth: '400px' }}>
          <StepperItem
            stepNumber={1}
            label="Personal details"
            description="Successfully completed"
            intent="success"
            isCompleted
          />
          <StepperItem
            stepNumber={2}
            label="Verification"
            description="Failed validation"
            intent="error"
            isActive
          />
          <StepperItem
            stepNumber={3}
            label="Confirmation"
            description="Pending completion"
            isLast
          />
        </div>
      </section>

      {/* Validation states - Icon */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Validation states (icon)
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Icons show green tick for success, red cross for error
        </p>

        <div style={{ maxWidth: '400px' }}>
          <StepperItem
            stepNumber={1}
            label="Identity verification"
            description="Verification successful"
            type="icon"
            icon={<User size={20} />}
            intent="success"
            isCompleted
          />
          <StepperItem
            stepNumber={2}
            label="Payment processing"
            description="Payment failed"
            type="icon"
            icon={<CreditCard size={20} />}
            intent="error"
            isActive
          />
          <StepperItem
            stepNumber={3}
            label="Final submission"
            description="Waiting to submit"
            type="icon"
            icon={<Send size={20} />}
            isLast
          />
        </div>
      </section>

      {/* Stepper as tab navigation */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Stepper as tab navigation
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Steppers can act as tabs to navigate between content pages
        </p>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Stepper navigation */}
          <div
            style={{
              display: 'flex',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
            }}
          >
            <HorizontalStepperItem
              stepNumber={1}
              label="Profile"
              isActive={tabStep === 1}
              isCompleted={tabStep > 1}
              onClick={() => setTabStep(1)}
            />
            <HorizontalStepperItem
              stepNumber={2}
              label="Settings"
              isActive={tabStep === 2}
              isCompleted={tabStep > 2}
              onClick={() => setTabStep(2)}
            />
            <HorizontalStepperItem
              stepNumber={3}
              label="Preferences"
              isActive={tabStep === 3}
              isLast
              onClick={() => setTabStep(3)}
            />
          </div>

          {/* Content panels */}
          <div style={{ padding: '32px' }}>
            {tabStep === 1 && (
              <div>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    fontWeight: '600',
                    color: 'var(--sc-color-foundation-content-header)',
                    marginBottom: '12px',
                  }}
                >
                  Profile information
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-paragraph-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    marginBottom: '16px',
                  }}
                >
                  Manage your personal information and account details. Update
                  your name, email, phone number, and profile picture.
                </p>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--sc-color-blue-50)',
                    borderRadius: '6px',
                    border: '1px solid var(--sc-color-blue-200)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-blue-700)',
                      margin: 0,
                    }}
                  >
                    Profile content: Forms and input fields would appear here
                  </p>
                </div>
              </div>
            )}

            {tabStep === 2 && (
              <div>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    fontWeight: '600',
                    color: 'var(--sc-color-foundation-content-header)',
                    marginBottom: '12px',
                  }}
                >
                  Account settings
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-paragraph-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    marginBottom: '16px',
                  }}
                >
                  Configure your account settings including security, privacy,
                  notifications, and connected devices.
                </p>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--sc-color-green-50)',
                    borderRadius: '6px',
                    border: '1px solid var(--sc-color-green-200)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-green-700)',
                      margin: 0,
                    }}
                  >
                    Settings content: Switches, toggles, and configuration
                    options would appear here
                  </p>
                </div>
              </div>
            )}

            {tabStep === 3 && (
              <div>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    fontWeight: '600',
                    color: 'var(--sc-color-foundation-content-header)',
                    marginBottom: '12px',
                  }}
                >
                  User preferences
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-paragraph-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    marginBottom: '16px',
                  }}
                >
                  Customise your experience by setting your language, timezone,
                  theme, and display preferences.
                </p>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--sc-color-amber-50)',
                    borderRadius: '6px',
                    border: '1px solid var(--sc-color-amber-200)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-amber-700)',
                      margin: 0,
                    }}
                  >
                    Preferences content: Theme selectors, language options, and
                    customisation controls would appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
