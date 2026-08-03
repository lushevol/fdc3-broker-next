import { html } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { COMPACT_SIZE, BUTTON_STATE } from '../../shared/util.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-pagination.js';
import '../../../elements/sc-scrollbar.js';
import { styleMap } from 'lit/directives/style-map.js';
import { watch } from '../../shared/watch.js';
import { classMap } from 'lit/directives/class-map.js';
import ScModalStyle from './ScModal.style.js';
import { HasSlotController, getTextContent, getInnerHTML } from '../../shared/slot.js';

enum COLOR {
  'default' = 'default',
  'blue' = 'blue',
  'green' = 'green',
  'amber' = 'amber',
  'red' = 'red',
}

enum FOOTER_TYPE {
  'button' = 'button',
  'pagination' = 'pagination',
  'alternative' = 'alternative',
}
export class ScModal extends ScElement {
  static styles = ScTheme.getStyles().concat([ScModalStyle]);

  constructor() {
    super();
  }

  static get scopedElements() {
    return {
      'sl-dialog': SlDialog,
    };
  }

  @property() footer = '';

  @property({ attribute: 'no-header', type: Boolean, reflect: true }) noHeader = false;

  @property({ type: String, attribute: 'header' }) header = '';

  @property({ type: String, attribute: 'title' }) title = '';

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property() color: `${COLOR}` = COLOR.default;

  @property({ attribute: 'expanded-view', type: Boolean }) expandedView = false;

  @property({ attribute: 'footer-type' }) footerType?: `${FOOTER_TYPE}`;

  @property({ type: Boolean, reflect: true }) icon = false;  

  @property({ type: Boolean, reflect: true }) divider = false;  

  @property({ attribute: 'no-footer', type: Boolean, reflect: true }) noFooter = false;

  @property({ attribute: 'no-close-icon', type: Boolean, reflect: true }) noCloseIcon = false;

  @property({ attribute: 'no-padding', type: Boolean , reflect: true }) noPadding = false;
    
  @property({ type: Boolean, reflect: true }) open = false;

  @property({ attribute: 'disable-outside-click', type: Boolean, reflect: true }) disableOutsideClick = false;

  @property({ type: Number, attribute: 'pagination-total' }) paginationTotal = 100;

  @property({ type: Boolean, attribute: 'pagination-label' }) paginationLabel = false;

  @property({ type: Number, attribute: 'pagination-page-size' }) paginationPageSize = 10;

  @property({ type: Boolean, attribute: 'pagination-size-changer' }) paginationSizeChanger = false;

  @property({ type: Number, attribute: 'pagination-current-page' }) paginationCurrentPage = 1;

  @property({ type: Array, attribute: 'pagination-disabled-pages' }) paginationDisabledPages: number[] = [];

  @property({ type: Boolean, attribute: 'pagination-jump-first-last-page' }) paginationJumpFirstLastPage = false;

  @property({ attribute: 'button-state-primary' }) buttonStatePrimary: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property({ attribute: 'button-state-secondary' }) buttonStateSecondary: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property({ type: Boolean, attribute: 'button-no-pill' }) buttonNoPill = false;

  @property({ type: Boolean, attribute: 'button-loading-primary' }) buttonLoadingPrimary = false;

  @property({ type: Boolean, attribute: 'button-disable-primary' }) buttonDisablePrimary = false;

  @property({ type: Boolean, attribute: 'button-loading-secondary' }) buttonLoadingSecondary = false;

  @property({ type: Boolean, attribute: 'button-disable-secondary' }) buttonDisableSecondary = false;

  @property({ type: String, attribute: 'button-text-primary' }) buttonTextPrimary = '';

  @property({ type: String, attribute: 'button-text-secondary' }) buttonTextSecondary = '';

  @property({ type: String, attribute: 'button-text-tertiary' }) buttonTextTertiary = '';

  @property({ type: String, attribute: 'button-text-left' }) buttonTextLeft = '';

  @state() private isStacked = false;

  @state() private stickyHeader = false;

  @state() private defaultSlotHeight = 0;

  @query('slot:not([name="icon"]):not([name="title"]):not([name="header"]):not([name="alternative-footer"]):not([name="header-actions"]):not([name="footer"])') 
  defaultSlot: HTMLSlotElement;

  private buttonFooterObserver?: ResizeObserver;

  private defaultSlotObserver?: ResizeObserver;

