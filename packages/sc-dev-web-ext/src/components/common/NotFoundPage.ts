import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class NotFoundPage extends LitElement {
  @property({ type: String })
    pageTitle = 'Page Not Found';

  @property({ type: String })
    message = 'Unfortunately, we are not able to find the page you are trying to access.';

  render() {
    return html`
      <div
        style="
          min-height: calc(100vh - 100px); 
          display: flex; 
          flex-direction: column; 
          justify-content: flex-start; 
          align-items: center; 
          margin-top: 100px;
        "
      >
        <h1>${this.pageTitle}</h1>
        ${this.message ? html`<div>${this.message}</div>` : ''}
      </div>
    `;
  }
}

if (!window.customElements.get('sc-dev-ext-not-found-page')) {
  window.customElements.define('sc-dev-ext-not-found-page', NotFoundPage);
}