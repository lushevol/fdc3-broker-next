import { ScProgressBar } from '../src/components/ScProgressBar/ScProgressBar.js';
export * from '../src/components/ScProgressBar/ScProgressBar.js';

if (!window.customElements.get('sc-progress-bar')) window.customElements.define('sc-progress-bar', ScProgressBar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-progress-bar': ScProgressBar;
  }
}
