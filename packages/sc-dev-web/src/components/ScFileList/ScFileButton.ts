import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-button.js';
import ScFileButtonStyle from './ScFileButton.style.js';
import { filteringFiles } from './FileChecker.js';
import { AddedFilesType } from './FileData.js';

export class ScFileButton extends ScElement {

  static styles = ScTheme.getStyles().concat([ScFileButtonStyle]);

  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The file types the file input should accept, separated by comma.
   */
  @property({ type: String }) accept = '';

  @property({ type: Number, attribute: 'max-size' }) maxSize = 0;

  @property({ type: Boolean, reflect: true }) multiple = false;

  @property({ type: String }) width = '';

  private _handleChange(event: Event | DragEvent) {
    const { files } =
    (event.type === 'drop'
      ? (event as DragEvent).dataTransfer
      : (event.target as HTMLInputElement)) ?? {};
    const addedFiles = this._getFiles(event, files);

    this.emit('sc-file-button-value-change', {
      bubbles: true,
      composed: true,
      detail: {
        addedFiles: addedFiles.validFiles,
        invalidFiles: addedFiles.invalidFiles,
      },
    });

    const fileInput = this?.shadowRoot?.querySelector('.file-input');
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  }

  private _getFiles(event: Event | DragEvent, files: any): AddedFilesType {
    const { accept, maxSize } = this;
    if (!accept || !/^(change|drop)$/.test(event.type)) {
      return {
        validFiles: Array.from(files ?? []),
      };
    }
    return filteringFiles(accept, maxSize, files);
  }

  private _handleSlotClick(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.shadowRoot?.querySelector<HTMLInputElement>('.file-input')?.click();
  }

  render() {
    const {
      accept,
      disabled,
      multiple,
      _handleChange: handleChange,
    } = this;
    const labelClasses = classMap({
      ['sc-file-button-wrapper']: true,
      ['sc-file-button-wrapper-disabled']: disabled,
    });
    
    return html`
      <div class='sc-file-button'>
        <label 
          class="${labelClasses}" 
          for="file" 
          tabindex="0"
        >
          <div 
            class="sc-file-button-container" 
            role="button"
          >
            <slot name="add-button" @click=${this._handleSlotClick}></slot>
            <input
              id="file"
              type="file"
              class="file-input"
              tabindex="-1"
              accept="${accept ? accept : undefined}"
              ?disabled="${disabled}"
              ?multiple="${multiple}"
              @change="${handleChange}" />
              ${ this.accept ? 
                html`<div class="sc-file-button-accept" part=accept>
                ${ msg('Accepted file formats', { id: 'sc-file-button-supported-file-formats' })}: 
                ${this.accept}</div>` : null
              }
          </div>
        </label>
      </div>
    `;
  }
}
