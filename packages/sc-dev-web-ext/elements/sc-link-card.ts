import { ScLinkCard } from '../src/components/ScCard/ScLinkCard.js';

export * from '../src/components/ScCard/ScLinkCard.js';

window.customElements.define('sc-link-card', ScLinkCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-link-card': ScLinkCard,
  }
}