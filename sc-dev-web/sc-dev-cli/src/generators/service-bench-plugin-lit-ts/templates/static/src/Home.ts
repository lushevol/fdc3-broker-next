import { html, LitElement } from 'lit';
import { createContext, contexts } from '@scdevkit/service-bench-core';

const userContext = createContext(contexts.USER);

export class Home extends LitElement {

  _userContextConsumer = userContext.createConsumer(this);

  render() {
    const user: any = this._userContextConsumer.value;
    return html`
      <sc-landing-layout height="auto" banner-text-alignment="left" banner-image-src="" banner-image-position="right">
        <div slot="banner-title">
          Welcome to Service Bench, ${user?.firstName} ${user?.lastName}! 
        </div>
        <div slot="banner-body">
          If you see this message, your plugin project is successfully set up.
        </div>
        <div slot="content">
            <sb-<??= name ??>-home-content></sb-<??= name ??>-home-content>
        </div>
      </sc-landing-layout>
    `;
  }
}
