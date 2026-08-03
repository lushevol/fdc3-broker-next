import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import ScExtElement from '../../shared/sc-ext-element.js';
import '../../../elements/sc-organisation.js';
import type { ORG_ROLE_TYPE } from './types.js';
import { OrgHierarchyStyle } from './ScOrganisation.style.js';

export class ScOrgHierarchy extends ScExtElement {

  static styles = OrgHierarchyStyle;

  @property({ type: Array }) roles: ORG_ROLE_TYPE[] = [];

  renderConnector() {
    return html`
      <div class=connector></div>
    `;
  }

  render() {
    return html`
      <div class=org-hierarchy-container>
        ${repeat(
    this.roles,
    role => role,
    (role: ORG_ROLE_TYPE, i: number) => {
      const { 
        id, name, title, location, department, email, customCard, customFields, phone, connection, icon, 
      } = role;
      return html`
              ${i !== 0 ? html`
                <div class=connector-container key=${`connector-${i}`}>${this.renderConnector()}</div>
              ` : nothing}
              ${Array.isArray(role) ? html`
                <sc-organisation-team .roles=${role}></sc-organisation-team>
              ` : role.type === 'placeholder' ? 
    html`
                  <sc-organisation-placeholder
                    .icon=${icon}
                    .title=${title}
                  ></sc-organisation-role>
                ` :
    html`
                  <sc-organisation-role
                    .id=${id}
                    .name=${name}
                    .title=${title}
                    .location=${location}
                    .department=${department}
                    .email=${email}
                    .phone=${phone}
                    .connection=${connection}
                    .customCard=${customCard}
                    .customFields=${customFields}
                  ></sc-organisation-role>
                `
}
            `;
    })
}
      </div>
    `;
  }
}