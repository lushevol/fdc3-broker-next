import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.component.js';
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details.component.js';
import ScTheme from '../../styles/ScTheme.js';
import { HasSlotController, getTextContent } from '../../shared/slot.js';
import '../../../elements/sc-icon.js';
import ScElement from '../../shared/sc-element.js';

enum ALERT_TYPE {
  'default' = 'default',
  'info' = 'info',
  'success' = 'success',
  'warning' = 'warning',
  'error' = 'error',
  'disabled' = 'disabled',
}

enum ALERT_MODE {
  'default' = 'default',
  'banner' = 'banner',
}

export class ScAlert extends ScElement {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-alert': SlAlert,
      'sl-details': SlDetails,
    };
  }

  @property() type: `${ALERT_TYPE}` = ALERT_TYPE.info;

  @property() mode: `${ALERT_MODE}` = ALERT_MODE.default;

  @property({ type: String }) title = '';

  @property({ type: Boolean, reflect: true }) expand = false;

  @property({ type: Boolean, reflect: true }) closable = false;  

  @property({ type: Boolean, reflect: true }) icon = false;  
  
  @property({ type: Boolean, reflect: true }) open = true;
  
  @property({ type: Boolean, attribute: 'full-width' }) fullWidth = false;
  
  private readonly hasSlotMessage = new HasSlotController(this, 'content');

  @state() slotContentHTML = '';
  @state() slotTitleHTML = '';

  renderAlertStyle() {
    const alertStyle = html`
    <style>
      .sc-alert::part(base) {
        font-family: inherit;
        border: none;
        border-radius: var(--sc-radius-md, .5rem);
        background-color: transparent;
        padding: 0;
        align-items: stretch !important;
        display: flex !important;
        position: relative;
        /*margin-bottom: 1rem;*/
      }
      .sc-alert.full-width::part(base) {
        width: 100%;
        max-width: none;
        border-radius: 0;
        margin: 0;
      }
      .sc-alert::part(icon) {
        padding: .625rem;
        border-top-left-radius: var(--sc-radius-md, .5rem);
        border-bottom-left-radius: var(--sc-radius-md, .5rem);
        align-items: flex-start;
        color: #ffffff;
        display: flex;
      }
      .sc-alert.alert-banner-icon::part(icon) {
        padding-right: 0;
        margin-left: .5rem;
      }
      .sc-alert::part(message) {
        padding: .5rem 2rem .5rem 1rem;
        line-height: 1.5rem;
        font-weight: 400;
        align-self: center;
      }
      .sc-alert::part(close-button) {
        padding: .5rem .875rem .5rem 0;
        color: var(--sc-alert-close-button-color, var(--sc-color-grey-600));
        margin-top: .25rem;
        align-items: flex-start;
      }
      .custom-detail-icons::part(summary) {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.5rem;
      }
      .custom-detail-icons::part(base) {
        border: none;
        background-color: transparent;
      }
      .custom-detail-icons::part(summary-icon) {
        rotate: none;
        padding-left: .625rem;
        padding-right: .625rem;
      }
      .custom-detail-icons::part(header) {
        padding: 0;
        outline: none;
      }
      .custom-detail-icons::part(content) {
        padding: 0;
        margin-right: .625rem;
        line-height: 1.375rem;
      }
      .sc-alert::part(close-button__base) {
        padding: 0;
      }
      .sc-alert sc-icon {
        display: flex;
        align-items: flex-start; 
      }
      .content-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .close-icon {
        color: var(--sc-alert-close-button-color, var(--sc-color-grey-400));
        cursor: pointer;
        position: absolute;
        right: .625rem;
        top: .75rem;
        margin-left: -0.375rem;
      }
      .expand-icon {
        color: var(--sc-alert-close-button-color, var(--sc-color-grey-400));
        display: flex;
        position: absolute;
        right: .625rem;
      }
      .collapse-icon {
        color: var(--sc-alert-close-button-color, var(--sc-color-grey-400));
        display: flex;
        position: absolute;
        right: .625rem;
      }
      .expand-icon.closable {
        right: 2rem;
      }
      .collapse-icon.closable {
        right: 2rem;
      }
    </style>
    `;
    const infoDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-info-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-info-default-border-color, var(--sc-color-blue-350));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-info-default-icon-background-color,
            var(--sc-color-blue-350)
          );
          color: var(
            --sc-alert-info-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-info-default-text-color,
            var(--sc-color-blue-500)
          );
        }
      </style>
    `;
    const infoBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-info-banner-background-color,
            var(--sc-color-blue-100)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-info-banner-icon-color,
            var(--sc-color-blue-650)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-info-banner-text-color,
            var(--sc-color-blue-650)
          );
        }
      </style>
    `;
    const successDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-success-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-success-default-border-color, var(--sc-color-green-500));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-success-default-icon-background-color,
            var(--sc-color-green-500)
          );
          color: var(
            --sc-alert-success-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-success-default-text-color,
            var(--sc-color-green-700)
          );
        }
      </style>
    `;
    const successBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-success-banner-background-color,
            var(--sc-color-green-100)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-success-banner-icon-color,
            var(--sc-color-green-700)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-success-banner-text-color,
            var(--sc-color-green-700)
          );
        }
      </style>
    `;
    const warningDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-warning-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-warning-default-border-color, var(--sc-color-amber-400));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-warning-default-icon-background-color,
            var(--sc-color-amber-400)
          );
          color: var(
            --sc-alert-warning-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-warning-default-text-color,
            var(--sc-color-amber-700)
          );
        }
      </style>
    `;
    const warningBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-warning-banner-background-color,
            var(--sc-color-amber-100)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-warning-banner-icon-color,
            var(--sc-color-amber-700)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-warning-banner-text-color,
            var(--sc-color-amber-700)
          );
        }
      </style>
    `;
    const errorDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-error-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-error-default-border-color, var(--sc-color-red-500));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-error-default-icon-background-color,
            var(--sc-color-red-500)
          );
          color: var(
            --sc-alert-error-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-error-default-text-color,
            var(--sc-color-red-700)
          );
        }
      </style>
    `;
    const errorBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-error-banner-background-color,
            var(--sc-color-red-50)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-error-banner-icon-color,
            var(--sc-color-red-700)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-error-banner-text-color,
            var(--sc-color-red-700)
          );
        }
      </style>
    `;
    const disabledDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-disabled-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-disabled-default-border-color, var(--sc-color-grey));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-disabled-default-icon-background-color,
            var(--sc-color-grey)
          );
          color: var(
            --sc-alert-disabled-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-disabled-default-text-color,
            var(--sc-color-blue-900)
          );
        }
      </style>
    `;
    const disabledBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-disabled-banner-background-color,
            var(--sc-color-grey-lighter)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-disabled-banner-icon-color,
            var(--sc-color-blue-900)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-disabled-banner-text-color,
            var(--sc-color-blue-900)
          );
        }
      </style>
    `;
    const defaultDefaultStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-default-default-background-color,
            transparent
          );
          box-shadow: inset 0px 0px 0px 1.5px
            var(--sc-alert-default-default-border-color, var(--sc-color-grey-350));
        }
        .sc-alert::part(icon) {
          background-color: var(
            --sc-alert-default-default-icon-background-color,
            var(--sc-color-grey-350)
          );
          color: var(
            --sc-alert-default-default-icon-text-color,
            var(--sc-color-white)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-default-default-text-color,
            var(--sc-brand-grey)
          );
        }
      </style>
    `;
    const defaultBannerStyle = html`
      <style>
        .sc-alert::part(base) {
          background-color: var(
            --sc-alert-default-banner-background-color,
            var(--sc-color-grey-100)
          );
        }
        .sc-alert::part(icon) {
          display: ${this.icon ? 'flex' : 'none'};
          color: var(
            --sc-alert-default-banner-icon-color,
            var(--sc-color-grey-500)
          );
        }
        .sc-alert::part(message) {
          color: var(
            --sc-alert-default-banner-text-color,
            var(--sc-color-grey-500)
          );
        }
      </style>
    `;
    let variantStyle;
    switch (this.type) {
      case 'info':
        variantStyle =
          this.mode === 'banner' ? infoBannerStyle : infoDefaultStyle;
        break;
      case 'success':
        variantStyle =
          this.mode === 'banner' ? successBannerStyle : successDefaultStyle;
        break;
      case 'warning':
        variantStyle =
          this.mode === 'banner' ? warningBannerStyle : warningDefaultStyle;
        break;
      case 'error':
        variantStyle =
          this.mode === 'banner' ? errorBannerStyle : errorDefaultStyle;
        break;
      case 'disabled':
        variantStyle =
          this.mode === 'banner' ? disabledBannerStyle : disabledDefaultStyle;
        break;
      default:
        variantStyle = 
        this.mode === 'banner' ? defaultBannerStyle : defaultDefaultStyle;
        break;
    }
    return html` ${alertStyle} ${variantStyle} `;
  }

  getIconName() {
    let name;
    switch (this.type) {
      case 'info':
        name = 'info-circle--line';
        break;
      case 'success':
        name = 'checkmark-circle--line';
        break;
      case 'warning':
        name = 'alert-triangle--line';
        break;
      case 'error':
        name = 'alert-circle--line';
        break;
      case 'disabled':
        name = 'denied';
        break;
      default:
        name = 'info-circle--line';
        break;
    }
    return name;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot?.addEventListener('slotchange', this.handleSlotChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot?.removeEventListener('slotchange', this.handleSlotChange);
  }

  private handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const slotMapping: Record<string, (slot: HTMLSlotElement) => void> = {
      title: slot => (this.slotTitleHTML = getTextContent(slot).trim()),
      content: slot => (this.slotContentHTML = getTextContent(slot).trim()),
    };
    const handler = slot.name === 'title' ? slotMapping['title'] : slotMapping['content'];
    if (handler) {
      handler(slot);
      this.requestUpdate();
    }
  };
  render() {
    const hasTitle = !!this.title || !!this.slotTitleHTML;
    const content = html`
      ${hasTitle && !!this.slotContentHTML ? html`
        <sl-details
          .open=${this.expand}
          class='custom-detail-icons'
        >
          <slot name='title' slot="summary">${this.title}</slot>
          <sc-icon
            name='arrow-ios-upward'
            slot='expand-icon'
            class='expand-icon ${this.closable ? 'closable' : ''}'
            size='md'
          ></sc-icon>
          <sc-icon
            name='arrow-ios-downward'
            slot='collapse-icon'
            class='collapse-icon ${this.closable ? 'closable' : ''}'
            style='display: flex'
            size='md'
          ></sc-icon>
          <slot part="content"></slot>
        </sl-details>
      ` : html`
        <slot name='title'>${this.title}</slot>
        ${this.hasSlotMessage ? html`<slot part="content"></slot>` : ''}`}
    `;
    return html`
      ${this.renderAlertStyle()}
      <sl-alert
        class='sc-alert 
               ${this.closable ? 'alert-closable' : ''}
               ${this.icon ? 'alert-banner-icon' : ''}
               ${this.mode === 'banner' && this.fullWidth ? 'full-width' : ''}
               '
        .open='${this.open}'
        .variant='${this.type}'
        @sl-hide=${this.stopDefaultEvent}
        @sl-show=${this.stopDefaultEvent}
        @sl-after-hide=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-hide'); 
        }}
        @sl-after-show=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-show'); 
        }}
      >
        <slot name='icon' slot='icon'>
          <sc-icon
            name='${this.getIconName()}'
            size='md'
            compact
          ></sc-icon>
        </slot>
        <div class="content-container">
          <div part="message" class="alert__message">
            ${content}
          </div>
          ${this.closable ? html`
            <sc-icon
              class="close-icon"
              name='cross'
              size="sm"
              @click=${() => this.open = false}
            ></sc-icon>
          ` : ''}
        </div>
      </sl-alert>
    `;
  }
}
