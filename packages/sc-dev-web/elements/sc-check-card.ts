import { ScCheckCard } from '../src/components/ScCard/ScCheckCard.js';
export * from '../src/components/ScCard/ScCheckCard.js';

window.customElements.define('sc-check-card', ScCheckCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-check-card': ScCheckCard
  }
}