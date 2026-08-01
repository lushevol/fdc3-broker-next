import { ScParagraph } from '../src/components/ScTypography/ScParagraph.js';
export * from '../src/components/ScTypography/ScParagraph.js';

window.customElements.define('sc-paragraph', ScParagraph);

declare global {
  interface HTMLElementTagNameMap {
    'sc-paragraph': ScParagraph;
  }
}
