import { html, nothing, PropertyValues } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/IconSelector.js';

export class TextFieldEditor extends FormBaseEditor {
  _multiline = false;
  _maxLength: number;
  _row = 5;

  updated(properties: PropertyValues) {
    if (properties.has('component')) {
      this._multiline = this.component.template?.multiline;
      this._maxLength = this.component.template?.maxLength;
    }
  }

  renderOtherBehavior = () => {
    const { multiline, maxRow } = this.component.template;
    return html`
      <div class=w-half>
        <sc-switch
          label="Multiline"
          ?checked=${multiline || false}
          ?multiline=${multiline}
          @sc-change=${(e: CustomEvent) => {
    this._multiline = e.detail.checked;
    this._row = !this._multiline ? 0 : 5;
    this.onChange(this._row, 'rows');
    this.onChange(e.detail.checked, 'multiline');
    this.requestUpdate();
  }}
        >
        </sc-switch>
      </div>
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
    const { multiline, rows, labelSize, maxRow, readonlyRows } = this.component.template;
    return html`
      ${this._multiline || multiline ? html`
        <div class=row>
          <sc-number-input
            label="Rows"
            value=${rows}
            border-type="box"
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'rows')}
          >
          </sc-number-input>
        </div>`
      : nothing}
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

  renderOtherGeneral = () => {
    const { helpText, placeholder, prefixIcon, suffixIcon, suffixLabel } = this.component.template;
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
      <div class=row>
        <sc-text-input
          label="Placeholder"
          value=${placeholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'placeholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-icon-selector
          label="Prefix icon"
          value=${prefixIcon}
          @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'prefixIcon');
    this.requestUpdate();
  }}
        ></sc-icon-selector>
      </div>
      <div class=row>
        <sc-icon-selector
          label="Suffix icon"
          value=${suffixIcon}
          @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'suffixIcon');
    this.requestUpdate();
  }}
        ></sc-icon-selector>
      </div>
      <div class=row>
        <sc-text-input
          label="Suffix label"
          value=${suffixLabel}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'suffixLabel')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderValidation = () => {
    const { showCharacterCount, maxLength } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input
          label="Max length"
          value=${maxLength}
          border-type="box"
          @sc-input=${(e: CustomEvent) => {
    this._maxLength = e.detail.value;
    this.onChange(e.detail.value, 'maxLength');
    this.requestUpdate();
  }}
        >
        </sc-number-input>
      </div>
      ${
  this._maxLength ? html`
          <div class=row>
            <sc-switch
              label="Show character count"
              ?checked=${showCharacterCount}
              @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'showCharacterCount')}
            >
            </sc-switch>
          </div>
        ` : nothing
}
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-text-field .component=${this.component} .key=${this.key}>
      </form-text-field>
    `;
  };
}