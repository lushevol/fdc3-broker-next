import { html, css, LitElement } from 'lit';
// @ts-ignore
import hero from '../assets/banner-hero.svg';

export class Banner extends LitElement {
  static styles = css`
  `;

  render() {
    return html`
      <sc-banner round-corner image-src=${hero}>
        <h4 slot="title">
          Banner
        </h4>
        <div slot="body">
          <div>You can now build widget.</div>
        </div>
      </sc-banner>
    `;
  }
}
