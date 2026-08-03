import { ScInputGroup } from '../src/components/ScInputGroup/ScInputGroup.js';
export * from '../src/components/ScInputGroup/ScInputGroup.js';

if (!window.customElements.get('sc-input-group')) window.customElements.define('sc-input-group', ScInputGroup);
declare global {
  interface HTMLElementTagNameMap {
    'sc-input-group': ScInputGroup;
  }
}
