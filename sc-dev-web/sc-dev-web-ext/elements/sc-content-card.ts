import { ScContentCard } from '../src/components/ScCard/ScContentCard.js';

export * from '../src/components/ScCard/ScContentCard.js';

window.customElements.define('sc-content-card', ScContentCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-content-card': ScContentCard,
  }
}