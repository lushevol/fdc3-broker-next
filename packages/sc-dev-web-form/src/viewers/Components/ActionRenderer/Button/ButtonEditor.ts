import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';

export class ButtonEditor extends BaseEditor {

  renderOtherGeneral = () => {
    const { event } = this.component.template;
    return html`
      <div>
        <sc-dropdown-input 
          hoist
          label=Action
          value=${event}
          @sc-select=${(event: CustomEvent) => {
    this.onChange(event.detail.value, 'event');
  }}
        >
          <sc-dropdown-option value=onSave>Save</sc-dropdown-option>
          <sc-dropdown-option value=onSubmit>Submit</sc-dropdown-option>
          <sc-dropdown-option value=previous>Previous</sc-dropdown-option>
          <sc-dropdown-option value=goNext>Next</sc-dropdown-option>
          <sc-dropdown-option value=custom>Custom</sc-dropdown-option>
        </sc-dropdown-input>
      </div>`;
  };

  renderStyleAndLayout = () => {
    const { type, size } = this.component.template;
    return html`
    <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
        ${
  CompactSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Type"
          value=${type}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'type')}
        >
          <sc-radio value=primary>Primary</sc-radio>
          <sc-radio value=secondary>Secondary</sc-radio>
          <sc-radio value=text>Text</sc-radio>
          <sc-radio value=link>Link</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-button .component=${this.component} .key=${this.key}>
      </form-button>
    `;
  };
}