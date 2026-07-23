import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function RadioShowcase() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [shippingOption, setShippingOption] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('monthly');
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const RadioButton = ({
    value,
    checked,
    onChange,
    label,
    description,
    disabled = false,
    intent = 'neutral' as 'neutral' | 'error' | 'success',
    isCollapsible = false,
    isExpanded = false,
    onToggleExpand,
  }: {
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
    description?: string;
    disabled?: boolean;
    intent?: 'neutral' | 'error' | 'success';
    isCollapsible?: boolean;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
  }) => {
    const getBorderColor = () => {
      if (disabled) return 'var(--sc-color-grey-200)';
      if (intent === 'error') return 'var(--sc-color-red-500)';
      if (intent === 'success') return 'var(--sc-color-green-500)';
      if (checked) return 'var(--sc-color-blue-500)';
      return 'var(--sc-color-grey-300)';
    };

    const getDotColor = () => {
      if (disabled) return 'var(--sc-color-grey-300)';
      if (intent === 'error') return 'var(--sc-color-red-500)';
      if (intent === 'success') return 'var(--sc-color-green-500)';
      return 'var(--sc-color-blue-500)';
    };

    return (
      <div>
        <div
          onClick={() => !disabled && onChange(value)}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {isCollapsible && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              style={{
                padding: '2px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--sc-color-grey-600)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}

          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: `2px solid ${getBorderColor()}`,
              backgroundColor: 'var(--sc-color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '3px',
              transition: 'all 0.15s ease',
            }}
          >
            {checked && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getDotColor(),
                  transition: 'all 0.15s ease',
                }}
              />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: disabled
                  ? 'var(--sc-color-grey-400)'
                  : 'var(--sc-color-foundation-content-body)',
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

        {isCollapsible && isExpanded && (
          <div
            style={{
              marginLeft: '40px',
              marginTop: '12px',
              padding: '12px',
              backgroundColor: 'var(--sc-color-grey-50)',
              borderRadius: '6px',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              Additional details for {label}
            </p>
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
        Radio
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Radio buttons allow users to select exactly one option from a group of
        mutually exclusive choices.
      </p>

      {/* Basic radio group */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Payment method *
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Select your preferred payment method
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <RadioButton
            value="credit-card"
            checked={paymentMethod === 'credit-card'}
            onChange={setPaymentMethod}
            label="Credit card"
            description="Pay securely with your credit card"
          />
          <RadioButton
            value="debit-card"
            checked={paymentMethod === 'debit-card'}
            onChange={setPaymentMethod}
            label="Debit card"
            description="Direct payment from your bank account"
          />
          <RadioButton
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={setPaymentMethod}
            label="PayPal"
            description="Fast and secure PayPal checkout"
          />
          <RadioButton
            value="bank-transfer"
            checked={paymentMethod === 'bank-transfer'}
            onChange={setPaymentMethod}
            label="Bank transfer"
            description="Transfer funds directly from your bank"
            disabled
          />
        </div>
      </section>

      {/* Horizontal layout */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Subscription plan
        </h3>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RadioButton
            value="monthly"
            checked={subscriptionPlan === 'monthly'}
            onChange={setSubscriptionPlan}
            label="Monthly"
          />
          <RadioButton
            value="yearly"
            checked={subscriptionPlan === 'yearly'}
            onChange={setSubscriptionPlan}
            label="Yearly"
          />
          <RadioButton
            value="lifetime"
            checked={subscriptionPlan === 'lifetime'}
            onChange={setSubscriptionPlan}
            label="Lifetime"
          />
        </div>
      </section>

      {/* Intent states */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Intent states
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginBottom: '12px',
              }}
            >
              Error state
            </p>
            <RadioButton
              value="error"
              checked={true}
              onChange={() => {}}
              label="Required selection"
              intent="error"
            />
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-red-500)',
                marginTop: '8px',
              }}
            >
              Please select an option
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginBottom: '12px',
              }}
            >
              Success state
            </p>
            <RadioButton
              value="success"
              checked={true}
              onChange={() => {}}
              label="Verified option"
              intent="success"
            />
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-green-700)',
                marginTop: '8px',
              }}
            >
              Selection confirmed
            </p>
          </div>
        </div>
      </section>

      {/* Collapsible radio group */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Shipping options
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Choose your delivery method
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <RadioButton
            value="standard"
            checked={shippingOption === 'standard'}
            onChange={setShippingOption}
            label="Standard shipping (5-7 days)"
            description="Free for orders over £50"
            isCollapsible
            isExpanded={expandedOption === 'standard'}
            onToggleExpand={() =>
              setExpandedOption(
                expandedOption === 'standard' ? null : 'standard',
              )
            }
          />
          <RadioButton
            value="express"
            checked={shippingOption === 'express'}
            onChange={setShippingOption}
            label="Express shipping (2-3 days)"
            description="£9.99 flat rate"
            isCollapsible
            isExpanded={expandedOption === 'express'}
            onToggleExpand={() =>
              setExpandedOption(expandedOption === 'express' ? null : 'express')
            }
          />
          <RadioButton
            value="overnight"
            checked={shippingOption === 'overnight'}
            onChange={setShippingOption}
            label="Overnight shipping (next day)"
            description="£19.99 flat rate"
            isCollapsible
            isExpanded={expandedOption === 'overnight'}
            onToggleExpand={() =>
              setExpandedOption(
                expandedOption === 'overnight' ? null : 'overnight',
              )
            }
          />
        </div>
      </section>
    </div>
  );
}
