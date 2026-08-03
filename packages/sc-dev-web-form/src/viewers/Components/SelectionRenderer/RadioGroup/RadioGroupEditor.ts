import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';

export class RadioGroupEditor extends SelectionBaseEditor {
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
    const { direction = 'vertical', labelSize } = this.component.template;
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
          columns=2
          direction=horizontal 
          label='Direction'
          value=${direction}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'direction')}
        >
          <sc-radio value=vertical>Vertical</sc-radio>
          <sc-radio value=horizontal>Horizontal</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-radio-group .component=${this.component} .key=${this.key}>
      </form-radio-group>
    `;
  };
}