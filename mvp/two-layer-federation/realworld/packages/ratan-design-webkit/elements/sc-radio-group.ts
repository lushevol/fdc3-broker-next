import { ScRadioGroup } from '../src/components/ScRadio/ScRadioGroup.js';
export * from '../src/components/ScRadio/ScRadioGroup.js';

if (!window.customElements.get('sc-radio-group')) window.customElements.define('sc-radio-group', ScRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio-group': ScRadioGroup;
  }
}
