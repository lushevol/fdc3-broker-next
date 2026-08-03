import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';

export class EmployeeMultiInputEditor extends FormBaseEditor {
  renderOtherBehavior = () => {
    const { minCount, maxCount } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input
          label="Minimum selected employees"
          value=${minCount}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'minCount')}
        >
        </sc-number-input>
      </div>
      <div>
        <sc-number-input
          label="Maximum selected employees"
          value=${maxCount}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxCount')}
        >
        </sc-number-input>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize = 'md' } = this.component.template;
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
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-employee-multi-input .component=${this.component} .key=${this.key}>
      </form-employee-multi-input>
    `;
  };
}