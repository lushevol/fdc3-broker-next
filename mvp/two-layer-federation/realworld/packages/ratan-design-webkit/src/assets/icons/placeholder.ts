const ICON_PATHS: Readonly<Record<string, string>> = Object.freeze({
  cross: '<path d="M6 6l12 12M18 6 6 18"/>',
  notification: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  'trash--line': '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 10v7M14 10v7"/>',
  'person--line': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  'checkmark-circle--line': '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  'info-circle--line': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  denied: '<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>',
  'alert-triangle--line': '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4M12 17h.01"/>',
  'alert-circle--line': '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
});

const FALLBACK_PATH = '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.8.4-1.3 1-1.3 1.9v.5M12 17h.01"/>';

function svgData(path: string): string {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`,
  );
}

/** Resolves generated, dependency-free SVG assets for WebKit consumers. */
export function resolvePlaceholderIcon(name: string): string {
  return `data:image/svg+xml,${svgData(ICON_PATHS[name] ?? FALLBACK_PATH)}`;
}

export interface PlaceholderIconLibrary {
  readonly name: string;
  readonly resolver: typeof resolvePlaceholderIcon;
}

export function createPlaceholderIconLibrary(name: string): PlaceholderIconLibrary {
  return { name, resolver: resolvePlaceholderIcon };
}
