import { html } from 'lit';
import { property } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import { watch } from '../../shared/watch.js';
import ScFileInputStyle from './ScFileInput.style.js';
import { FormBase } from '../common/FormBase.js';
import { FileData } from './FileData.js';
import { ScFileDropZone } from './ScFileDropZone.js';
import '../../../elements/sc-text-input.js';
import '../../../elements/sc-file-drop-zone.js';
import '../../../elements/sc-file-button.js';
import '../../../elements/sc-file-list.js';
import '../../../elements/sc-file-item.js';
import { ICON_SIZE } from '../ScIcon/IconBase.js';
import { DIRECTION } from '../../shared/util.js';
import { HasSlotController } from '../../shared/slot.js';
import { generateFileUniqueId } from '../../shared/generate-unique-id.js';
import { CUSTOM_EVENTS_TYPE } from '../../shared/sc-custom-events.js';
import { ScEventInit } from '../../shared/sc-element.js';
export class ScFileInput extends FormBase {

  static styles = ScTheme.getStyles().concat([ScFileInputStyle]);

  @property({ type: String }) accept = '';

  @property({ type: Array }) value: FileData[] = [];

  @property({ type: Number, attribute: 'max-size' }) maxSize = 0;

  @property({ type: String }) width = '100%';

  @property({ type: String }) placeholder = '';

  @property({ reflect: true }) direction: `${DIRECTION}` = DIRECTION.vertical;
  
  @property({ type: Boolean }) error = false;

