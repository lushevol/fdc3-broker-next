export type PortalAppearance = 'legacy' | 'layout-preview' | 'prototype';

/** One appearance policy for embedded hosts and the standalone Portal. */
export const resolvePortalAppearance = (newStyles = false, search = ''): PortalAppearance => {
  if (newStyles) return 'prototype';
  return new URLSearchParams(search).get('new-layout') === 'true' ? 'layout-preview' : 'legacy';
};
