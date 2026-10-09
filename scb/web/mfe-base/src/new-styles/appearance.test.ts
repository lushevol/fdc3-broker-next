import { resolvePortalAppearance } from './appearance';

describe('Portal appearance selection', () => {
  it('keeps the default host appearance legacy', () => {
    expect(resolvePortalAppearance()).toBe('legacy');
  });

  it('retains the explicitly enabled legacy layout preview', () => {
    expect(resolvePortalAppearance(false, '?new-layout=true')).toBe('layout-preview');
  });

  it('enables the complete prototype through props without a URL flag', () => {
    expect(resolvePortalAppearance(true)).toBe('prototype');
  });

  it('gives the prototype prop precedence over a disabled URL layout', () => {
    expect(resolvePortalAppearance(true, '?new-layout=false')).toBe('prototype');
  });

  it('does not enable layout from unrelated or non-true query values', () => {
    expect(resolvePortalAppearance(false, '?new-layout=TRUE&other=true')).toBe('legacy');
    expect(resolvePortalAppearance(false, '?new-layout=false')).toBe('legacy');
  });
});
