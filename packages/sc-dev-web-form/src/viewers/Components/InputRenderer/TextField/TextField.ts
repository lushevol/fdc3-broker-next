import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class TextField extends FormBaseViewer {
  renderElement() {
    // @ts-ignore
    const { 
      label,
      tooltip,
      value,
      defaultValue,
      placeholder, 
      helpText, 
      borderType = 'box', 
      disabled, 
      readonly, 
      required,
      multiline, 
      rows, 
      prefixIcon, 
      suffixIcon, 
      suffixLabel,
      maxLength,
      showCharacterCount,
      labelSize,
      maxRow,
      readonlyRows,
    } = this.template;
    return html`
      <sc-text-input
        label=${label}
        tooltip=${tooltip}
        value=${this.getContextValue() || value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        @sc-input=${this._onValueChange}
        @sc-blur=${this._onBlur}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?multiline=${multiline}
        rows=${rows}
        prefix-icon=${prefixIcon}
        suffix-icon=${suffixIcon}
        suffix-label=${suffixLabel}
        .maxLength=${maxLength}
        ?show-character-count=${showCharacterCount}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        label-size=${labelSize}
        ?max-rows=${maxRow} 
        readonly-rows=${readonlyRows}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-text-input>
    `;
  }
 
}