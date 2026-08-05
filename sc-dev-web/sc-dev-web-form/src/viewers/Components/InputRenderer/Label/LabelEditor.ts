import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/PrefillAnswer.js';

export class LabelEditor extends FormBaseEditor {

  renderOtherGeneral = () => {};
  
  renderStyleAndLayout = () => {
    const { labelSize = 'md' } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { required } = this.component?.template ?? {};
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Required"
            ?checked=${required}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'required')}
          >
          </sc-switch>
        </div>
      </div>
    `;
  };

  renderPrefillAnswer: any = () => {
    return html`
      <prefill-answer
        .component=${this.component}
        @value-changed=${(event: CustomEvent) => {
    this.onChange(event.detail.value, event.detail.name);
    this.requestUpdate();
  }}
      ></prefill-answer>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-label .component=${this.component} .key=${this.key}>
      </form-label>
    `;
  };
}