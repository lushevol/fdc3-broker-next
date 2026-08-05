import { html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { ScFileItem } from './ScFileItem.js';
import '../../../elements/sc-file-item.js';
import { watch } from '../../shared/watch.js';
import { DIRECTION } from '../../shared/util.js';
import { customListener } from '../../shared/sc-custom-events.js';

export class ScFileList extends ScElement {
  static styles = ScTheme.getStyles();

  @queryAssignedElements({ selector: 'sc-file-item' })
  public files: Array<ScFileItem>;

  @property({ reflect: true }) direction: `${DIRECTION}` = DIRECTION.vertical;

  updatedFileListData: any;

  constructor() {
    super();

    this.updatedFileListData = {
      currentFiles: [],
      removedItems: [],
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sc-loaded', this._handleLoad);
    this.addEventListener('sc-remove', this._handleRemove);
    this.addEventListener('sc-select', this._handleSelect);
    this.addEventListener('sc-cancel', this._handleCancel);
  }

  private emitEvent(event: CustomEvent, eventName: any) {
    this.emit(eventName, {
      detail: {
        value: this.updatedFileListData,
        originalEvent: event,
      },
    });
  }

  private _handleLoad = customListener(event => {
    this.updatedFileListData.currentFiles.push(event.detail);
    this.emitEvent(event, 'sc-loaded-items');
  });

  private _handleRemove = customListener(event => {
    // get rid of the removed file item
    this.updatedFileListData.currentFiles = this.updatedFileListData.currentFiles.filter((file: any) => file['file-id'] !== event.detail['file-id']); 
    this.updatedFileListData.removedItems.push(event.detail);
    this.emitEvent(event, 'sc-remove-items');
  });

  private _handleSelect = customListener(event => {
    this.updatedFileListData.currentFiles.forEach((file: any) => {
      if (file['file-id'] === event.detail['file-id']) {
        file.selected = event.detail.selected;
      }
    });
    this.emitEvent(event, 'sc-select-items');
  });
  private _handleCancel = customListener(event => {
    this.updatedFileListData.currentFiles.forEach((file: any) => {
      if (file['file-id'] === event.detail['file-id']) {
        file.canceled = event.detail.canceled;
      }
    });
    this.emitEvent(event, 'sc-cancel-items');
  });

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sc-loaded', this._handleLoad);
    this.removeEventListener('sc-remove', this._handleRemove);
    this.removeEventListener('sc-select', this._handleSelect);
    this.removeEventListener('sc-cancel', this._handleCancel);
  }

  @watch(['direction'], { waitUntilFirstUpdate: true })
  syncProperties(): void {
    this.setAttribute('direction', this.direction);
    this.files.forEach((file: ScFileItem, index: number) => {
      file.index = index;
      file.classList.add('sc-file-item');
      file.setAttribute('id', `sc-file-${index}`);
      if (this.direction === 'horizontal') {
        file.style.setProperty('display', 'inline-block');
      } else {
        file.style.setProperty('display', 'block');
      }
    });
  }

  private filesChanged(): void {
    this.classList.add('sc-file-list');
    this.syncProperties();
  }

  render() {
    return html`<slot @slotchange=${this.filesChanged}></slot>`;
  }
}
