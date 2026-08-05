import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { ScEmployeeBase } from './ScEmployeeBase.js';

export class ScEmployeeName extends ScEmployeeBase {

  @property({ type: Array }) fields: string[] = ['id', 'avatar', 'businessTitle', 'email', 'phone'];

  renderName() {
    const { name } = this._data;
    return html`
      <sc-tooltip
        hoist
        @click=${this.stopDefaultEvent} 
        placement=bottom content-max-width=400px mode=light
        style='--sc-tooltip-light-border-color: var(--sc-color-grey-150)'
      >      
        ${cache(!name ? '-' : html`<sc-link>${name}</sc-link>`)}
        <div slot="content" class=tooltip-container>
          ${this.renderDetails({
    mode: 'normal',
    data: null,
    noTooltip: true,
  })}
        </div>     
      </sc-tooltip>
    `;
  }

  render() {
    return html`
      <div class='sc-employee-name'>
        ${this.renderName()}
      </div>
    `;
  }
}