  @property({ type: Boolean }) success = false;

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean, reflect: true }) multiple = false;

  @property({ type: Boolean }) selectable = false;

  @property({ type: Boolean }) deletable = false;

  @property({ attribute: 'icon-size' }) iconSize: `${ICON_SIZE}` = ICON_SIZE.sm;

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = true;

  @property({ type: Boolean, attribute: 'no-icon' }) noIcon = false;

  /**
   * the component has gray background color for drop-zone style if sets to true
   */
  @property({ type: Boolean, attribute: 'bg-gray' }) bgGray = false;

  /**
   * hide file-list if sets to false
   */
  @property({ type: Boolean, attribute: 'hide-file-list' }) hideFileList = false;

  private _files: FileData[] = [];
  private _invalidFiles: FileData[] = [];

  get hasTooltip() {
    return this.tooltip || this.hasSlotController.test('label-tooltip');
  }

  get hasHint() {
    return this.hint || this.hasSlotController.test('label-hint');
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip',
    'label-hint',
    'add-button'
  );

  private _updateErrorMsg() {
    const files = this._invalidFiles;
    let errMsg = '';
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === 'error') {
        errMsg = item.extra || '';
        break;
      }
    }
    this.errorMessage = errMsg;
    if (errMsg) {
      this.successMessage = '';
    }
  }

  private _removeRelatedInvalidFile(removedFile: FileData) {
    const leftInvalidFiles = this._invalidFiles.filter((file: FileData) => file.id !== removedFile.id);
    this._invalidFiles = leftInvalidFiles || [];
  }

  private _handleChange(event: CustomEvent) {
    const { addedFiles } = event.detail;
    const invalidFiles = event.detail.invalidFiles || [];
    addedFiles.forEach((item: any) => item.id = generateFileUniqueId());
    invalidFiles.forEach((item: any) => item.id = generateFileUniqueId());

    this._invalidFiles = invalidFiles;
    const { multiple, _files: files } = this;
    if (multiple) {
      /**
       * if all selected files are invalid, then show none of them.
       */
      if (addedFiles.length > 0) {
        this._files = files.concat(addedFiles).concat(invalidFiles);
      } else {
        this._files = files;
      }
      this.requestUpdate();
    } else if (addedFiles.length > 0) {
      this._files = addedFiles.slice(0, 1);
      this.requestUpdate();
    }
    this._updateErrorMsg();
    this.emit('sc-change', {
      bubbles: true,
      detail: {
        value: this._files,
        invalidFiles,
      },
    });
  }

  private _handleRemove(event: CustomEvent, index: number) {
    this._echoEvent(event, index);
    const removedFile: FileData[] = this._files.splice(index, 1);
    this._removeRelatedInvalidFile(removedFile[0]);
    this._updateErrorMsg();
    this.requestUpdate();
    this.emit('sc-change', {
      bubbles: true,
      detail: {
        invalidFiles: this._invalidFiles,
        value: this._files,
      },
    });
  }

  private _echoEvent(event: CustomEvent, index?: number, options?: ScEventInit<any>) {
    const value = index !== undefined ? this._files?.[index] : undefined;
    this.emit(event.type as keyof CUSTOM_EVENTS_TYPE, {
      ...options,
      detail: { ...event.detail, value, index },
    });
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  disableUpdate() {
    const uploaderItem = (this.renderRoot as any).querySelector('sc-file-drop-zone') as ScFileDropZone;
    if (uploaderItem) {
      uploaderItem.disabled = this.disabled;
    }
  }

  @watch('value')
  valueUpdate() {
    const externalVal = this.value && this.value.length > 0 
      ? (this.multiple 
        ? this.value 
        : this.value.slice(0,1)) 
      : [];
    externalVal.forEach((item: any) => item.id = (item.id || generateFileUniqueId()));
    this._files = externalVal;
  }

  @watch('multiple', { waitUntilFirstUpdate: true })
  multiUpdate() {
    if (!this.multiple && this._files && this._files.length > 1) this._files = this._files.slice(0,1);
  }

  render() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const isAddBtnStyle = this.hasSlotController.test('add-button');
    const hasPlaceholderSlot = this.hasSlotController.test('placeholder');
    return html`
      <div 
        class='sc-file-input'
        style='--sc-file-input-width: ${this.width};--sc-form-group-input-min-height: ${this.readonly ? '0' : 'auto'};'
      >
        <sc-text-input
          label=${this.label}
          .required=${this.required}
          ?truncate=${this.truncate}
          ?error=${this.error}
          help-text=${this.helpText}
          error-message=${this.errorMessage}
          success-message=${this.successMessage}
          tooltip=${this.tooltip}
          tooltip-placement=${this.tooltipPlacement}
          hint=${this.hint}
          hint-placement=${this.hintPlacement}
          label-size=${this.labelSize}
        >
          ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
          ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
          ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
          ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
          <slot name='help' slot='help'>${this.helpText}</slot>
          <slot name='error' slot='error'>${this.errorMessage}</slot>
          <slot name='success' slot='success'>${this.successMessage}</slot>
          <div slot="form-control">
            ${this.readonly ? null : 
              !isAddBtnStyle ? 
              html`
              <sc-file-drop-zone
                accept=${this.accept}
                max-size=${this.maxSize}
                ?has-error=${!!this.errorMessage}
                ?bg-gray=${this.bgGray}
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .multiple=${this.multiple}
                @sc-drop-zone-value-change=${this._handleChange}
              >
                ${hasPlaceholderSlot ? html`<slot name='placeholder' slot='placeholder'></slot>` : ''}
              </sc-file-drop-zone>`
              : 
              html`
                <sc-file-button
                  accept=${this.accept}
                  max-size=${this.maxSize}
                  .disabled=${this.disabled}
                  .multiple=${this.multiple}
                  @sc-file-button-value-change=${this._handleChange}
                >
                  <slot name='add-button' slot='add-button'></slot>
                <sc-file-button>
              `
            }
          </div>
        </sc-text-input>
        <div class="sc--file-container" style='margin-top: ${this._files.length > 0 && !this.hideFileList && !this.readonly ? 
          (isAddBtnStyle ? '1rem' : '1.5rem') : '0'};'>
          ${!this.hideFileList ? 
            html`<slot name='file-list'>
              <sc-file-list
                direction=${this.direction}
                @sc-loaded-items=${this._echoEvent}
                @sc-remove-items=${this._echoEvent}
                @sc-select-items=${this._echoEvent}
                @sc-cancel-items=${this._echoEvent}
              >
                ${this._files.map((item, index) => html`
                  <sc-file-item
                    file-id=${item.id}
                    width=${item.width || '100%'} 
                    name=${item.name} 
                    size=${item.size}
                    .selectable=${item.selectable || this.selectable}
                    .deletable=${!this.readonly && !this.disabled && (item.deletable || this.deletable)}
                    icon-size=${item['icon-size'] ? item['icon-size'] : this.iconSize}                      
                    ?no-border=${item['no-border'] ? item['no-border'] : this.noBorder}
                    ?no-icon=${item['no-icon'] ? item['no-icon'] : this.noIcon} 
                    progress-size=${item['progress-size']}
                    progress-text=${item['progress-text']}
                    progress-type=${item['progress-type']}
                    status=${item.status}
                    extra=${item.extra}
                    @sc-loaded=${(e: CustomEvent) => this._echoEvent(e, index)}
                    @sc-cancel=${(e: CustomEvent) => this._echoEvent(e, index)}
                    @sc-remove=${(e: CustomEvent) => this._handleRemove(e, index)}
                    @sc-select=${(e: CustomEvent) => this._echoEvent(e, index, { bubbles: true })}
                    ></sc-file-item>`
                )}
              </sc-file-list>
            </slot>` : ''
          }
        </div>
      </div>
    `;
  }
}
