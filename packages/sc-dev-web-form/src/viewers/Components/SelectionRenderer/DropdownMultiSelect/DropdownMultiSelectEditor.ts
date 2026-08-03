import { html, nothing } from 'lit';
import { SelectionBaseEditor } from '../../common/SelectionBaseEditor.js';

export class DropdownMultiSelectEditor extends SelectionBaseEditor {
  renderOtherBehavior = () => {
    const { multipleRows, maxRows, maxRow, readonly, selectAll } = this.component.template;
    const useMaxRows = maxRows ?? maxRow;
    return html`
      <div class=w-half>
        <sc-switch
          label="Select all"
          ?checked=${selectAll || false}
          @sc-change=${(e: CustomEvent) => {
          this.onChange(e.detail.checked, 'selectAll');
          this.requestUpdate();
        }}
        >
        </sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label="Multiple rows"
          ?checked=${multipleRows ?? false}
          @sc-change=${(e: CustomEvent) => {
          this.onChange(e.detail.checked, 'multipleRows');
          this.requestUpdate();
        }}
        >
        </sc-switch>
      </div>
      ${readonly ? html`
      <div class=w-half>
        <sc-switch
          label="Max rows"
          ?checked=${useMaxRows || false}
          @sc-change=${(e: CustomEvent) => {
          this.onChange(e.detail.checked, 'maxRows');
          this.requestUpdate();
        }}
        >
        </sc-switch>
      </div>` : nothing}
    `;
  };

  renderStyleAndLayout = () => {
    const { maxRows, maxRow, readonlyRows, labelSize, readonly } = this.component.template;
    const useMaxRows = maxRows ?? maxRow;
    return html`
      ${readonly && useMaxRows ? html`
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
      <form-dropdown-multi-select .component=${this.component} .key=${String(this.key)}>
      </form-dropdown-multi-select>
    `;
  };
}