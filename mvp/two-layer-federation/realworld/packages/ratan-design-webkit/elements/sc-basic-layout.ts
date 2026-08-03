import { ScBasicLayout } from '../src/components/ScLayout/ScBasicLayout.js';
export * from '../src/components/ScLayout/ScBasicLayout.js';

if (!window.customElements.get('sc-basic-layout')) window.customElements.define('sc-basic-layout', ScBasicLayout);

declare global {
  interface HTMLElementTagNameMap {
    'sc-basic-layout': ScBasicLayout;
  }
}
