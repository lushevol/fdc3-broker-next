import { html } from 'lit';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';

export class ButtonGroupEditor extends SelectionBaseEditor {

  renderOtherGeneral: any = () => {
    const { helpText } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          value=${helpText}
          .toolbar=${this.simpleToolbars}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
    `;
  };

  renderOtherBehavior = () => {
    const { singleSelect } = this.component.template;
    return html`
      <div class=row>
        <sc-switch
          label="Multiselect"
          ?checked=${singleSelect}
          @sc-change=${(e: CustomEvent) => {
             this.onChange(e.detail.checked, 'singleSelect');
             this.requestUpdate();
          }}
        >
        </sc-switch>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-button-group .component=${this.component} .key=${this.key}>
      </form-button-group>
    `;
  };
}