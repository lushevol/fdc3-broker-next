import { ScInputGroup } from '../src/components/ScInputGroup/ScInputGroup.js';
export * from '../src/components/ScInputGroup/ScInputGroup.js';

window.customElements.define('sc-input-group', ScInputGroup);
declare global {
  interface HTMLElementTagNameMap {
    'sc-input-group': ScInputGroup;
  }
}
