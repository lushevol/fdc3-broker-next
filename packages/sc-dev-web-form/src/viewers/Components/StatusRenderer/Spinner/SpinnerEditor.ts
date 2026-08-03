import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';

export class SpinnerEditor extends BaseEditor {

  renderLabel = () => {
    const { message } = this.component.template;
    return html`
      <div class=row>
        <sc-text-input
          label="Label "
          value=${message}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'message')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { size = 'sm', color = 'blue' } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          label=Size
          value=${size}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          label=Color
          value=${color}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'color')}
        >
          <sc-radio value=blue>Blue</sc-radio>
          <sc-radio value=white>White</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-spinner .component=${this.component} .key=${this.key}>
      </form-spinner>
    `;
  };
}