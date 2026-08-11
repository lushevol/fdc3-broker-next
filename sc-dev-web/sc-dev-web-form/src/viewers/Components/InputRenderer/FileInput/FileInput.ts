import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { state } from 'lit/decorators.js';

export class FileInput extends FormBaseViewer {
 
  @state() _invalidFileErrorMessage = '';

  onSelect = (event: CustomEvent) => {
    this.emit('file-selected', {
      detail: event.detail,
    });
  };

  onRemove = (event: CustomEvent) => {
    this.emit('file-removed', {
      detail: event.detail,
    });
  };

  _onFileValueChange = (event: CustomEvent) => {
    if (event.detail.invalidFiles?.length) {
      this._invalidFileErrorMessage = event.detail.invalidFiles[0].extra;
    } else {
      this._invalidFileErrorMessage = '';
      this._onValueChange(event);
    }
  };

  renderElement() {
    const { 
      label,
      tooltip,
      value, 
      defaultValue,
      placeholder, 
      helpText, 
      borderType = 'line', 
      disabled, 
      readonly, 
      required,
      accept,
      direction,
      maxSize,
      width,
      iconSize,
      noIcon,
      noBorder,
      multiple,
      selectable,
      deletable,
      labelSize,
    } = this.template;
    return html`
      <sc-file-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        .value=${value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        .accept=${accept}
        .direction=${direction}
        max-size=${maxSize}
        .width=${width}
        icon-size=${iconSize}
        ?no-icon=${noIcon}
        ?no-border=${noBorder}
        ?multiple=${multiple}
        ?selectable=${selectable}
        ?deletable=${deletable}
        @sc-change=${this._onFileValueChange}
        @sc-select=${this.onSelect}
        @sc-remove=${this.onRemove}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-file-input>
    `;
  }
 
}