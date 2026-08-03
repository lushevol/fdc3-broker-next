import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { createContext, provide } from '@lit/context';
import { graphQLClient } from './graphql-client.js';

const graphQLClientContext = createContext('sc-data-graphql-client-context');

export class ScDataGraphQLProvider extends LitElement {
  static styles = css``;

  @provide({ context: graphQLClientContext })
  @property()
    client: any;

  connectedCallback() {
    this.client = graphQLClient;
  }
  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define('sc-demo-graphql-provider', ScDataGraphQLProvider);