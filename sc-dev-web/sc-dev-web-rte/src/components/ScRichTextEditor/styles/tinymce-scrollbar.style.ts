/**
 * TinyMCE Scrollbar Style Injector
 */

export type ScrollbarSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

export interface TinymceScrollbarOptions {
  size?: ScrollbarSize | '';
  opaque?: boolean;
  alwaysVisible?: boolean;
}

// Configuration constants for colors and sizes based on ScScrollbar
const COLORS = {
  thumb: '#999999', // sc-color-grey-400
  trackOpaque: '#F2F2F2', // sc-color-grey-50
  trackTransparent: 'transparent',
};

const SIZE_PX: Record<ScrollbarSize, number> = {
  xs: 5,
  sm: 6,
  default: 7,
  lg: 8,
  xl: 9,
};

const STYLE_ID = 'sc-rte-scrollbar-style';

// Generates the CSS string based on provided options
function generateCSS(options: TinymceScrollbarOptions = {}): string {
  const { size = 'sm', opaque = false, alwaysVisible = false } = options;
  const safeSize =
    size && SIZE_PX[size as ScrollbarSize] ? (size as ScrollbarSize) : 'sm';
  const sizePx = SIZE_PX[safeSize];
  const trackColor = opaque ? COLORS.trackOpaque : COLORS.trackTransparent;

  const defaults = `
    :root {
      --scroll-thumb: ${COLORS.thumb};
      --scroll-track: ${trackColor};
      --scroll-size: ${sizePx}px;
    }

    body, .scroll {
      scrollbar-gutter: ${alwaysVisible ? 'stable' : 'auto'};
      &::-webkit-scrollbar {
        width: var(--scroll-size, 0.375rem);
        height: var(--scroll-size, 0.375rem);
      }
      &::-webkit-scrollbar,
      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-corner {
        background: var(--scroll-track);
      }
      &::-webkit-scrollbar-thumb {
        background: var(--scroll-thumb);
        border: none;
        border-radius: var(--scroll-size, 0.375rem);
      }
    }
    `;

  if (!alwaysVisible) {
    return  `${defaults}
      html:not(:hover):not(:focus-within) {
        --scroll-track: transparent;
        --scroll-thumb: transparent;
      }
    `;
  }
  return defaults;
}

// Directly injects or updates the <​style> tag in the editor's iframe head
export function injectScrollbarStyles(
  editor: any,
  options: TinymceScrollbarOptions = {}
): void {
  try {
    const doc = editor.getDoc();
    if (!doc) {
      console.error('RTE Scrollbar: No iframe doc');
      return;
    }

    const existing = doc.getElementById(STYLE_ID);
    if (existing) existing.remove();

    const css = generateCSS(options);

    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;

    const head = doc.head || doc.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(style);
    }
  } catch (e) {
    console.error('RTE Scrollbar: Error:', e);
  }
}

// Removes the injected scrollbar styles from the editor
export function removeScrollbarStyles(editor: any): void {
  try {
    const doc = editor.getDoc();
    if (!doc) return;
    const existing = doc.getElementById(STYLE_ID);
    if (existing) existing.remove();
  } catch (e) {}
}

// Helper to retrieve CSS string without injecting it (for debugging or testing)
export function generateTinymceScrollbarStyle(
  options: TinymceScrollbarOptions = {}
): string {
  return generateCSS(options);
}
