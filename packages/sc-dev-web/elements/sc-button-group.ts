import { ScButtonGroup } from '../src/components/ScButtonGroup/ScButtonGroup.js';
import { ScButtonGroupItem } from '../src/components/ScButtonGroup/ScButtonGroupItem.js';
export * from '../src/components/ScButtonGroup/ScButtonGroup.js';
export * from '../src/components/ScButtonGroup/ScButtonGroupItem.js';

window.customElements.define('sc-button-group', ScButtonGroup);
window.customElements.define('sc-button-group-item', ScButtonGroupItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-button-group': ScButtonGroup,
    'sc-button-group-item': ScButtonGroup,
  }
}