import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScFileItemStyle from './ScFileItem.style.js';
import { ICON_SIZE } from '../ScIcon/IconBase.js';
import '../../../elements/sc-link.js';
// import '../../../elements/sc-file-icon.js';
import '../../../elements/sc-progress-bar.js';
import '../../../elements/sc-spinner.js';
import '../../../elements/sc-icon.js';
import { watch } from '../../shared/watch.js';

export class ScFileItem extends ScElement {

  static styles = ScTheme.getStyles().concat([ScFileItemStyle]);

  @property({ type: String }) name = '';

  @property({ type: String, attribute: 'file-id'  }) fileId = '';

  @property({ type: Number }) size: any;

  @property({ type: Boolean }) selectable = false;

  @property({ type: Boolean }) deletable = false;

  @property({ type: String }) width = 'max-content';

  @property({ attribute: 'icon-size' }) iconSize: `${ICON_SIZE}` = ICON_SIZE.sm;

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property({ type: Boolean, attribute: 'no-icon' }) noIcon = false;

  @property({ type: Number, attribute: 'progress-size' }) progressSize : any;

  @property({ type: String, attribute: 'progress-text' }) progressText : any;

  @property({ type: String, attribute: 'progress-type' }) progressType: 'success' | 'warning' | 'error' = 'success';

  @property({ attribute: false }) index = -1;

  @property({ type: String }) status: 'default' | 'error' | 'uploading' = 'default';

  @property({ type: String }) extra = '';

  @state() canceled = false;

  @state() selected = false;

  @state() deleted = false;

  private getCommonEventParams() {
    return {
      'file-id': this.fileId,
      name: this.name,
      status: this.status || 'default',
      size: this.size,
      selectable: this.selectable,
      deletable: this.deletable,
      'icon-size': this.iconSize,
      'no-border': this.noBorder,
      'no-icon': this.noIcon,
      'progress-size': this.progressSize,
      'progress-text': this.progressText,
      'progress-type': this.progressType,
      canceled: this.canceled,
      selected: this.selected,
      deleted: this.deleted,
      extra: this.extra,
    };
  }

  private handleDelete(event: MouseEvent) {
    event.stopPropagation();
    if (this.status === 'uploading') {
      this.canceled = true;
    } else {
      this.deleted = true;
    }
    this.emit(this.status === 'uploading' ? 'sc-cancel' : 'sc-remove', {
      bubbles: true,
      detail: {
        ...this.getCommonEventParams(),
        target: event.target,
      },
    });
  }

  formatByte(size: number) {
    const kb = Math.floor(size / 1024);
    const mb = Math.floor(kb / 1024);
    const gb = Math.floor(mb / 1024);
    if (gb) {
      return `${Number(mb / 1024).toFixed(1)} GB`;
    } else if (mb) {
      return `${Number(kb / 1024).toFixed(1)} MB`;
    } else if (kb) {
      return `${Number(size / 1024).toFixed(1)} KB`;
    } else {
      return `${Number(size).toFixed(1)} B`;
    }
  }

  private onSelect(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.selected = true;
    this.emit('sc-select', {
      bubbles: true,
      detail: {
        ...this.getCommonEventParams(),
        target: event.target,
      },
    });
  }

  private getIconBeforeName() {
    let icon;
    switch (this.status) {
      case 'error':
        icon = html`<sc-icon class="file-item-icon-error" name="alert-circle--fill" size=${this.iconSize} />`;
        break;
      case 'uploading':
        icon = html`<sc-spinner class="file-item-icon-loading"></sc-spinner>`;
        break;
      default:
        icon = html`<sc-icon class="file-item-icon-paper-clip" name="paper-clip" size=${this.iconSize} />`;
        break;
    }
    return icon;
  }

  @watch('status')
  patchUploadEvent() {
    this.emit('sc-loaded', {
      bubbles: true,
      detail: {
        ...this.getCommonEventParams(),
        target: this,
      },
    });
  }

  render() {
    return html`
      <div 
        class=${classMap({
    ['sc-file-item']: true,
    ['no-border']: this.noBorder,
    ['no-icon']: this.noIcon,
    ['error-state']: this.status === 'error',
    ['uploading-state']: this.status === 'uploading',
    [this.fileId]: Boolean(this.fileId),
  })}
        style='width:${this.width}'
      >
        <div class='file-info-wrapper input-file-list'>
          ${this.noIcon ? null : this.getIconBeforeName()}
          <div class="file-item-main">
            <div class="file-item-body">
              ${this.selectable 
                ? html`
                          <sc-link class=${classMap({ 'file-name': true, 'pending-text': this.status === 'uploading' })} @click=${this.onSelect}>${this.name}</sc-link>
                        `
                : html`
                          <div class=${classMap({ 'input-file-list': true ,'file-name': true, 'pending-text': this.status === 'uploading' })}>
                            ${this.name}                
                          </div>
                        `
              }
            <slot></slot>
            ${this.size 
      ? html`
                <div class="input-file-list file-size">
                  ${this.progressSize 
      ? html`
                        ${this.progressText 
      ? `${this.progressText}: ` 
      : null
}
                      ${this.formatByte(this.progressSize)} out of ${this.formatByte(this.size)}
                    ` 
    : html`
                    ${this.formatByte(this.size)}
                  `
}
              </div>
            `
    : null
}
            ${this.progressSize && this.size 
      ? html`
                <div class="progress-bar-wrapper">
                  <sc-progress-bar
                    value=${(100 * this.progressSize) / this.size}
                    type='${this.progressType}'
                  ></sc-progress-bar>
                </div>`
      : null
}
          </div>
          ${this.extra ? html`
            <div class="file-item-extra">
              ${this.extra}
            </div>`
            : null}
            </div>
        </div>
        ${this.deletable 
    ? html`
            <div
              class=${classMap({ 'danger-button': this.status !== 'uploading' })}
              part="delete"
              @click=${this.handleDelete}
              role="button"
              tabIndex={0}
            >
            <sc-icon name=${this.status === 'uploading' ? 'cross' : 'trash--line'}></sc-icon>
          </div>`
    : null
}
      </div>
    `;
  }
}