import { html } from 'lit';
import { FormBaseEditor } from './FormBaseEditor.js';

export class FormInputBaseEditor extends FormBaseEditor {
 
  renderOtherGeneral: any = () => {
    return html`
      <div class=row>
        <sc-text-input
          label="Placeholder"
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'placeholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-radio-group
          label="Border type"
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'borderType')}
        >
          <sc-radio value=line>Line</sc-radio>
          <sc-radio value=box>Box</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };
}