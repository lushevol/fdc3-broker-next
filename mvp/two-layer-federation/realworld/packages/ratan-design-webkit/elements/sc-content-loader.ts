import { ScContentLoader } from '../src/components/ScLoader/ScContentLoader.js';
export * from '../src/components/ScLoader/ScContentLoader.js';

if (!window.customElements.get('sc-content-loader')) window.customElements.define('sc-content-loader', ScContentLoader);
declare global {
  interface HTMLElementTagNameMap {
    'sc-content-loader': ScContentLoader;
  }
}
