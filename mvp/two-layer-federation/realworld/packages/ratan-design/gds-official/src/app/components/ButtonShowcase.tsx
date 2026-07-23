import { Plus, Download, Share2, Trash2, Settings } from 'lucide-react';

export default function ButtonShowcase() {
  const buttonVariants = [
    {
      intent: 'Neutral',
      styles: [
        {
          name: 'Primary',
          bg: 'var(--sc-color-blue-500)',
          color: 'var(--sc-color-white)',
          hoverBg: 'var(--sc-color-blue-350)',
          border: 'none',
        },
        {
          name: 'Secondary',
          bg: 'var(--sc-color-white)',
          color: 'var(--sc-color-foundation-content-body)',
          hoverBg: 'var(--sc-color-grey-50)',
          border: '1px solid var(--sc-color-grey-200)',
        },
        {
          name: 'Link primary',
          bg: 'transparent',
          color: 'var(--sc-color-blue-500)',
          hoverBg: 'transparent',
          border: 'none',
          hoverColor: 'var(--sc-color-blue-350)',
        },
        {
          name: 'Link secondary',
          bg: 'transparent',
          color: 'var(--sc-color-foundation-content-body)',
          hoverBg: 'transparent',
          border: 'none',
          hoverColor: 'var(--sc-color-grey-600)',
        },
      ],
    },
    {
      intent: 'Destructive',
      styles: [
        {
          name: 'Primary',
          bg: 'var(--sc-color-red-550)',
          color: 'var(--sc-color-white)',
          hoverBg: 'var(--sc-color-red-400)',
          border: 'none',
        },
        {
          name: 'Secondary',
          bg: 'var(--sc-color-white)',
          color: 'var(--sc-color-red-550)',
          hoverBg: 'var(--sc-color-red-50)',
          border: '1px solid var(--sc-color-red-200)',
        },
        {
          name: 'Link',
          bg: 'transparent',
          color: 'var(--sc-color-red-550)',
          hoverBg: 'transparent',
          border: 'none',
          hoverColor: 'var(--sc-color-red-400)',
        },
      ],
    },
    {
      intent: 'Success',
      styles: [
        {
          name: 'Primary',
          bg: 'var(--sc-color-green-500)',
          color: 'var(--sc-color-white)',
          hoverBg: 'var(--sc-color-green-400)',
          border: 'none',
        },
        {
          name: 'Secondary',
          bg: 'var(--sc-color-white)',
          color: 'var(--sc-color-green-700)',
          hoverBg: 'var(--sc-color-green-50)',
          border: '1px solid var(--sc-color-green-200)',
        },
        {
          name: 'Link',
          bg: 'transparent',
          color: 'var(--sc-color-green-700)',
          hoverBg: 'transparent',
          border: 'none',
          hoverColor: 'var(--sc-color-green-550)',
        },
      ],
    },
    {
      intent: 'Warning',
      styles: [
        {
          name: 'Primary',
          bg: 'var(--sc-color-amber-500)',
          color: 'var(--sc-color-black)',
          hoverBg: 'var(--sc-color-amber-400)',
          border: 'none',
        },
        {
          name: 'Secondary',
          bg: 'var(--sc-color-white)',
          color: 'var(--sc-color-amber-750)',
          hoverBg: 'var(--sc-color-amber-50)',
          border: '1px solid var(--sc-color-amber-200)',
        },
        {
          name: 'Link',
          bg: 'transparent',
          color: 'var(--sc-color-amber-750)',
          hoverBg: 'transparent',
          border: 'none',
          hoverColor: 'var(--sc-color-amber-550)',
        },
      ],
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
        Buttons
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Buttons are pill-shaped with 32px height and 16px horizontal padding.
        Each page should have only one primary button.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {buttonVariants.map((variant) => (
          <section key={variant.intent}>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '24px',
              }}
            >
              {variant.intent}
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              {variant.styles.map((style) => (
                <div key={style.name}>
                  <p
                    style={{
                      fontSize: 'var(--sc-text-label-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-label-text)',
                      marginBottom: '12px',
                    }}
                  >
                    {style.name}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {/* Interactive button */}
                    <button
                      onClick={() => console.log(`${style.name} clicked`)}
                      style={{
                        height: '32px',
                        padding: '0 16px',
                        backgroundColor: style.bg,
                        color: style.color,
                        border: style.border,
                        borderRadius: '24px',
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = style.hoverBg;
                        if (style.hoverColor) {
                          e.currentTarget.style.color = style.hoverColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = style.bg;
                        e.currentTarget.style.color = style.color;
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px var(--sc-color-blue-100)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Click me
                    </button>

                    {/* Disabled state */}
                    <button
                      disabled
                      style={{
                        height: '32px',
                        padding: '0 16px',
                        backgroundColor:
                          style.bg === 'transparent'
                            ? 'transparent'
                            : 'var(--sc-color-grey-100)',
                        color:
                          'var(--sc-color-foundation-content-disabled-text)',
                        border:
                          style.bg === 'transparent'
                            ? 'none'
                            : '1px solid var(--sc-color-grey-200)',
                        borderRadius: '24px',
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        cursor: 'not-allowed',
                        opacity: 0.6,
                        outline: 'none',
                      }}
                    >
                      Disabled
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Icon buttons */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Icon buttons
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '16px',
            }}
          >
            Icon-only buttons are circular with equal width and height. Always
            provide tooltips and accessible names.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => console.log('Add clicked')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-blue-500)',
                color: 'var(--sc-color-white)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
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
              aria-label="Add"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => console.log('Download clicked')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                border: '1px solid var(--sc-color-grey-200)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
              aria-label="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => console.log('Share clicked')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                border: '1px solid var(--sc-color-grey-200)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
              aria-label="Share"
            >
              <Share2 size={20} />
            </button>
            <button
              disabled
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sc-color-grey-100)',
                color: 'var(--sc-color-foundation-content-disabled-text)',
                border: '1px solid var(--sc-color-grey-200)',
                borderRadius: '50%',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
                outline: 'none',
              }}
              aria-label="Settings (disabled)"
            >
              <Settings size={20} />
            </button>
          </div>
        </section>

        {/* Buttons with icons */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Buttons with icons
          </h3>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '16px',
            }}
          >
            Buttons can include icons alongside text. Icons should be 16px with
            8px gap from text.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => console.log('Create new clicked')}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
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
              <Plus size={16} />
              Create new
            </button>
            <button
              onClick={() => console.log('Download clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                border: '1px solid var(--sc-color-grey-200)',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => console.log('Delete clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'var(--sc-color-red-550)',
                color: 'var(--sc-color-white)',
                border: 'none',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-red-400)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-red-550)';
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
