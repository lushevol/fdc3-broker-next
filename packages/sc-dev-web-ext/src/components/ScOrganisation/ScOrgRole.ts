import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScExtElement from '../../shared/sc-ext-element.js';
import '../../../elements/sc-employee.js';
import type { TEAM_CONNECTION_TYPE, CUSTOM_FIELD_TYPE } from './types.js';
import { OrgRoleStyle } from './ScOrganisation.style.js';

export class ScOrgRole extends ScExtElement {

  static styles = OrgRoleStyle;

  @property({ type: String }) id: string;

  @property({ type: String }) name: string;

  @property({ type: String }) title: string;

  @property({ type: String }) location: string;

  @property({ type: String }) department: string;

  @property({ type: String }) email: string;

  @property({ type: String }) phone: string;

  @property({ type: Object }) connection: TEAM_CONNECTION_TYPE;

  @property({ type: Array }) customFields: CUSTOM_FIELD_TYPE[];

  @property({ }) customCard = undefined;

  renderAvatar() {
    if (!this.id) return nothing;
    return html`
      <sc-employee-avatar part=avatar id=${this.id} avatar-size=xl></sc-employee-avatar>
    `;
  }

  renderTitle() {
    if (!this.name && !this.title) return '-';
    const values = [this.name, this.title];
    return html`
      <sc-link>${values[0]}</sc-link>
      ${
  values[1] ? html`
          <div class=sub-title>${values[1]}</div>
        ` : nothing
}
    `;
  }

  renderConnection() {
    if (!this.connection) return nothing;
    return html`
      <div class=badge-container>
        <div
          class=${classMap({
    badge: true,
    open: this.connection.open,
  })}
        >
          ${this.connection.label}
        </div>
      </div>
      
    `;
  }

  renderField(icon: string | undefined, field: any) {
    return html`
      <div class='field-item'>
        ${icon ? html`<sc-icon name=${icon} size=xs></sc-icon>` : nothing}
        <span>${field || '-'}</span>
      </div>
    `;
  }

  renderCustomFields() {
    if (!this.customFields || this.customFields.length <= 0) return nothing;
    return this.customFields.map(field => {
      return this.renderField(field.icon, field.text);
    });
  }

  renderDepartment() {
    if (!this.department) return nothing;
    return html`
      <div class='field-item department'>
        <span>${this.department || '-'}</span>
      </div>
    `;
  }

  renderLocation() {
    if (!this.location) return nothing;
    return this.renderField('pin--line', this.location);
  }

  renderEmail() {
    if (!this.email) return nothing;
    return this.renderField('email--line', html`
      <a href=mailto:${this.email}>${this.email}</a>
    `);
  }

  renderPhone() {
    if (!this.phone) return nothing;
    return this.renderField('phone--line', html`
      <a href=tel:${this.phone}>${this.phone}</a>
    `);
  }

  render() {  
    return html`
      <sc-box 
        type=tranparent 
        radius=xs
        class=${classMap({
    'with-avatar': this.id,
  })}
      >
        ${
  this.customCard ? this.customCard : html`
            <div class=box-body>
              ${this.renderAvatar()}
              ${this.renderTitle()}
              ${this.renderDepartment()}
              ${this.renderLocation()}
              ${this.renderEmail()}
              ${this.renderPhone()}
              ${this.renderCustomFields()}
              ${this.renderConnection()}
            </div>
          `
}
      </sc-box>
    `;
  }

}