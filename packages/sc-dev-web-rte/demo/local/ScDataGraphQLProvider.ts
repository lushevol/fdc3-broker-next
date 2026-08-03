import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createContext, provide } from '@lit/context';
import { graphQLClient } from './graphql-client.js';
import { storageClient } from './storage-client.js';
import { restClient } from './rest-client.js';

const graphQLClientContext = createContext('sc-data-graphql-client-context');
const storageClientContext = createContext('service-bench-storage-client-context');
const restClientContext = createContext('service-bench-rest-client-context');

export class ScDataGraphQLProvider extends LitElement {
  static styles = css``;

  @provide({ context: graphQLClientContext })
  @property()
    client: any;

  @provide({ context: restClientContext })
  @property()
    restClient: any;
    

  connectedCallback() {
    super.connectedCallback();
    this.client = graphQLClient;
    this.restClient = restClient;
  }
  render() {
    return html`<slot></slot>`;
  }
}

if (!window.customElements.get('sc-demo-graphql-provider'))
  window.customElements.define('sc-demo-graphql-provider', ScDataGraphQLProvider);

declare global {
  interface HTMLElementTagNameMap {
    'sc-demo-graphql-provider': ScDataGraphQLProvider
  }
}