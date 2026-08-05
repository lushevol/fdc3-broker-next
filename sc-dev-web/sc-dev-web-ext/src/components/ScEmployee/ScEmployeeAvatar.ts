import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ScEmployeeBase } from './ScEmployeeBase.js';

export class ScEmployeeAvatar extends ScEmployeeBase {

  @property({ type: Array }) fields: string[] = ['id', 'avatar', 'businessTitle', 'email', 'phone'];

  render() {
    return html`
      <div class='sc-employee-avatar' part="wrapper">
        ${this.renderAvatar()}
      </div>
    `;
  }
}
