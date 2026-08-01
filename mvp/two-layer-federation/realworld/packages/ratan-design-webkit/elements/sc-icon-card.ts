import { ScIconCard } from '../src/components/ScCard/ScIconCard.js';
export * from '../src/components/ScCard/ScIconCard.js';

window.customElements.define('sc-icon-card', ScIconCard);
declare global {
  interface HTMLElementTagNameMap {
    'sc-icon-card': ScIconCard;
  }
}
