export type Theme = 'standard' | 'cpbb';
export type ColorMode = 'light' | 'dark';
export type FontMode = 'default' | 'inter' | 'roboto-mono' | 'dyslexic';

const ratanDocumentClasses = [
  'sc-theme-cpbb',
  'sc-mode-light',
  'sc-mode-dark',
  'sc-mode-inter',
  'sc-mode-roboto-mono',
  'sc-mode-dyslexic',
] as const;

export function resetDocumentMode(root: HTMLElement = document.documentElement) {
  root.classList.remove(...ratanDocumentClasses);
  root.removeAttribute('dir');
  root.removeAttribute('lang');
}

export function applyDocumentMode(
  options: {
    theme: Theme;
    mode: ColorMode;
    font: FontMode;
    direction: 'ltr' | 'rtl';
    locale: string;
  },
  root: HTMLElement = document.documentElement,
) {
  resetDocumentMode(root);
  if (options.theme === 'cpbb') root.classList.add('sc-theme-cpbb');
  root.classList.add(`sc-mode-${options.mode}`);
  if (options.font !== 'default') root.classList.add(`sc-mode-${options.font}`);
  root.dir = options.direction;
  root.lang = options.locale;
}
