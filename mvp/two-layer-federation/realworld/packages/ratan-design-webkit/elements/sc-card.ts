import { ScCard } from '../src/components/ScCard/ScCard.js';
export * from '../src/components/ScCard/ScCard.js';

if (!window.customElements.get('sc-card')) window.customElements.define('sc-card', ScCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-card': ScCard;
  }
}
