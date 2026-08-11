import { html, nothing, PropertyValues } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import { Size } from '../../../../shared/utils.js';
import { state } from 'lit/decorators.js';

export class FileInputEditor extends FormBaseEditor {

  @state() _noIcon = false;

  firstUpdated() {
    this._noIcon = this.component.template?.noIcon;
  }

  renderValidation = () => {
    const {  accept, maxSize } = this.component.template;
    return html`
      <div class=row>
        <sc-text-input
          label="Accept file types, separated by comma"
          value=${accept}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'accept')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-number-input
          label="Max size"
          value=${maxSize}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'maxSize')}
        >
        </sc-number-input>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { iconSize = 'xs', noIcon, labelSize } = this.component.template;
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
        <sc-checkbox 
          ?checked=${!noIcon}
          @sc-change=${(e: CustomEvent) => { this.onChange(!e.detail.checked, 'noIcon'); this._noIcon = !e.detail.checked; }}
        >
          Display file icon
        </sc-checkbox>
      </div>
      ${this._noIcon ? nothing : html`<div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Icon size"
          value=${iconSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'iconSize')}
        >
          ${
  Size.map(size => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>`}
    `;
  };

  renderOtherBehavior = () => {
    const {
      selectable,
      multiple,
      deletable,
    } = this.component.template;

    return html`
      <div>
        <sc-switch
          label="Multifile"
          ?checked=${multiple}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'multiple')}
        >
        </sc-switch>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-file-input .component=${this.component} .key=${this.key}>
      </form-file-input>
    `;
  };
}