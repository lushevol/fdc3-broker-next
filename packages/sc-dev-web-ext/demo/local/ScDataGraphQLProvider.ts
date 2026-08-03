import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { createContext, provide } from '@lit/context';
import { graphQLClient } from './graphql-client.js';
import { restClient } from './rest-client.js';

const graphQLClientContext = createContext('sc-data-graphql-client-context');
const restClientContext = createContext('service-bench-rest-client-context');

export class ScDataGraphQLProvider extends LitElement {
  static styles = css``;

  @provide({ context: graphQLClientContext })
  @property()
    client: any;

  @provide({ context: restClientContext })
  @property()
    restClientProvider: any;

  connectedCallback() {
    super.connectedCallback();
    this.client = graphQLClient;
    this.restClientProvider = restClient;
  }
  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define('sc-demo-graphql-provider', ScDataGraphQLProvider);