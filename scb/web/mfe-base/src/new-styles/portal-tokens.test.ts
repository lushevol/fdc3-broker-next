import { describe, expect, it } from 'vitest';
import { portalPresentationTokens, portalTokens } from './portal-tokens';

describe('Portal presentation tokens', () => {
  it('preserves compact numeric defaults and geometry', () => {
    expect(portalTokens.typography.body).toEqual({ fontSize: 14, lineHeight: '20px' });
    expect(portalTokens.typography.caption).toEqual({ fontSize: 12, lineHeight: '18px' });
    expect(portalTokens.size.control).toBe(32);
    expect(portalTokens.radius.control).toBe(8);
    expect(portalPresentationTokens.space).toBe(portalTokens.space);
    expect(portalPresentationTokens.breakpoint).toBe(portalTokens.breakpoint);
    expect(portalPresentationTokens.size.headerSwitchHeight).toBe(14);
    expect(portalPresentationTokens.size.headerSwitchThumb).toBe(12);
    expect(portalPresentationTokens.size.headerSwitchTravel).toBe(18);
    expect(portalPresentationTokens.size.menuWidth).toBe(320);
  });

  it.each([
    ['pageHeading', 'page-heading'],
    ['sectionHeading', 'section-heading'],
    ['title', 'title'],
    ['body', 'body'],
    ['caption', 'caption'],
    ['heroHeading', 'hero-heading'],
    ['heroBody', 'hero-body'],
  ] as const)('exposes %s preview variables with exact defaults', (role, variable) => {
    const baseline = portalTokens.typography[role];
    expect(portalPresentationTokens.typography[role]).toEqual({
      fontSize: `var(--portal-preview-${variable}-font-size, ${baseline.fontSize}px)`,
      lineHeight: `var(--portal-preview-${variable}-line-height, ${baseline.lineHeight})`,
    });
  });

  it('exposes a complete brand override without changing structural colors', () => {
    expect(portalPresentationTokens.fontFamily).toBe(
      `var(--portal-preview-font-family, ${portalTokens.fontFamily})`,
    );
    expect(portalPresentationTokens.color.primary).toBe(
      'var(--portal-preview-primary, #0473ea)',
    );
    expect(portalPresentationTokens.color.primaryHover).toBe(
      'var(--portal-preview-primary-hover, #025dbd)',
    );
    expect(portalPresentationTokens.color.primaryText).toBe(
      'var(--portal-preview-primary-text, #ffffff)',
    );
    expect(portalPresentationTokens.color.light).toBe(portalTokens.color.light);
    expect(portalPresentationTokens.color.dark).toBe(portalTokens.color.dark);
    expect(portalPresentationTokens.radius.control).toBe(
      'var(--portal-preview-control-radius, 8px)',
    );
    expect(portalPresentationTokens.radius.panel).toBe(6);
    expect(portalPresentationTokens.radius.pill).toBe(999);
    expect(portalPresentationTokens.size.headerLabelSize).toBe(
      'var(--portal-preview-header-label-font-size, 10px)',
    );
    expect(portalPresentationTokens.size.tabFontSize).toBe(
      'var(--portal-preview-tab-font-size, 14px)',
    );
  });
});
