import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { createContext, provide } from '@lit/context';
import { restClient } from './rest-client.js';

const restClientContext = createContext('service-bench-rest-client-context');

export class ScDataRestProvider extends LitElement {
  static styles = css``;

  @provide({ context: restClientContext })
  @property()
    _restClient: any;

  connectedCallback() {
    this._restClient = restClient;
  }
  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define('sc-demo-rest-provider', ScDataRestProvider);