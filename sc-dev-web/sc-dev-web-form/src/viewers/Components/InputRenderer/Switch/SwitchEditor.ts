import { html } from 'lit';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import { FormSize } from '../../../../shared/utils.js';

export class SwitchEditor extends FormBaseEditor {

  renderOtherGeneral = () => {
    const { helpText } = this.component.template;
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          .toolbar=${this.simpleToolbars}
          value=${helpText}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { size, labelPosition = 'right', labelSize } = this.component.template;
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
  FormSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
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
          ${
  FormSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Label position"
          value=${labelPosition}
          @sc-change=${(e: CustomEvent) =>{
    this.onChange(e.detail.value, 'labelPosition');
    this.onChange(['left', 'right'].includes(e.detail.value) ? 'lg' : 'md', 'labelSize');
    this.requestUpdate();
  }}
        >
          <sc-radio value=top>Top</sc-radio>
          <sc-radio value=left>Left</sc-radio>
          <sc-radio value=right>Right</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-switch .component=${this.component} .key=${this.key}>
      </form-switch>
    `;
  };
}