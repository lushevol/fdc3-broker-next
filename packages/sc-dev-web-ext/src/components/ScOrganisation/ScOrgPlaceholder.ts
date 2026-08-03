import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { OrgPlaceholderStyle } from './ScOrganisation.style.js';

export class ScOrgPlaceholder extends ScExtElement {

  static styles = OrgPlaceholderStyle;

  @property({ type: String }) icon: string;

  @property({ type: String }) title: string;

  renderTitle() {
    return html`
      <div class=org-placeholder-container>
        ${cache(this.icon ? html`<sc-icon name=${this.icon}></sc-icon>` : nothing)}
        ${cache(this.title ? html`<div class=title>
          ${this.title}
        </div>` : nothing)}
      </div>
    `;
  }

  render() {  
    return html`
      <sc-box>
        ${this.renderTitle()}
      </sc-box>
    `;
  }

}