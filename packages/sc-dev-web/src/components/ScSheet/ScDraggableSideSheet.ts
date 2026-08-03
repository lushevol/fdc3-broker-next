import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { SIZE } from '../../shared/util.js';
import '../../../elements/sc-icon.js';
import ScDraggableSideSheetStyle from './ScDraggableSideSheet.style.js';

interface Size {
  [key: string]: string;
}

const SIZE_MAPPING: Size = {
  xxs: '320px',
  xs: '400px',  
  sm: '480px',
  md: '560px',
  lg: '640px',
};

export class ScDraggableSideSheet extends ScElement {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([ScDraggableSideSheetStyle]);

  @property({ type: String }) label = '';
  
  @property() size: `${SIZE}` = SIZE.xs;
  
  @property({ type: String }) width = '';

  @property({ type: Boolean, reflect: true }) fixed = false;

  @property({ type: Boolean, attribute: 'no-header', reflect: true }) noHeader = false;

  @query('.draggable-side-sheet') sideSheet: HTMLElement | null;

  @query('.draggable-icon-container') icon: HTMLElement | null;

  @state() closed: boolean;

  _startX: number | undefined;

  _width: number;

  _deltaX: number | undefined;

  onMouseDown(event: MouseEvent) {
    event.preventDefault?.();
    this._startX = event.clientX;
    if (this.sideSheet) {
      this._width = this.sideSheet.clientWidth;
    }
  }

  onMouseMove(event: MouseEvent) {
    const currentX = event.clientX;
    if (this._startX) {
      this._deltaX = currentX - this._startX;
      if (this.sideSheet) {
        const width = this._width - this._deltaX;
        if (width < 0 || width > window.innerWidth * 0.7) return;
        this.sideSheet.style.width = `${this._width - this._deltaX  }px`;
        this.closed = false;
        this.emit('sc-dragging', {
          detail: {
            width: this._width - this._deltaX,
          },
        });
      }
    }
  }

  onMouseUp() {
    if (this._deltaX) {
      this.reset();
    } else {
      this.toggleClosed();
    }
  }

  onMouseOut() {
    this.reset();
  }

  reset() {
    this._startX = undefined;
    this._deltaX = undefined;
    if (this.sideSheet) {
      this._width = this.sideSheet.clientWidth;
    }
  }

  private toggleClosed() {
    this.closed = !this.closed;
    const isClosed = !!this.closed;
    this.updateComplete.then(() => {
      const width = isClosed ? 0 : this.sideSheet?.clientWidth ?? 0;
      this.emit(isClosed ? 'sc-hide' : 'sc-show', {
        detail: { width },
      });
    });
  }

  onDoubleClick() {
    this.toggleClosed();
  }

  render() {
    return html`
      <div
        style='width: ${this.width ? this.width : SIZE_MAPPING[this.size]}'
        class=${classMap({
    'draggable-side-sheet': true,
    closed: this.closed,
    fixed: this.fixed,
  })}
      >
        <div class=content part=content>
          ${this.noHeader ? nothing : html`<slot name=header>
            <h2 part=header>
              <slot name=label>${this.label}</slot>
            </h2>
          </slot>`}
          <slot></slot>
        </div>
        
        <div class=draggable-icon-container>
          <span 
            class=draggable-icon
            part=draggable-icon
          >
            <span class=divider></span>
          </span>
          <span 
            class=cover
            @mousedown=${this.onMouseDown}
            @mouseup=${this.onMouseUp}
            @mousemove=${this.onMouseMove}
            @mouseout=${this.onMouseOut}
            @dblclick=${this.onDoubleClick}
          ></span>
        </div>
        
      </div>
    `;
  }
}
