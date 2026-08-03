import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class LoadingPage extends LitElement {
  @property({ type: String })
    message = '';

  render() {
    return html`
      <div
        style="min-height: calc(100vh - 100px); display: flex; justify-content: center; align-items: center;"
      >
        <sc-spinner type="page" size="lg"></sc-spinner>
        ${this.message ? html`<div>${this.message}</div>` : ''}
      </div>
    `;
  }
}

if (!window.customElements.get('sc-dev-ext-loading-page')) {
  window.customElements.define('sc-dev-ext-loading-page', LoadingPage);
}