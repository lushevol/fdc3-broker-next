export default function CardShowcase() {
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
        Cards
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Cards are contained UI elements that group related information and
        actions into a single, scannable module. Container padding: 12px
        horizontal and vertical, gap between items: 4px, corner radius: 6px.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Basic card */}
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '6px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '4px',
            }}
          >
            Basic card
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
            }}
          >
            Simple card with title and description text. Uses foundation
            container layer colour.
          </p>
        </div>

        {/* Card with header and footer */}
        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '6px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                margin: 0,
              }}
            >
              Card with sections
            </h3>
          </div>

          {/* Body */}
          <div style={{ padding: '12px' }}>
            <p
              style={{
                fontSize: 'var(--sc-text-paragraph-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '4px',
              }}
            >
              Cards can have distinct header, body and footer sections separated
              by dividers.
            </p>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              Use dividers to create visual hierarchy.
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '12px',
              borderTop:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button
              onClick={() => console.log('Cancel clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                border: 'none',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => console.log('Proceed clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'var(--sc-color-blue-500)',
                color: 'var(--sc-color-white)',
                border: 'none',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-350)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-500)';
              }}
            >
              Proceed
            </button>
          </div>
        </div>

        {/* Card with status */}
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
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                margin: 0,
              }}
            >
              Card with status badge
            </h3>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '20px',
                padding: '0 8px',
                backgroundColor: 'var(--sc-color-green-50)',
                color: 'var(--sc-color-green-700)',
                borderRadius: '12px',
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
              }}
            >
              Active
            </span>
          </div>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '16px',
            }}
          >
            Cards can include status badges to show current state or progress.
          </p>
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--sc-color-blue-50)',
              borderRadius: '4px',
              borderLeft: '3px solid var(--sc-color-blue-500)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-information-text)',
                margin: 0,
              }}
            >
              Information callout within the card
            </p>
          </div>
        </div>

        {/* Interactive card */}
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              'var(--sc-color-foundation-basic-divider-base)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-blue-100)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '20px' }}>📄</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 'var(--sc-text-title-main)',
                  lineHeight: '26px',
                  color: 'var(--sc-color-foundation-content-title)',
                  marginBottom: '4px',
                }}
              >
                Interactive card
              </h3>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                Last updated 2h ago
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
            }}
          >
            Hover to see the interactive state with border and shadow changes.
          </p>
        </div>

        {/* Card with list */}
        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                margin: 0,
              }}
            >
              Card with list items
            </h3>
          </div>

          {['Item one', 'Item two', 'Item three'].map((item, index, arr) => (
            <div
              key={item}
              style={{
                padding: '16px 24px',
                borderBottom:
                  index < arr.length - 1
                    ? '1px solid var(--sc-color-foundation-basic-divider-base)'
                    : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                }}
              >
                {item}
              </span>
              <span
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                }}
              >
                →
              </span>
            </div>
          ))}
        </div>

        {/* Compact card */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--sc-text-title-sub)',
              lineHeight: '24px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '8px',
            }}
          >
            Compact card
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-body)',
            }}
          >
            Smaller padding for dense layouts. Useful for dashboards or summary
            views.
          </p>
        </div>
      </div>
    </div>
  );
}
