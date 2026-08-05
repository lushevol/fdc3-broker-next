import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';

export class ScBottomSheet extends ScElement {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-drawer': SlDrawer,
    };
  }

  @property({ type: String }) label = '';

  @property({ type: String }) height = 'auto';

  @property({ type: Boolean, reflect: true }) open = false;
  
  @property({ type: Boolean, reflect: true }) expandable = false;

  @property({ type: Boolean, reflect: true }) contained = false;

  @property({ type: Boolean, attribute: 'contained-with-overlay' }) containedWithOverlay = false;

  @property({ type: String, attribute: 'expand-height' }) expandHeight = 'auto';

  @property({ type: Boolean, attribute: 'show-outer-action' }) showOuterAction = false;

  @property({ type: String, attribute: 'outer-action-title' }) outerActionTitle = '';

  @property({ type: Boolean, attribute: 'no-header', reflect: true }) noHeader = false;

  @property({ type: Boolean, attribute: 'no-close-icon', reflect: true }) noCloseIcon = false;

  @property({ type: Boolean, attribute: 'disable-outside-click', reflect: true }) disableOutsideClick = false;

  static properties = {
    _panelHeight: { state: true },
  };

  @state() _panelHeight = this.expandHeight;
  @state() _panelExpandableHeight = 0;
  @state() _dragging = false;
  @state() _dragPosition = undefined;
  @state() _prevY = 0;
  @state() _currentY = 0;
  @state() _defaultHeight = 0;
  
  eventHandlers: any = {};

  connectedCallback() {
    super.connectedCallback();

    this.initExpandable();

    this.updateComplete.then(() => {
      if (this.expandable && !this.open) {
        this.setExpandablePanelHeight(this._defaultHeight);
      }
    });

    this.eventHandlers.onDrawerClose = (event: any) => {
      if (this.disableOutsideClick) {
        if (event.detail.source === 'overlay' || event.detail.source === 'keyboard') {
          event.preventDefault();
        }
      }
    };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyExpandable();

    const bottomSheet = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-bottom-sheet'
    );
    if (bottomSheet) {
      bottomSheet.removeEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }
  }

  get onlyShowOuterAction() {
    return !this.open && this.showOuterAction;
  }

  initExpandable() {
    const touchPosition = (event: any) =>
      event.touches ? event.touches[0] : event;

    this.eventHandlers.onDragStart = (event: any) => {
      this._dragPosition = touchPosition(event).pageY;
      this._dragging = true;
    };

    this.eventHandlers.onDragMove = (event: any) => {
      if (this._dragPosition === undefined) return;

      const y = touchPosition(event).pageY;
      this._dragPosition = y;
      this._prevY = this._currentY;
      this._currentY = y;
    };

    this.eventHandlers.onDragEnd = () => {
      this._dragPosition = undefined;
      this._dragging = false;

      if (this._prevY < this._currentY) {
        if (this._panelExpandableHeight === this._defaultHeight) {
          this.setExpandablePanelHeight(0);
          this.open = false;
        }
        else {
          this.setExpandablePanelHeight(this._defaultHeight);
        }
      } else if (this._prevY > this._currentY) {
        this.setExpandablePanelHeight(100);
      }
    };

    window.addEventListener('mousemove', this.eventHandlers.onDragMove);
    window.addEventListener('touchmove', this.eventHandlers.onDragMove);
    window.addEventListener('mouseup', this.eventHandlers.onDragEnd);
    window.addEventListener('touchend', this.eventHandlers.onDragEnd);
  }

  destroyExpandable() {
    const draggableArea = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-bottom-sheet .draggable-area.inner-action-bar'
    );
    if (draggableArea) {
      draggableArea.removeEventListener('mousedown', this.eventHandlers.onDragStart);
      draggableArea.removeEventListener('touchstart', this.eventHandlers.onDragStart);
    }

    window.removeEventListener('mousemove', this.eventHandlers.onDragMove);
    window.removeEventListener('touchmove', this.eventHandlers.onDragMove);
    window.removeEventListener('mouseup', this.eventHandlers.onDragEnd);
    window.removeEventListener('touchend', this.eventHandlers.onDragEnd);

    this.eventHandlers = {};
  }

  setExpandablePanelHeight(height: number) {
    this._panelExpandableHeight = height;
    const unit = this.contained ? '%' : 'vh';
    this._panelHeight = `calc(${height}${unit} - ${height > 0 && this.showOuterAction ? 2 : 0}rem)`;
  }

  protected firstUpdated(): void {
    const bottomSheet = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-bottom-sheet'
    );
    if (bottomSheet) {
      bottomSheet.addEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }

    const draggableArea = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-bottom-sheet .draggable-area.inner-action-bar'
    );
    if (draggableArea) {
      draggableArea.addEventListener('mousedown', this.eventHandlers.onDragStart);
      draggableArea.addEventListener('touchstart', this.eventHandlers.onDragStart);
    }
  }

  renderDrawerStyle() {
    const wrapperStyle = html`
      <style>
        .sc-bottom-sheet {
          color: var(--sc-bottom-sheet-font-color, var(--sc-color-blue-900));
        }
        .outer-action-bar-wrap {
          position: fixed;
          left: 0;
          right: 0;
          width: calc(100vw - var(--sc-layout-sticky-bar-left-offset, 0px));
          bottom: max(var(--sc-bottom-offset, 0px), 0px);
          display: flex;
          justify-content: center;
          pointer-events: none;

          &.contained {
            position: absolute;
            bottom: 0px;
          }
        }
        .outer-action-bar.draggable-area {
          position: relative;
          margin: 0;
          width: -webkit-fit-content;
          width: fit-content;
          min-width: 3rem;
          height: 2rem;
          padding: 0 0.75rem;
          display: inline-flex;
          text-align: center;
          pointer-events: auto;
        }
        
        .draggable-bar {
          /* border and background part */
          --r: 1em; /* the radius */
          --smallR: 0.25rem;
          --bg-color: var(
                  --sc-bottom-sheet-background-color,
                  var(--sc-color-white)
                );

          position: relative;
          box-sizing: border-box;
          height: 2rem;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 0.25rem;
          padding: 0 0.75rem;
          background: var(--bg-color);
          box-shadow: 0px 0px 4px 0px rgba(26, 26, 26, 0.15);
          opacity: 0.9;
          border: 1px solid rgba(255, 255, 255, 0);
          border-radius: var(--r) var(--r) 0 0;
        }
        .rotate-90 {
          transform: rotateZ(90deg);
        }
        .sc-bottom-sheet .inner-action-bar.draggable-area {
          position: absolute;
          top: -5px;
          left: 0;
          right: 0;          
          margin: auto;
          width: 3rem;
          margin: auto;
          padding: 0.75rem;
          cursor: ${this._dragging ? 'grabbing' : 'grab'};

          &.outer-action {
            top: -2rem;
            padding: 0 0.75rem;
            text-align: center;
            transform: translateX(-50%);
          }
        }
        .sc-bottom-sheet .draggable-thumb {
          height: 0.25rem;
          border-radius: 0.125rem;
          background: var(
            --sc-bottom-sheet-draggable-color,
            var(--sc-color-grey-70)
          );
        }
      </style>
    `;
    const overlayStyle = html`
      <style>
        .sc-bottom-sheet::part(overlay) {
          background-color: rgba(0, 0, 0, 0.35);
        }
        .sc-bottom-sheet.contained-with-overlay::part(overlay) {
          display: block !important;
          position: absolute;
        }
      </style>
    `;
    const headerActionStyle = html`
      <style>
        .sc-bottom-sheet::part(header-actions) {
          padding: var(--header-spacing) var(--header-spacing) 0 0;
          align-self: flex-start;
        }
      </style>
    `;
    const hiddenHeader = html`
      <style>
        .sc-bottom-sheet::part(header) {
          display: none;
        }
      </style>
    `;
    const bodyStyle = html`
      <style>
        .sc-bottom-sheet::part(body) {
          padding: var(--sc-bottom-sheet-body-padding, 1.5rem);
        }
        .sc-bottom-sheet::part(panel) {
          background: var(
            --sc-bottom-sheet-background-color,
            var(--sc-color-white)
          );
          color: var(--sc-bottom-sheet-font-color, var(--sc-color-blue-900));
        }
      </style>
    `;
    const panelStyle = html`
      <style>
        .sc-bottom-sheet::part(panel) {
          border-radius: ${this._panelExpandableHeight === 100 ? '0' : '16px 16px 0 0'};
          user-select: ${this._dragging ? 'none' : 'auto'};
          overflow: ${this.showOuterAction ? 'visible' : 'auto'};
        }
      </style>
    `;
    const closeIconStyle = html`
      <style>
        .sc-bottom-sheet::part(close-button) {
          display: none;
        }
      </style>
    `;
    return html`
      ${wrapperStyle} ${overlayStyle} ${headerActionStyle} ${bodyStyle} ${panelStyle}
      ${this.noHeader ? hiddenHeader : ''}
      ${this.noCloseIcon ? closeIconStyle : ''}  
    `;
  }

  handleShowAction(event: CustomEvent) {
    if (this.expandable) {
      this._defaultHeight = this.expandHeight === 'auto' ? 50 : Number.parseInt(this.expandHeight);
      this.setExpandablePanelHeight(this._defaultHeight);
    }
    this.stopDefaultEvent(event);
    this.emit('sc-show', {
      detail: {
        open: true,
      },
    });
  }

  handleHideAction(event: CustomEvent) {
    this.stopDefaultEvent(event);
    this.open = false;
    this.emit('sc-hide', {
      detail: {
        open: false,
      },
    });
  }

  render() {
    return html`
      ${this.renderDrawerStyle()}
      ${
        this.onlyShowOuterAction && !this.open
        ? html`
          <div class="outer-action-bar-wrap ${this.contained ? 'contained' : ''}">
            <div class="outer-action-bar draggable-area">
            <slot name="outer-draggable-area">
              <div class="draggable-bar"  @click=${this.handleShowAction}>
                <sc-icon name="arrow-ios-${!this.open ? 'up' : 'down'}ward"></sc-icon>
                <slot name="outer-draggable-title">
                  <sc-paragraph>${this.outerActionTitle}</sc-paragraph>
                </slot>
                <sc-icon name="drag-handle" class="rotate-90"></sc-icon>
              </div>
            </slot>
            </div>
          </div>
        `
        : null
      }
      <sl-drawer
        class="sc-bottom-sheet ${this.contained && this.containedWithOverlay ? 'contained-with-overlay' : ''}"
        label='${this.label}'
        .open=${this.open}
        ?contained=${this.contained}
        style='--size: ${this.expandable ? this._panelHeight : this.height}'
        placement='bottom'
        @sl-show=${this.handleShowAction}
        @sl-hide=${this.handleHideAction}
      >
        ${html`
          <div slot='header-actions'>
            <div
              class="draggable-area inner-action-bar ${this.showOuterAction ? 'outer-action' : ''}"
              style='display: ${this.expandable ? 'block' : 'none'}'
            >
              <slot name="draggable-area">
                <div class='draggable-thumb'></div>
              </slot>
            </div>
          </div>
        `}
        <slot name='label' slot="label">${this.label}</slot>
        <slot></slot>
      </sl-drawer>
    `;
  }
}
