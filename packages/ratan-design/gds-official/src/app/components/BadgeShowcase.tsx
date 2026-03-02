export default function BadgeShowcase() {
  const badgeVariants = [
    {
      intent: 'Default grey',
      bg: 'var(--sc-color-grey-100)',
      color: 'var(--sc-color-grey-700)',
      borderColor: 'var(--sc-color-grey-300)',
    },
    {
      intent: 'Brand blue',
      bg: 'var(--sc-color-blue-50)',
      color: 'var(--sc-color-blue-600)',
      borderColor: 'var(--sc-color-blue-200)',
    },
    {
      intent: 'Informational blue',
      bg: 'var(--sc-color-blue-100)',
      color: 'var(--sc-color-blue-700)',
      borderColor: 'var(--sc-color-blue-300)',
    },
    {
      intent: 'Success green',
      bg: 'var(--sc-color-green-50)',
      color: 'var(--sc-color-green-700)',
      borderColor: 'var(--sc-color-green-200)',
    },
    {
      intent: 'Warning amber',
      bg: 'var(--sc-color-amber-50)',
      color: 'var(--sc-color-amber-750)',
      borderColor: 'var(--sc-color-amber-200)',
    },
    {
      intent: 'Destructive red',
      bg: 'var(--sc-color-red-50)',
      color: 'var(--sc-color-red-550)',
      borderColor: 'var(--sc-color-red-200)',
    },
    {
      intent: 'Minor-error orange',
      bg: 'var(--sc-color-orange-50)',
      color: 'var(--sc-color-orange-700)',
      borderColor: 'var(--sc-color-orange-300)',
    },
  ];

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
        Badges
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Badges are compact visual indicators for status, counts, categories or
        attributes. They can be dot, text or icon style.
      </p>

      {/* Filled badges */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '24px',
          }}
        >
          Filled badges
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {badgeVariants.map((variant) => (
            <div
              key={variant.intent}
              style={{
                padding: '20px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                borderRadius: '8px',
                border:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                {variant.intent}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* Dot badge */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: variant.color,
                  }}
                  aria-label={`${variant.intent} indicator`}
                />

                {/* Text badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '20px',
                    padding: '0 8px',
                    backgroundColor: variant.bg,
                    color: variant.color,
                    borderRadius: '12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                  }}
                >
                  24
                </span>

                {/* Icon badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '20px',
                    padding: '0 8px',
                    backgroundColor: variant.bg,
                    color: variant.color,
                    borderRadius: '12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                  }}
                >
                  <span style={{ fontSize: '12px' }}>●</span>
                  Active
                </span>

                {/* Text badge with larger count */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '20px',
                    padding: '0 8px',
                    backgroundColor: variant.bg,
                    color: variant.color,
                    borderRadius: '12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                  }}
                >
                  99+
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outlined badges */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '24px',
          }}
        >
          Outlined badges
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {badgeVariants.map((variant) => (
            <div
              key={variant.intent}
              style={{
                padding: '20px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                borderRadius: '8px',
                border:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                {variant.intent}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* Outlined text badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '20px',
                    padding: '0 8px',
                    backgroundColor: 'transparent',
                    color: variant.color,
                    border: `1px solid ${variant.borderColor}`,
                    borderRadius: '12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                  }}
                >
                  12
                </span>

                {/* Outlined icon badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '20px',
                    padding: '0 8px',
                    backgroundColor: 'transparent',
                    color: variant.color,
                    border: `1px solid ${variant.borderColor}`,
                    borderRadius: '12px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                  }}
                >
                  <span style={{ fontSize: '12px' }}>○</span>
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage example */}
      <section style={{ marginTop: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Usage example
        </h3>
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-grey-200)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 'var(--sc-text-title-main)' }}>📧</span>
              {/* Notification badge on avatar */}
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  backgroundColor: 'var(--sc-color-red-550)',
                  color: 'var(--sc-color-white)',
                  borderRadius: '10px',
                  fontSize: '11px',
                  border: '2px solid var(--sc-color-white)',
                }}
              >
                3
              </span>
            </div>
            <span
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              Notifications with badge overlay
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
