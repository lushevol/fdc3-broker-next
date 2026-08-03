import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import { FormSize } from '../../../../shared/utils.js';

export class CardNumberInputEditor extends FormBaseEditor {

  renderStyleAndLayout = () => {
    const { borderType, size, textAlign, iconSize, labelSize } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Mode"
          value=${borderType}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'borderType')}
        >
          <sc-radio value=box>Box</sc-radio>
          <sc-radio value=line>Line</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Text alignment"
          value=${textAlign}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'textAlign')}
        >
          <sc-radio value=left>Left</sc-radio>
          <sc-radio value=right>Right</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Label size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          ${
  FormSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Icon size"
          value=${iconSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'iconSize')}
        >
          ${
  FormSize.map(size => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
    `;
  };

  renderValidation = () => {
    const { maxLength } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input
          label="Max length"
          value=${maxLength}
          border-type="box"
          @sc-input=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'maxLength');
    this.requestUpdate();
  }}>
        </sc-number-input>
      </div>`;
  };
  
  renderBasicComponent = () => {
    return html`
      <form-card-number-input .component=${this.component} .key=${this.key}>
      </form-card-number-input>
    `;
  };
}