import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { createContext, provide } from '@lit/context';
import { graphQLClient } from './graphql-client.js';
import { restClient } from './rest-client.js';

const graphQLClientContext = createContext('sc-data-graphql-client-context');
const restClientContext = createContext('service-bench-rest-client-context');

export class ScDataProvider extends LitElement {
  static styles = css``;

  @provide({ context: graphQLClientContext })
  @property()
    client: any;

  @provide({ context: restClientContext })
  @property()
    restClient: any;

  connectedCallback() {
    this.client = graphQLClient;
    this.restClient = restClient;
  }
  render() {
    return html`<slot></slot>`;
  }
}

if (!window.customElements.get('sc-demo-data-provider')) {
  window.customElements.define('sc-demo-data-provider', ScDataProvider);
}