import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-icon.js';

export class ScActionSheet extends ScElement {
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

  @property({ type: String, attribute: 'primary-action' }) primaryAction = '';

  @property({ type: String, attribute: 'primary-action-label' }) primaryActionLabel = '';

  @property({ type: String, attribute: 'secondary-action' }) secondaryAction = '';

  @property({ type: String, attribute: 'secondary-action-label' }) secondaryActionLabel = '';
  
  @property({ type: String, attribute: 'other-action' }) otherAction = '';

  @property({ type: String, attribute: 'other-action-label' }) otherActionLabel = '';  

  @property({ type: String }) height = 'auto';

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Boolean, reflect: true }) contained = false;

  @property({ type: Boolean, attribute: 'no-header', reflect: true }) noHeader = false;

  @property({ type: Boolean, attribute: 'no-close-icon', reflect: true }) noCloseIcon = false;

  @property({ type: Boolean, attribute: 'disable-outside-click', reflect: true }) disableOutsideClick = false;

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

    const actionSheet = (this.renderRoot as any).querySelector(
        // eslint-disable-line
      '.sc-action-sheet'
    );
    if (actionSheet) {
      actionSheet.removeEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }
  }

  protected firstUpdated(): void {
    const actionSheet = (this.renderRoot as any).querySelector(
      // eslint-disable-line
      '.sc-action-sheet'
    );
    if (actionSheet) {
      actionSheet.addEventListener('sl-request-close', this.eventHandlers.onDrawerClose);
    }
  }

  renderDrawerStyle() {
    const wrapperStyle = html`
      <style>
        .sc-action-sheet {
          color: var(--sc-action-sheet-font-color, var(--sc-color-blue-900));
        }
      </style>
    `;
    const overlayStyle = html`
      <style>
        .sc-action-sheet::part(overlay) {
          background-color: rgba(0, 0, 0, 0.35);
        }
      </style>
    `;
    const headerActionStyle = html`
      <style>
        .sc-action-sheet::part(header-actions) {
          padding: var(--header-spacing) var(--header-spacing) 0 0;
          align-self: flex-start;
        }
      </style>
    `;
    const hiddenHeader = html`
      <style>
        .sc-action-sheet::part(header) {
          display: none;
        }
      </style>
    `;    
    const bodyStyle = html`
      <style>
        .sc-action-sheet::part(panel) {
          background: var(
            --sc-action-sheet-background-color,
            var(--sc-color-white)
          );
          color: var(--sc-action-sheet-font-color, var(--sc-color-blue-900));
        }
      </style>
    `;
    const panelStyle = html`
      <style>
        .sc-action-sheet-action-container {
          display: flex;
          flex-direction: var(--sc-action-sheet-container-direction, row);
          gap: 1rem;
          margin: var(--sc-action-sheet-action-container-margin, 30px 0);
        }
      </style>
    `;
    const closeIconStyle = html`
      <style>
        .sc-action-sheet::part(close-button) {
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
    this.stopDefaultEvent(event);
    this.emit('sc-show', {
      detail: {
        open: true,
      },
    });
  }

  handleHideAction(event?: CustomEvent) {
    if (event) {
      this.stopDefaultEvent(event);
    }
    this.open = false;
    this.emit('sc-hide', {
      detail: {
        open: false,
      },
    });
  }

  handleButtonClick(actionName: string) {
    this.emit('sc-action', {
      detail: {
        name: actionName,
      },
    });
    this.handleHideAction();
  }

  renderButton(actionName: string, actionLabel: string, primary = false) {
    return html`<sc-button .fill='${primary}' 
      @click=${() => { this.handleButtonClick(actionName); }}>${actionLabel}
    </sc-button>`;
  }

  render() {  
    return html`
      ${this.renderDrawerStyle()}
      <sl-drawer
        class='sc-action-sheet'
        label='${this.label}'
        .open=${this.open}
        ?contained=${this.contained}
        style='--size: ${this.height ?? 'auto'}'
        placement='bottom'
        @sl-show=${this.handleShowAction}
        @sl-hide=${this.handleHideAction}
      >
        <slot name='label' slot="label">${this.label}</slot>
        <slot></slot>
        <div class='sc-action-sheet-action-container'>
          ${this.primaryAction !== '' 
    ? this.renderButton(this.primaryAction, this.primaryActionLabel 
              || this.primaryAction, true) 
    : '' 
}
          ${this.secondaryAction !== '' 
    ? this.renderButton(this.secondaryAction, this.secondaryActionLabel 
              || this.secondaryAction) : '' 
}
          ${this.otherAction !== '' 
    ? this.renderButton(this.otherAction, this.otherActionLabel 
              || this.otherAction)  
    : '' 
}
        </div>
      </sl-drawer>
    `;
  }
}
