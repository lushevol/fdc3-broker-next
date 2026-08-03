import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScFileDropZoneStyle from './ScFileDropZone.style.js';
import { HasSlotController } from '../../shared/slot.js';
import { AddedFilesType } from './FileData.js';
import { filteringFiles } from './FileChecker.js';

/**
 * The value to set to `event.dataTransfer.dropEffect`, keyed by the event name.
 */
const dropEffects = {
  dragover: 'copy',
  dragleave: 'move',
};

export class ScFileDropZone extends ScElement {

  static styles = ScTheme.getStyles().concat([ScFileDropZoneStyle]);

  private _active = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The file types the file input should accept, separated by comma.
   */
  @property({ type: String }) accept = '';

  @property({ type: Number, attribute: 'max-size' }) maxSize = 0;

  @property({ type: Boolean, reflect: true }) multiple = false;

  @property({ type: String }) width = '';

  @property({ type: String }) placeholder = '';

  @property({ type: Boolean, attribute: 'has-error' }) hasError = false;

  /**
   * the component has gray background color for drop-zone style if sets to true
   */
  @property({ type: Boolean, attribute: 'bg-gray' }) bgGray = false;

  private readonly hasSlotController = new HasSlotController(this, 'placeholder');

  private _handleChange(event: Event | DragEvent) {
    const { files } =
    (event.type === 'drop'
      ? (event as DragEvent).dataTransfer
      : (event.target as HTMLInputElement)) ?? {};
    const addedFiles = this._getFiles(event, files);

    this.emit('sc-drop-zone-value-change', {
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

  private _handleDrag(event: DragEvent) {
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    const { dataTransfer, type } = event;
    // @ts-ignore
    const dropEffect = dropEffects[type];
    if (dataTransfer && dropEffect) {
      dataTransfer.dropEffect = dropEffect;
    }
    this._active = type === 'dragover';
    if (type === 'drop') {
      this._handleChange(event);
    }
    this.requestUpdate();
  }

  private _getFiles(event: Event | DragEvent, files: any): AddedFilesType {
    const { accept, maxSize } = this;
    if (!/^(change|drop)$/.test(event.type)) {
      return {
        validFiles: Array.from(files ?? []),
      };
    }
    
    return filteringFiles(accept, maxSize, files);
  }

  render() {
    const {
      accept,
      disabled,
      multiple,
      placeholder,
      hasError,
      bgGray,
      _active: active,
      _handleChange: handleChange,
    } = this;
    const labelClasses = classMap({
      ['sc-file-drop-zone-wrapper']: true,
      ['sc-file-drop-zone-wrapper-disabled']: disabled,
    });
    const dropZoneClasses = classMap({
      ['sc-file-drop-zone-container']: true,
      ['sc-file-drop-zone-container-bg-gray']: bgGray,
      ['sc-file-drop-zone-container-drag-over']: active,
      ['sc-file-drop-zone-container-err']: hasError,
    });
    return html`
        <div 
        class='sc-file-drop-zone'
        style="--sc-file-input-drop-zone-width: ${this.width ? this.width : '100%'}"
        >
      <label 
        class="${labelClasses}" 
        for="file" 
        tabindex="0"
      >
        <div 
          class="${dropZoneClasses}" 
          role="button"
          @drop=${this._handleDrag}
          @dragover=${this._handleDrag}
          @dragleave=${this._handleDrag}
        >
          ${this.hasSlotController.test('placeholder') ? html`<slot name='placeholder'></slot>` 
          : placeholder ? 
              (!active ? 
                html`<div class="sc-file-drop-zone-placeholder">${placeholder}</div>` : 
                html`<div class="sc-file-drop-zone-placeholder-active">${
                  msg('Drop your files here to upload', { id: 'sc-file-zone-placeholder-active-txt' })
                }
                </div>`
              )
              : 
              (!active ? 
                html`<div class="sc-file-drop-zone-placeholder">${
                  msg('Drag and drop files here to upload, or ', { id: 'sc-file-zone-placeholder' })
                }
                  <span class="sc-file-drop-zone-placeholder-brw">${
                    msg('browse', { id: 'sc-file-zone-placeholder-brw' })
                  }</span>
                </div>`
              : html`<div class="sc-file-drop-zone-placeholder-active">${
                  msg('Drop your files here to upload', { id: 'sc-file-zone-placeholder-active-txt' })
                }
                </div>`
              )
            }
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
              html`<div class="sc-file-drop-zone-accept" part=accept>
              ${ msg('Accepted file formats', { id: 'sc-file-drop-zone-supported-file-formats' })}: 
              ${this.accept}</div>` : null
            }
        </div>
      </label>
      </div>
    `;
  }
}
