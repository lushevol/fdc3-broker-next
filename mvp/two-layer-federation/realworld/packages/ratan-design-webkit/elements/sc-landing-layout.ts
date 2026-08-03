import { ScLandingLayout } from '../src/components/ScLayout/ScLandingLayout.js';
export * from '../src/components/ScLayout/ScLandingLayout.js';

if (!window.customElements.get('sc-landing-layout')) window.customElements.define('sc-landing-layout', ScLandingLayout);

declare global {
  interface HTMLElementTagNameMap {
    'sc-landing-layout': ScLandingLayout;
  }
}
