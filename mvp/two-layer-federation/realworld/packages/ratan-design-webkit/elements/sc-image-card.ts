import { ScImageCard } from '../src/components/ScCard/ScImageCard.js';
export * from '../src/components/ScCard/ScImageCard.js';

if (!window.customElements.get('sc-image-card')) window.customElements.define('sc-image-card', ScImageCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-image-card': ScImageCard;
  }
}
