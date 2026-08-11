import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { SIZE } from '../../shared/util.js';
import '../../../elements/sc-icon.js';
import { classMap } from 'lit/directives/class-map.js';
import style from './ScSheet.style.js';

interface Position {
  [key: string]: string;
}

const POSITION_MAPPING: Position = {
  top: 'top',
  bottom: 'bottom',  
  left: 'start',
  right: 'end',
};

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

export class ScSideSheet extends ScElement {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([style]);

  static get scopedElements() {
    return {
      'sl-drawer': SlDrawer,
    };
  }

  @property({ type: String }) label = '';
  
  @property() size: `${SIZE}` = SIZE.xs;
  
  @property({ type: String }) width = '';

  @property({ type: String }) position = 'right';

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Boolean, reflect: true }) contained = false;

  @property({ type: Boolean, attribute: 'no-header', reflect: true }) noHeader = false;

  @property({ type: Boolean, attribute: 'no-close-icon', reflect: true }) noCloseIcon = false;
  
  @property({ type: Boolean, attribute: 'disable-outside-click', reflect: true }) disableOutsideClick = false;

  @property({ type: Boolean, attribute: 'no-footer', reflect: true }) noFooter = true;
  
  @property({ type: Boolean, attribute: 'no-header-bottom-border', reflect: true }) noHeaderBottomBorder = false;
 
  @property({ type: Boolean, attribute: 'no-footer-top-border', reflect: true }) noFooterTopBorder = false;

  @property({ type: String, attribute: 'primary-action' }) primaryAction = 'submit';

  @property({ type: String, attribute: 'primary-action-label' }) primaryActionLabel = 'Submit';

  @property({ type: String, attribute: 'secondary-action' }) secondaryAction = 'cancel';

  @property({ type: String, attribute: 'secondary-action-label' }) secondaryActionLabel = 'Cancel';
  
  @property({ type: String, attribute: 'other-action' }) otherAction = 'skip';

  @property({ type: String, attribute: 'other-action-label' }) otherActionLabel = 'Skip';  

  eventHandlers: any = {};

  connectedCallback() {
    super.connectedCallback();

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

    const sideSheet = (this.renderRoot as any).querySelector(
        // eslint-disable-line
      '.sc-side-sheet'
    );
    if (sideSheet) {
      sideSheet.removeEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }
  } 

  protected firstUpdated(): void {
    const sideSheet = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-side-sheet'
    );
    if (sideSheet) {
      sideSheet.addEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }
  }

  renderDrawerStyle() {
    const wrapperStyle = html`
      <style>
        .sc-side-sheet {
          color: var(--sc-side-sheet-font-color);
        }
      </style>
    `;
    const overlayStyle = html`
      <style>
        .sc-side-sheet::part(overlay) {
          background-color: rgba(0, 0, 0, 0.35);
          display: var(--sc-sheet-overlay-display, block);
        }
      </style>
    `;
    const headerActionStyle = html`
      <style>
        .sc-side-sheet::part(header-actions) {
          padding: var(--sc-sheet-header-spacing) var(--sc-sheet-header-spacing) 0 0;
          align-self: flex-start;
        }
      </style>
    `;
    const hiddenHeader = html`
      <style>
        .sc-side-sheet::part(header) {
          display: none;
        }
      </style>
    `;
    const bodyStyle = html`
      <style>
        .sc-side-sheet::part(body) {
          padding:var(--sc-sheet-body-spacing, var(--sc-sheet-spacing-4));
          padding-bottom: var(--sc-sheet-padding-bottom, --sc-sheet-body-spacing);
        }
        .sc-side-sheet::part(panel) {
          background-color: var(--sc-sheet-panel-background, var(--sc-side-sheet-background-color));
          color: var(--sc-side-sheet-font-color);
        }
      </style>
    `;
    const topStyle = html`
      <style>
        .sc-side-sheet::part(panel) {
          height: auto;
          border-radius: 0 0 16px 16px;
        }
      </style>
    `;    
    const bottomStyle = html`
      <style>
        .sc-side-sheet::part(panel) {
          height: auto;
          border-radius: 16px 16px 0 0;
        }
      </style>
    `;    
    const closeIconStyle = html`
    <style>
      .sc-side-sheet::part(close-button) {
        display: none;
      }
    </style>
    `;
    const headerStyle = html`
      <style>
        .sc-side-sheet::part(title) {
          font-size: var(--sc-sheet-title-font-size);
          line-height: var(--sc-sheet-spacing-5);
          color: var(--sc-side-sheet-title-color);
          padding: var(--sc-sheet-header-spacing) var(--sc-sheet-spacing-4);
          font-weight:600;
        }
      </style>
    `;
    const headerBottomBorderStyle = html`
      <style>
        .sc-side-sheet::part(header) {
          border-bottom:1px solid var(--sc-side-sheet-header-border-bottom)
        }
      </style>
      `;
    const footerTopBorderStyle = html`
      <style>
        .sc-side-sheet::part(footer) {
          border-top:1px solid var(--sc-side-sheet-footer-border-top)
        }
      </style>
      `;
    const footerStyle = html`
        <style>
        .sc-side-sheet::part(footer){
          padding:var(--sc-sheet-spacing-1) var(--sc-sheet-spacing-3);
        }
        .sc-side-sheet-footer-container {
          display: flex;
          justify-content: flex-end;
          flex-direction:  row;
          gap: 0.5rem;
        }
        </style>
      `;
    return html`
      ${wrapperStyle} ${overlayStyle} ${headerActionStyle} ${bodyStyle}
      ${this.noHeader ? hiddenHeader : ''}
      ${this.position === 'top' ? topStyle : ''}
      ${this.position === 'bottom' ? bottomStyle : ''}      
      ${this.noCloseIcon ? closeIconStyle : ''} 
      ${headerStyle} 
      ${this.noHeaderBottomBorder ? '' : headerBottomBorderStyle } 
      ${this.noFooterTopBorder ? '' : footerTopBorderStyle} 
      ${footerStyle}
    `;
  }

  handleShowAction(event: CustomEvent) {
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

  handleButtonClick(event: CustomEvent,actionName: string) {
    event.stopPropagation();
    this.emit('sc-action', {
      detail: {
        name: actionName,
        target: event.target,
      },
    });
    this.handleHideAction(event);
  }

  renderButton(actionName: string, actionLabel: string, primary = false) {
    return html`<sc-button size="xs" type="${primary ? 'primary' : 'default'}"
      @click=${(e: CustomEvent) => { this.handleButtonClick(e,actionName); }}>${actionLabel}
    </sc-button>`;
  }

  render() {
    return html`
      ${this.renderDrawerStyle()}
      <sl-drawer
        class='sc-side-sheet'
        .label='${this.label}'
        .open=${this.open}
        ?contained=${this.contained}
        .style='--size: ${this.width ? this.width : SIZE_MAPPING[this.size]}'
        placement='${POSITION_MAPPING[this.position]}'
        @sl-show=${this.handleShowAction}
        @sl-hide=${this.handleHideAction}
      >        
        <slot name='label' slot="label">${this.label}</slot>
        <slot></slot>
        ${this.noFooter ? null : html`<slot name='footer' slot="footer">
          <div class=${classMap({ 'sc-side-sheet-footer-container': !this.noFooter })}>
          ${this.otherAction !== '' 
              ? this.renderButton(this.otherAction, this.otherActionLabel 
                        || this.otherAction)  
              : '' 
          }
          ${this.secondaryAction !== '' 
              ? this.renderButton(this.secondaryAction, this.secondaryActionLabel 
                        || this.secondaryAction) : '' 
          }
          
          ${this.primaryAction !== '' 
            ? this.renderButton(this.primaryAction, this.primaryActionLabel 
                      || this.primaryAction,true) 
            : '' 
          }
          </div>
        </slot>`}
        
      </sl-drawer>
    `;
  }
}
