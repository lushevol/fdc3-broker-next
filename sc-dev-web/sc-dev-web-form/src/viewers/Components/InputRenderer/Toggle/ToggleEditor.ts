import { html } from 'lit';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';

export class ToggleEditor extends SelectionBaseEditor {

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
    const { size = 'xxs', labelSize } = this.component.template;
    return html`
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
  CompactSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-toggle .component=${this.component} .key=${this.key}>
      </form-toggle>
    `;
  };
}