  @state() private hasSlotContent = false;

  protected readonly hasSlotController = new HasSlotController(
    this,
    'header',
    'title',
    'footer-button',
    'footer-left',
    'footer'
  );

  protected firstUpdated(): void {
    this.observeButtonFooter();
    this.addEventListener('sl-request-close', (event: any) => {        
      if (this.disableOutsideClick && event.detail.source === 'overlay') {
        event.preventDefault();
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    [...this.childNodes].filter((node: any) => {
      if ('getAttribute' in node && node.getAttribute('slot') === 'footer') {
        node.querySelectorAll('sc-button').forEach((btn: any, index: number) => {
          if (index > 0) {
            btn.style.setProperty('margin-left', '.5rem');
          }
        });
      }
    });
  }
  
  disconnectedCallback() {
    if (this.buttonFooterObserver) {
      const buttonElement = this.shadowRoot?.querySelector('.button-footer');
      if (buttonElement) {
        this.buttonFooterObserver.unobserve(buttonElement);
      }
      this.buttonFooterObserver = undefined;
    }
    if (this.defaultSlotObserver) {
      const modalContent = this.shadowRoot?.querySelector('.default-slot') as HTMLElement;
      if (modalContent) {
        this.defaultSlotObserver.unobserve(modalContent);
      }
      this.defaultSlotObserver = undefined;
    }
    super.disconnectedCallback();
  }
  
  @watch(['defaultSlotHeight', 'defaultSlot'])
  observeDefaultSlot() {
    this.updateComplete.then(() => {
      this.updateStickyHeader();
    });

    const modalContent = this.shadowRoot?.querySelector('.default-slot') as HTMLElement;
    if (modalContent) {
      this.defaultSlotObserver = new ResizeObserver(() => {
        this.updateStickyHeader();
      });
      this.defaultSlotObserver.observe(modalContent);
    }
  }

  private updateStickyHeader() {
    const modalContent = this.shadowRoot?.querySelector('.default-slot') as HTMLElement;
    const modalPanel = this.shadowRoot?.querySelector('sl-dialog')?.shadowRoot?.querySelector('[part="panel"]') as HTMLElement;
    const headerContainer = this.shadowRoot?.querySelector('.header-container') as HTMLElement;
    const footer = this.shadowRoot?.querySelector('.footer') as HTMLElement;

    if (modalContent && modalPanel && headerContainer && footer) {
      requestAnimationFrame(() => {
        const panelHeight = modalPanel.clientHeight;
        const headerHeight = headerContainer.clientHeight || 0;
        const footerHeight = footer.clientHeight || 0;

        const availableHeight = panelHeight - headerHeight - footerHeight;
        const scrollHeight = modalContent.scrollHeight;
        this.defaultSlotHeight = scrollHeight;
        const isOverflowing = scrollHeight > availableHeight;

        this.stickyHeader = isOverflowing;
      });
    }
  }
  
  @watch(['buttonTextLeft', 'buttonTextTertiary', 'buttonTextSecondary', 'buttonTextPrimary', 'footerType'])
  observeButtonFooter() {
    this.updateComplete.then(() => {
      this.updateButtonFooterLayout();
    });

    const buttonElement = this.shadowRoot?.querySelector('.button-footer');
    if (buttonElement) {
      this.buttonFooterObserver = new ResizeObserver(() => {
        this.updateButtonFooterLayout();
      });
      this.buttonFooterObserver.observe(buttonElement);
    } else {
      const mutationObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const newButtonElement = this.shadowRoot?.querySelector('.button-footer');
            if (newButtonElement) {
              this.buttonFooterObserver = new ResizeObserver(() => {
                this.updateButtonFooterLayout();
              });
              this.buttonFooterObserver.observe(newButtonElement);
              observer.disconnect(); 
            }
          }
        }
      });
      mutationObserver.observe(this.shadowRoot as Node, { childList: true, subtree: true });
    }
  }

  private updateButtonFooterLayout() {
    const buttonFooter = this.shadowRoot?.querySelector('.button-footer') as HTMLElement;
    const leftButtonContainer = this.shadowRoot?.querySelector('.left-button-container') as HTMLElement;
    const rightButtonContainer = this.shadowRoot?.querySelector('.right-button-container') as HTMLElement;
  
    if (buttonFooter && leftButtonContainer && rightButtonContainer) {
      const wasStacked = this.isStacked;
  
      this.isStacked = false;
      buttonFooter.classList.remove('stacked');
  
      const leftButtonContainerWidth = leftButtonContainer.getBoundingClientRect().width + 8;
      const rightButtonContainerWidth = rightButtonContainer.getBoundingClientRect().width;
  
      if (wasStacked) {
        this.isStacked = true;
        buttonFooter.classList.add('stacked');
      }
  
      requestAnimationFrame(() => {
        const buttonFooterWidth = buttonFooter.offsetWidth - 48;
        const combinedWidth = leftButtonContainerWidth + rightButtonContainerWidth;
  
        this.isStacked = combinedWidth >= buttonFooterWidth;
  
        if (this.isStacked) {
          buttonFooter.classList.add('stacked');
        } else {
          buttonFooter.classList.remove('stacked');
        }
      });
    }
  }

  private handleDefaultSlotChange() {
    const textLabel = getTextContent(this.defaultSlot).trim();
    this.hasSlotContent = textLabel.length > 0;
    this.updateStickyHeader();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('title')) {
      this.updateTitleTextVisibility();
    }
  }

  @watch('title')
  updateTitleTextVisibility() {
    const titleTextElement = this.shadowRoot?.querySelector('.title-text') as HTMLElement;
    if (titleTextElement) {
      titleTextElement.style.marginTop = this.title ? '.5rem' : '0';
    }
  }

  handleButtonClick(buttonType: 'primary' | 'secondary' | 'tertiary' | 'left') {
    this.emit('sc-action', {
      detail: {
        type: buttonType,
      },
    });
  }

  async pageChange(event: CustomEvent) {
    const { page, pageSize } = event.detail;
    if (event.detail.pageSize !== this.paginationPageSize) {
      this.paginationPageSize = event.detail.pageSize;
    }
    this.paginationCurrentPage = page;
    await this.updateComplete;

    this.emit('sc-page-change', {
      detail: {
        page,
        pageSize,
      },
    });
  }

  getIconName() {
    let name;
    switch (this.color) {
      case 'blue':
        name = 'info-circle--fill';
        break;
      case 'amber':
        name = 'alert-triangle--fill';
        break;
      case 'red':
        name = 'alert-circle--fill';
        break;
      case 'green':
      default:
        name = 'checkmark-circle--fill';
        break;
    }
    return name;
  }

  render() {
    const headerClass = this.hasSlotContent || this.footerType ? 'with-content' : 'no-content';
    const width =
      this.size === 'lg' 
        ? '68.375rem' 
        : this.size === 'md' 
          ? '40.438rem' 
          : '26.5rem';
    return html`
      <sl-dialog
        .open=${this.open}
        class=${classMap({
          'sc-modal': true,
          'no-header': this.noHeader && (this.header || this.title 
            || this.hasSlotController.test('header') || this.hasSlotController.test('title')) ,
          'no-close-icon': this.noCloseIcon || this.noHeader,
          'no-padding': this.noPadding,
          'sticky-header': this.stickyHeader,
          'expanded-view': this.expandedView,
          'footer-divider': this.stickyHeader,
          icon: this.icon,
          [this.size]: true,
          [this.footerType ?? '']: true,
          [this.color]: true,
        })}
        style='
        --width: ${width};
        '
        @sl-show=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-show', {
            detail: {
              open: true,
            },
          });
          this.updateStickyHeader();
        }}
        @sl-hide=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-hide', {
            detail: {
              open: false,
            },
          });
        }}
      >
      ${this.noHeader ? '' : html`<div class="header-container ${headerClass}" part="header">
      <div class="header-top">
        <slot name='icon' slot='icon'>
          <sc-icon
            class="icon"
            name="${this.getIconName()}"
            size="md"
            compact
          ></sc-icon>
        </slot>
        <div class="header-text">
          ${this.header ? this.header : html`
            <slot name="header"></slot>
          `}
        </div>
        ${(this.noCloseIcon || this.noHeader) ? '' : html`
          <sc-icon
            class="close-icon"
            name='cross'
            size="sm"
            @click=${() => this.open = false}
          ></sc-icon>
        `}
      </div>
      <div class="title-text">
        ${this.title ? this.title : html`
          <slot name="title"></slot>
        `}
      </div>
      <slot name='header-actions' slot='header-actions'></slot>
    </div>`}
        <sc-scrollbar selector=".default-slot"></sc-scrollbar>
        <div class="default-slot ${this.hasSlotContent ? 'hasContent' : 'noContent'}">
          <slot @slotchange=${this.handleDefaultSlotChange}></slot>
        </div>
        ${this.footerType && !this.noFooter ? html`
          <div class='footer'>
            ${this.footerType === 'pagination' ? html`
              <div class='pagination-footer'>
                <sc-pagination size="sm" alignment="right" 
                  ?label="${this.paginationLabel}" 
                  ?jump-first-last-page="${this.paginationJumpFirstLastPage}" 
                  total="${this.paginationTotal}" 
                  current-page="${this.paginationCurrentPage}" 
                  page-size="${this.paginationPageSize}" 
                  ?size-changer="${this.paginationSizeChanger}"
                  .disabled-pages=${[...this.paginationDisabledPages]}
                  @sc-change=${this.pageChange}
                  >
                </sc-pagination>
              </div>` 
            : this.footerType === 'alternative' ? html`
              <div class='alternative-footer'>
                <slot name="alternative-footer"></slot>
              </div>` 
            : html`
            <div class="button-footer ${this.isStacked ? 'stacked' : ''}">
              <div class="left-button-container">
                ${this.hasSlotController.test('footer-button') && this.hasSlotController.test('footer-left') ? html`
                  <slot name='footer-left' slot='footer-left'></slot>
                ` : html`
                  <sc-button size="sm" no-border compact 
                    type="link"
                    aria-hidden=${this.buttonTextLeft ? 'false' : 'true'}
                    style=${styleMap({
                      display: this.buttonTextLeft ? 'inline-block' : 'none',
                      width: this.isStacked ? '100%' : 'auto',
                    })}
                    @click=${() => { this.handleButtonClick('left'); }}>
                    ${this.buttonTextLeft}
                  </sc-button>
                `}
              </div>
              <div class="right-button-container">
                ${this.hasSlotController.test('footer-button') ? html`
                  <slot name='footer-button' slot='footer-button'></slot>
                ` : html`
                  <sc-button size="sm" no-border 
                    type="link" 
                    aria-hidden=${this.buttonTextPrimary && this.buttonTextSecondary && this.buttonTextTertiary ? 'false' : 'true'}
                    style=${styleMap({
                      display: this.buttonTextPrimary && this.buttonTextSecondary && this.buttonTextTertiary ? 'inline-block' : 'none',
                      width: this.isStacked ? '100%' : 'auto',
                    })}
                    @click=${() => { this.handleButtonClick('tertiary'); }}>
                    ${this.buttonTextTertiary}
                  </sc-button>
                  <sc-button size="sm"  
                    type="secondary" 
                    state=${this.buttonStateSecondary}
                    ?no-pill="${this.buttonNoPill}"
                    ?loading=${this.buttonLoadingSecondary}
                    ?disabled=${this.buttonDisableSecondary}
                    aria-hidden=${this.buttonTextPrimary && this.buttonTextSecondary ? 'false' : 'true'}
                    style=${styleMap({
                      display: this.buttonTextPrimary && this.buttonTextSecondary ? 'inline-block' : 'none',
                      width: this.isStacked ? '100%' : 'auto',
                    })}
                    @click=${() => { this.handleButtonClick('secondary'); }}>
                    ${this.buttonTextSecondary}
                  </sc-button>
                  <sc-button size="sm" fill"
                    type="primary" 
                    state=${this.buttonStatePrimary}
                    ?no-pill="${this.buttonNoPill}"
                    ?loading=${this.buttonLoadingPrimary}
                    ?disabled=${this.buttonDisablePrimary}
                    aria-hidden=${this.buttonTextPrimary ? 'false' : 'true'}
                    style=${styleMap({
                      display: this.buttonTextPrimary ? 'inline-block' : 'none',
                      width: this.isStacked ? '100%' : 'auto',
                    })}
                    @click=${() => { this.handleButtonClick('primary'); }}>
                    ${this.buttonTextPrimary}
                  </sc-button>
                `}
              </div>
            </div>`
            }
          </div>` : ''
        }
        ${this.hasSlotController.test('footer') ? html`<div class="footer"><div class="button-footer reverse">
          <div class="right-button-container">
            <slot name='footer' slot='footer'></slot>
          </div>
        </div></div>` : ''}
      </sl-dialog>
    `;
  }
}
