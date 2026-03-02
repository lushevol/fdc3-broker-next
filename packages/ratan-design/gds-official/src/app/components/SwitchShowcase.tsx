import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function SwitchShowcase() {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(true);
  const [switch5, setSwitch5] = useState(false);
  const [switch6, setSwitch6] = useState(false);

  const SwitchComponent = ({
    checked,
    onChange,
    disabled = false,
    hasStateIcon = false,
    label = '',
    supportingText = '',
    layout = 'horizontal' as 'horizontal' | 'vertical',
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    hasStateIcon?: boolean;
    label?: string;
    supportingText?: string;
    layout?: 'horizontal' | 'vertical';
  }) => {
    const containerStyle =
      layout === 'vertical'
        ? {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px',
          }
        : {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          };

    return (
      <div style={containerStyle}>
        <button
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
          style={{
            width: '34px',
            height: '16px',
            borderRadius: '16px',
            backgroundColor: checked
              ? disabled
                ? 'var(--sc-color-blue-200)'
                : 'var(--sc-color-blue-500)'
              : disabled
                ? 'var(--sc-color-grey-100)'
                : 'var(--sc-color-white)',
            border: checked
              ? 'none'
              : `1px solid ${disabled ? 'var(--sc-color-grey-200)' : 'var(--sc-color-grey-300)'}`,
            position: 'relative',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = checked
                ? 'var(--sc-color-blue-350)'
                : 'var(--sc-color-grey-50)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = checked
                ? 'var(--sc-color-blue-500)'
                : 'var(--sc-color-white)';
            }
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: checked ? '2px' : '1px',
              left: checked ? 'calc(100% - 14px)' : '1px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: checked
                ? 'var(--sc-color-white)'
                : disabled
                  ? 'var(--sc-color-grey-300)'
                  : 'var(--sc-color-grey-500)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasStateIcon &&
              (checked ? (
                <Check size={8} style={{ color: 'var(--sc-color-blue-500)' }} />
              ) : (
                <X size={8} style={{ color: 'var(--sc-color-grey-400)' }} />
              ))}
          </div>
        </button>
        {label && (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: disabled
                  ? 'var(--sc-color-grey-400)'
                  : 'var(--sc-color-foundation-content-body)',
                marginBottom: supportingText ? '4px' : 0,
              }}
            >
              {label}
            </div>
            {supportingText && (
              <div
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                {supportingText}
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
        Switch
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        A switch is a binary toggle that turns a setting on/off. It supports
        labels, state icons, and full interaction states.
      </p>

      {/* Basic switches */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Switch states
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginBottom: '8px',
                }}
              >
                Off state
              </p>
              <SwitchComponent checked={switch1} onChange={setSwitch1} />
            </div>

            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginBottom: '8px',
                }}
              >
                On state
              </p>
              <SwitchComponent checked={switch2} onChange={setSwitch2} />
            </div>

            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginBottom: '8px',
                }}
              >
                Disabled off
              </p>
              <SwitchComponent checked={false} onChange={() => {}} disabled />
            </div>

            <div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginBottom: '8px',
                }}
              >
                Disabled on
              </p>
              <SwitchComponent checked={true} onChange={() => {}} disabled />
            </div>
          </div>
        </div>
      </section>

      {/* With state icons */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With state icons
        </h3>

        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          <SwitchComponent
            checked={switch3}
            onChange={setSwitch3}
            hasStateIcon
          />
          <SwitchComponent
            checked={switch4}
            onChange={setSwitch4}
            hasStateIcon
          />
        </div>
      </section>

      {/* With labels */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With labels
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '400px',
          }}
        >
          <SwitchComponent
            checked={switch5}
            onChange={setSwitch5}
            label="Push notifications"
            supportingText="Receive push notifications for important updates"
          />
          <SwitchComponent
            checked={switch6}
            onChange={setSwitch6}
            label="Dark theme"
            supportingText="Enable dark mode for better viewing at night"
          />
          <SwitchComponent
            checked={false}
            onChange={() => {}}
            disabled
            label="Two-factor authentication"
            supportingText="This setting is managed by your administrator"
          />
        </div>
      </section>

      {/* Vertical layout */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Vertical layout
        </h3>

        <div style={{ display: 'flex', gap: '48px' }}>
          <SwitchComponent
            checked={true}
            onChange={() => {}}
            label="Email notifications"
            layout="vertical"
          />
          <SwitchComponent
            checked={false}
            onChange={() => {}}
            label="Marketing emails"
            layout="vertical"
          />
        </div>
      </section>
    </div>
  );
}
