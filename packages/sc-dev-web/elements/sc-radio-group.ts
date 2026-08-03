import { ScRadioGroup } from '../src/components/ScRadio/ScRadioGroup.js';
export * from '../src/components/ScRadio/ScRadioGroup.js';

window.customElements.define('sc-radio-group', ScRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio-group': ScRadioGroup,
  }
}