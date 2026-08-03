import { html } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';

export class LinkEditor extends BaseEditor {

  renderOtherGeneral = () => {
    const { href, target } = this.component.template;
    return html`
      <div class=row>
        <sc-text-input
          label="URL"
          value=${href}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'href')}
        >
        </sc-text-input>
      </div>
      <div>
        <sc-radio-group
          direction=horizontal
          columns=2
          label= 'Open in'
          value=${target}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'target')}
        >
          <sc-radio value=_self>Same window</sc-radio>
          <sc-radio value=_blank>New window</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderOtherBehavior = () => {
    const { block, disabled } = this.component.template;

    return html`
      <div class=w-half>
          <sc-switch
            label=Block
            ?checked=${block}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'block')}
          >
          </sc-switch>
      </div>
      <div class=w-half>
          <sc-switch
            label=Disabled
            ?checked=${disabled}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'disabled')}
          >
          </sc-switch>
      </div>
      
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-link .component=${this.component} .key=${this.key}>
      </form-link>
    `;
  };
}