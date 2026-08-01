const FALLBACK_ICON = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 6v6"/><path d="M12 18h.01"/><circle cx="12" cy="12" r="9"/></svg>',
);

/** Temporary resolver used while the proprietary icon source is unavailable. */
export function resolvePlaceholderIcon(_name: string): string {
  return `data:image/svg+xml,${FALLBACK_ICON}`;
}

export interface PlaceholderIconLibrary {
  readonly name: string;
  readonly resolver: typeof resolvePlaceholderIcon;
}

export function createPlaceholderIconLibrary(name: string): PlaceholderIconLibrary {
  return { name, resolver: resolvePlaceholderIcon };
}
