import { html, nothing } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';

export class DropdownInputEditor extends SelectionBaseEditor {

  renderOtherBehavior = () => {
    const { maxRow } = this.component.template;
    return html`
      <div class=w-half>
        <sc-switch
          label="Max row"
          ?checked=${maxRow || false}
          @sc-change=${(e: CustomEvent) => {
          this.onChange(e.detail.checked, 'maxRow');
          this.requestUpdate();
        }}
        >
        </sc-switch>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { maxRow, readonlyRows, labelSize } = this.component.template;
    return html`
      ${maxRow ? html`
        <div class=row>
          <sc-number-input
            label="Readonly rows"
            value=${readonlyRows}
            border-type="box"
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'readonlyRows')}
          >
          </sc-number-input>
        </div>`
      : nothing}
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
      <form-dropdown-input .component=${this.component} .key=${this.key}>
      </form-dropdown-input>
    `;
  };
}