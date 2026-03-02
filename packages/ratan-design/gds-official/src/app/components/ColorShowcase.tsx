export default function ColorShowcase() {
  const colorPalettes = [
    {
      name: 'Grey',
      colors: [
        { name: 'White', token: '--sc-color-white' },
        { name: 'Grey 25', token: '--sc-color-grey-25' },
        { name: 'Grey 50', token: '--sc-color-grey-50' },
        { name: 'Grey 100', token: '--sc-color-grey-100' },
        { name: 'Grey 200', token: '--sc-color-grey-200' },
        { name: 'Grey 300', token: '--sc-color-grey-300' },
        { name: 'Grey 400', token: '--sc-color-grey-400' },
        { name: 'Grey 500', token: '--sc-color-grey-500' },
        { name: 'Grey 600', token: '--sc-color-grey-600' },
        { name: 'Grey 700', token: '--sc-color-grey-700' },
        { name: 'Grey 800', token: '--sc-color-grey-800' },
        { name: 'Grey 900', token: '--sc-color-grey-900' },
        { name: 'Black', token: '--sc-color-black' },
      ],
    },
    {
      name: 'Blue',
      colors: [
        { name: 'Blue 50', token: '--sc-color-blue-50' },
        { name: 'Blue 100', token: '--sc-color-blue-100' },
        { name: 'Blue 200', token: '--sc-color-blue-200' },
        { name: 'Blue 300', token: '--sc-color-blue-300' },
        { name: 'Blue 400', token: '--sc-color-blue-400' },
        { name: 'Blue 500', token: '--sc-color-blue-500' },
        { name: 'Blue 600', token: '--sc-color-blue-600' },
        { name: 'Blue 700', token: '--sc-color-blue-700' },
        { name: 'Blue 800', token: '--sc-color-blue-800' },
        { name: 'Blue 900', token: '--sc-color-blue-900' },
      ],
    },
    {
      name: 'Prosper blue',
      colors: [{ name: 'Prosper blue', token: '--sc-color-prosper-blue' }],
    },
    {
      name: 'Green',
      colors: [
        { name: 'Green 50', token: '--sc-color-green-50' },
        { name: 'Green 200', token: '--sc-color-green-200' },
        { name: 'Green 400', token: '--sc-color-green-400' },
        { name: 'Green 500', token: '--sc-color-green-500' },
        { name: 'Green 600', token: '--sc-color-green-600' },
        { name: 'Green 700', token: '--sc-color-green-700' },
        { name: 'Green 800', token: '--sc-color-green-800' },
      ],
    },
    {
      name: 'Amber',
      colors: [
        { name: 'Amber 50', token: '--sc-color-amber-50' },
        { name: 'Amber 200', token: '--sc-color-amber-200' },
        { name: 'Amber 400', token: '--sc-color-amber-400' },
        { name: 'Amber 500', token: '--sc-color-amber-500' },
        { name: 'Amber 600', token: '--sc-color-amber-600' },
        { name: 'Amber 750', token: '--sc-color-amber-750' },
      ],
    },
    {
      name: 'Red',
      colors: [
        { name: 'Red 50', token: '--sc-color-red-50' },
        { name: 'Red 200', token: '--sc-color-red-200' },
        { name: 'Red 400', token: '--sc-color-red-400' },
        { name: 'Red 500', token: '--sc-color-red-500' },
        { name: 'Red 550', token: '--sc-color-red-550' },
        { name: 'Red 700', token: '--sc-color-red-700' },
      ],
    },
    {
      name: 'Orange',
      colors: [
        { name: 'Orange 50', token: '--sc-color-orange-50' },
        { name: 'Orange 300', token: '--sc-color-orange-300' },
        { name: 'Orange 500', token: '--sc-color-orange-500' },
        { name: 'Orange 700', token: '--sc-color-orange-700' },
      ],
    },
  ];

  const foundationColors = [
    {
      name: 'Background base',
      token: '--sc-color-foundation-basic-background-base',
      usage: 'Default app background',
    },
    {
      name: 'Container layer',
      token: '--sc-color-foundation-basic-container-layer',
      usage: 'Component container',
    },
    {
      name: 'Divider base',
      token: '--sc-color-foundation-basic-divider-base',
      usage: 'Separators and strokes',
    },
    {
      name: 'Brand grey',
      token: '--sc-color-foundation-basic-brand-grey',
      usage: 'Neutral brand',
    },
    {
      name: 'Brand blue',
      token: '--sc-color-foundation-basic-brand-blue',
      usage: 'Primary brand',
    },
    {
      name: 'Brand green',
      token: '--sc-color-foundation-basic-brand-green',
      usage: 'Success brand',
    },
    {
      name: 'Brand prosper blue',
      token: '--sc-color-foundation-basic-brand-prosper-blue',
      usage: 'Page headers',
    },
  ];

  const contentColors = [
    { name: 'Header', token: '--sc-color-foundation-content-header' },
    { name: 'Title', token: '--sc-color-foundation-content-title' },
    { name: 'Body', token: '--sc-color-foundation-content-body' },
    { name: 'Label text', token: '--sc-color-foundation-content-label-text' },
    {
      name: 'Placeholder text',
      token: '--sc-color-foundation-content-placeholder-text',
    },
    {
      name: 'Information text',
      token: '--sc-color-foundation-content-information-text',
    },
    { name: 'Error text', token: '--sc-color-foundation-content-error-text' },
    {
      name: 'Warning text',
      token: '--sc-color-foundation-content-warning-text',
    },
    {
      name: 'Success text',
      token: '--sc-color-foundation-content-success-text',
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
        Colour tokens
      </h2>

      {/* Foundation Colors */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Foundation basic colours
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {foundationColors.map((color) => (
            <div
              key={color.token}
              style={{
                padding: '16px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                borderRadius: '8px',
                border:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '64px',
                  backgroundColor: `var(${color.token})`,
                  borderRadius: '4px',
                  border:
                    '1px solid var(--sc-color-foundation-basic-divider-base)',
                  marginBottom: '12px',
                }}
              />
              <p
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  marginBottom: '4px',
                }}
              >
                {color.name}
              </p>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  fontFamily: 'monospace',
                }}
              >
                {color.token}
              </p>
              {color.usage && (
                <p
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-foundation-content-helper-text)',
                    marginTop: '4px',
                  }}
                >
                  {color.usage}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Content Colors */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Foundation content colours
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {contentColors.map((color) => (
            <div
              key={color.token}
              style={{
                padding: '16px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                borderRadius: '8px',
                border:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: `var(${color.token})`,
                  borderRadius: '4px',
                  marginBottom: '12px',
                }}
              />
              <p
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  marginBottom: '4px',
                }}
              >
                {color.name}
              </p>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  fontFamily: 'monospace',
                }}
              >
                {color.token}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Color Palettes */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Primitive colour palettes
        </h3>
        {colorPalettes.map((palette) => (
          <div key={palette.name} style={{ marginBottom: '32px' }}>
            <h4
              style={{
                fontSize: 'var(--sc-text-title-sub)',
                lineHeight: '24px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '12px',
              }}
            >
              {palette.name}
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
              }}
            >
              {palette.colors.map((color) => (
                <div key={color.token}>
                  <div
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: `var(${color.token})`,
                      borderRadius: '4px',
                      border:
                        '1px solid var(--sc-color-foundation-basic-divider-base)',
                      marginBottom: '8px',
                    }}
                  />
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-body)',
                    }}
                  >
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
