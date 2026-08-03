import { ScSnackbar } from '../src/components/ScSnackbar/ScSnackbar.js';
export * from '../src/components/ScSnackbar/ScSnackbar.js';

if (!window.customElements.get('sc-snackbar')) window.customElements.define('sc-snackbar', ScSnackbar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-snackbar': ScSnackbar;
  }
}
