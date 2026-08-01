import { ScRadioCard } from '../src/components/ScCard/ScRadioCard.js';
export * from '../src/components/ScCard/ScRadioCard.js';

window.customElements.define('sc-radio-card', ScRadioCard);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio-card': ScRadioCard;
  }
}
