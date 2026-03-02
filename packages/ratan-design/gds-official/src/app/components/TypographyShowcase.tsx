export default function TypographyShowcase() {
  const typographyTokens = [
    {
      name: 'Hero main',
      token: '--sc-text-hero-main',
      size: '56px',
      lineHeight: '72px',
      usage: 'Hero on landing pages, splash screens',
    },
    {
      name: 'Hero sub',
      token: '--sc-text-hero-sub',
      size: '48px',
      lineHeight: '64px',
      usage: 'Secondary hero on marketing pages',
    },
    {
      name: 'Headline main',
      token: '--sc-text-headline-main',
      size: '40px',
      lineHeight: '56px',
      usage: 'Headlines on content pages',
    },
    {
      name: 'Headline sub',
      token: '--sc-text-headline-sub',
      size: '32px',
      lineHeight: '48px',
      usage: 'Subheadlines on content pages',
    },
    {
      name: 'Section main',
      token: '--sc-text-section-main',
      size: '28px',
      lineHeight: '44px',
      usage: 'Main section headers',
    },
    {
      name: 'Section sub',
      token: '--sc-text-section-sub',
      size: '22px',
      lineHeight: '38px',
      usage: 'Secondary section breaks',
    },
    {
      name: 'Section minor',
      token: '--sc-text-section-minor',
      size: '18px',
      lineHeight: '34px',
      usage: 'Minor sub headlines',
    },
    {
      name: 'Title main',
      token: '--sc-text-title-main',
      size: '18px',
      lineHeight: '26px',
      usage: 'Component headers and modal titles',
    },
    {
      name: 'Title sub',
      token: '--sc-text-title-sub',
      size: '16px',
      lineHeight: '24px',
      usage: 'Secondary component headers',
    },
    {
      name: 'Paragraph main',
      token: '--sc-text-paragraph-main',
      size: '14px',
      lineHeight: '22px',
      usage: 'Default body text',
    },
    {
      name: 'Component main',
      token: '--sc-text-component-main',
      size: '14px',
      lineHeight: '22px',
      usage: 'Button text, input text, dropdowns',
    },
    {
      name: 'Label main',
      token: '--sc-text-label-main',
      size: '12px',
      lineHeight: '16px',
      usage: 'Field labels on components',
    },
    {
      name: 'Description main',
      token: '--sc-text-description-main',
      size: '12px',
      lineHeight: '16px',
      usage: 'Validation messages, metadata',
    },
    {
      name: 'Helper main',
      token: '--sc-text-helper-main',
      size: '12px',
      lineHeight: '16px',
      usage: 'Helper text, small labels',
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
        Typography tokens
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        All typography uses SC Prosper Sans with system fallbacks (Inter for
        web, Roboto Mono for code).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {typographyTokens.map((token) => (
          <div
            key={token.token}
            style={{
              padding: '24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <p
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '4px',
                }}
              >
                {token.name}
              </p>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  fontFamily: 'monospace',
                }}
              >
                {token.token} • {token.size} / {token.lineHeight}
              </p>
            </div>

            <p
              style={{
                fontSize: `var(${token.token})`,
                lineHeight: token.lineHeight,
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
              }}
            >
              The quick brown fox jumps over the lazy dog
            </p>

            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              {token.usage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
