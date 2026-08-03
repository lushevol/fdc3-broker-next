import { ScTooltip } from '../src/components/ScTooltip/ScTooltip.js';
export * from '../src/components/ScTooltip/ScTooltip.js';

if (!window.customElements.get('sc-tooltip')) window.customElements.define('sc-tooltip', ScTooltip);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tooltip': ScTooltip;
  }
}
