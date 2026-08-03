import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import type { ORG_ROLE_TYPE } from './types.js';
import { OrgTeamStyle } from './ScOrganisation.style.js';

export class ScOrgTeam extends ScExtElement {

  static styles = OrgTeamStyle;

  @property({ type: Array }) roles: ORG_ROLE_TYPE[] = [];

  render() {  
    return html`
      <sc-box>
        <div class=sc-org-team-container>
        ${repeat(
    this.roles,
    role => role,
    role => {
      const { 
        id, name, type, icon, title, location, department, customCard, customFields, email, phone, connection, 
      } = role;
      return type === 'placeholder' ? html`
                <sc-organisation-placeholder
                  .icon=${icon}
                  .title=${title}
                ></sc-organisation-role>
              ` : html`
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
              `;
    })
}
        </div>
      </sc-box>
    `;
  }

}