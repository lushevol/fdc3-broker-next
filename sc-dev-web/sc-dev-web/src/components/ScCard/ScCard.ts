import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, state, query } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import { HasSlotController, getTextContent } from '../../shared/slot.js';
import ScCardStyle from './ScCard.style.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../../../elements/sc-tag.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-icon-button.js';
import '../../../elements/sc-button.js';
import {
  SIZE,
  SizeMapping,
  ICON_SIZE,
  TEXT_SIZE,
  TEXT_ALIGN,
  VERTICAL_ALIGN,
  FontSizeMapping,
  TAG_ATTRIBUTES,
  CARD_SUPPLEMENTARY_ATTRIBUTES,
  DIRECTION,
  IMAGE_ALIGN,
  BUTTON_STATE,
} from '../../shared/util.js';

export class ScCard extends ScElement {
  static styles = ScTheme.getStyles().concat([ScCardStyle]);

  @property({ reflect: true }) direction: `${DIRECTION}` = 'horizontal';

  @property() title = '';

  @property({ attribute: 'title-size' }) 
  titleSize: `${TEXT_SIZE}` = TEXT_SIZE.sm;

  @property({ attribute: 'sub-title' }) subTitle = '';

  @property() body = '';

  @property({ attribute: 'body-size' }) 
  bodySize: `${TEXT_SIZE}` = TEXT_SIZE.xs;

  @property({ attribute: 'space-size' }) spaceSize: `${SIZE}` = SIZE.sm;

  @property({ attribute: 'text-align' }) 
  textAlign: `${TEXT_ALIGN}` = TEXT_ALIGN.left;

  @property({ attribute: 'image-position' }) 
  imagePosition: `${IMAGE_ALIGN}` = IMAGE_ALIGN.left;

  @property({ attribute: 'vertical-align' }) 
  verticalAlign: `${VERTICAL_ALIGN}` = VERTICAL_ALIGN.middle;

  @property() width = '100%';

  @property() height = 'auto';

  @property({ type: Boolean }) selected = false;

  @property({ type: Boolean, attribute: 'selected-on-click' }) 
  selectedOnClick = false;

  @property({ type: Boolean, attribute: 'hover-highlight' }) 
  hoverHighlight = false;

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property() icon = '';

  @property({ attribute: 'icon-size' }) 
  iconSize: `${ICON_SIZE}` = ICON_SIZE.sm;

  @property({ attribute: 'icon-vertical-align' }) 
  iconVerticalAlign: `${VERTICAL_ALIGN}` = VERTICAL_ALIGN.top;

  @property({ type: Array, attribute: 'tags-group' }) 
  tagsGroup: TAG_ATTRIBUTES[] = [];

  @property({ type: Array, attribute: 'supplementary-details' })
  supplementaryDetails: CARD_SUPPLEMENTARY_ATTRIBUTES[] = [];

  @property({ attribute: 'action-button' }) actionButton = '';

  @property({ type: Boolean }) draggable = false;

  @property({ type: Boolean, attribute: 'clickable' }) clickable = false;

  @property({ attribute: 'button-state-primary' })
  buttonStatePrimary: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property({ attribute: 'button-state-secondary' })
  buttonStateSecondary: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property({ attribute: 'button-text-primary' })
  buttonTextPrimary = '';

  @property({ attribute: 'button-text-secondary' })
  buttonTextSecondary = '';

  @property({ attribute: 'button-text-left' }) 
  buttonTextLeft = '';

  @property({ type: Boolean, attribute: 'button-no-pill' }) 
  buttonNoPill = false;

  @property({ type: Boolean, attribute: 'button-truncate' }) 
  buttonTruncate = false;

  @property({ type: Boolean }) expandable = false;

  @property({ attribute: 'icon-align' }) 
  iconAlign: `${TEXT_ALIGN}` = TEXT_ALIGN.right;

  @state() expanded = false;

  @query('slot[name="title"]') titleSlot: HTMLSlotElement;

  @query('slot[name="body"]') bodySlot: HTMLSlotElement;

  @query('.tags-container') tagsContainer: HTMLSlotElement;

  _shownTagNumber = 0;

  _originalTagsWidth: number[] = [];

  private _cardTagObserver = new ResizeObserver(() => {
    this.renderTagsGroup();
  });

  protected readonly hasSlotController = new HasSlotController(
    this,
    'prefix',
    'title',
    'sub-title',
    'body',
    'icon',
    'suffix'
  );

  connectedCallback() {
    super.connectedCallback();
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-tag'),
    ]);
    
    whenAllDefined.then(() => {
      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].intersectionRatio > 0) {
            this.getOriginalTagsWidth();
            this.renderTagsGroup();
            observer.unobserve(entries[0].target);
          }
        }
      );
      const tags = this.shadowRoot?.querySelectorAll('sc-tag')!; // eslint-disable-line
      const lastTag = tags?.[tags?.length - 1];
      if (lastTag) {
        intersectionObserver.observe(lastTag);
        this._cardTagObserver.observe(this.tagsContainer);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._cardTagObserver) {
      this._cardTagObserver.disconnect();
    }
  }

  getOriginalTagsWidth() {
    const tags = this.shadowRoot?.querySelectorAll('sc-tag')!; // eslint-disable-line
    tags.forEach(tag => {
      this._originalTagsWidth.push(tag.clientWidth);
    });
  }

  private onClick(event: MouseEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.emit('sc-action', {
      detail: {
        target: event.target,
        type,
      },
    });
  }

  private onCardClick() {
    this.emit('sc-card-click', {
      detail: { value: !this.selected },
    });
    if (this.selectedOnClick) {
      this.selected = !this.selected;
    }
  }

  handleButtonClick(buttonType: 'primary' | 'secondary' | 'left') {
    this.emit('sc-action', {
      detail: {
        type: buttonType,
      },
    });
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  private get shouldRenderActionButton(): boolean {
    return (
      !!this.actionButton || this.hasSlotController.test('card-action-button')
    );
  }

  renderTitleBody() {
    const titleSize = FontSizeMapping[this.titleSize];
    const bodySize = FontSizeMapping[this.bodySize];
    const titleContent = getTextContent(this.titleSlot)
      ? getTextContent(this.titleSlot)
      : this.title;
    const bodyContent = getTextContent(this.bodySlot)
      ? getTextContent(this.bodySlot)
      : this.body;

    return html`
      <div class="card-content">
        ${this.title
          ? html`
              <div
                class="card-title"
                style="${!this.body && !this.hasSlotController.test('body')
                  ? 'margin-bottom: 0'
                  : ''};
                  font-size: ${titleSize}"
              >
                ${titleContent}
              </div>
            `
          : html`
              <slot
                name="title"
                part="title"
                class="card-title card-title-slot"
                style="font-size: ${titleSize}"
              ></slot>
            `}
        ${this.body
          ? html`
              <div
                class="card-body ${this.expandable && !this.expanded
                  ? 'not-expanded'
                  : ''}"
                style="font-size: ${bodySize}"
              >
                ${bodyContent}
              </div>
            `
          : html`
              <slot
                name="body"
                part="body"
                class="card-body card-body-slot ${this.expandable &&
                !this.expanded
                  ? 'not-expanded'
                  : ''}"
                style="font-size: ${bodySize};"
              ></slot>
            `}
      </div>
    `;
  }

  renderIcon() {
    return this.icon
      ? html`
          <div
            class="card-icon"
            @click=${(e: MouseEvent) => this.onClick(e, 'icon')}
          >
            <sc-icon
              type="text"
              name=${this.icon}
              size=${this.iconSize}
            ></sc-icon>
          </div>
        `
      : html` <slot name="icon" part="icon"></slot> `;
  }

  renderDragIcon() {
    return html` <div
      class="card-drag-button"
      @click=${(e: MouseEvent) => this.onClick(e, 'drag-button')}
    >
      <sc-icon name="drag-handle" size="md"></sc-icon>
    </div>`;
  }

  private renderActionButton(clickType: string, actionButtonName: string) {
    return html`
      <div
        class="card-action-button"
        @click=${(e: MouseEvent) => {
          this.onClick(e, clickType);
        }}
      >
        <slot name="card-action-button" class="card-action-dropdown-button">
          <sc-icon-button
            type="text"
            size="sm"
            name=${actionButtonName}
            class="card-action-dropdown-button"
          ></sc-icon-button>
        </slot>
      </div>
    `;
  }

  renderTagsGroup = () => {
    this._shownTagNumber = 0;
    const width = this.tagsContainer?.clientWidth!; // eslint-disable-line
    if (width && this._originalTagsWidth) {
      let remaningWidth = width;
      this._originalTagsWidth.some(width => {
        const tagWidth = width + 8;
        if (tagWidth > remaningWidth) {
          return true;
        }
        remaningWidth -= tagWidth;
        this._shownTagNumber += 1;
      });
    }
    this.requestUpdate();
  };

  render() {
    const padding = SizeMapping[this.spaceSize];
    const cardHeight =
      this.height === 'auto' || this.noBorder
        ? this.height
        : `calc(${this.height} - 2px)`;

    return html`
      <div
        part='base'
        style='
          width: calc(${this.width} - 2px);
          height: ${cardHeight};
        '
        class=${classMap({
          'sc-card': true,
          selected: this.selected,
          'non-clickable': !this.clickable,
          'card-with-header-slot': this.hasSlotController.test('header'),
          'card-with-footer-slot': this.hasSlotController.test('footer'),
          'card-with-prefix-slot': this.hasSlotController.test('prefix'),
          'card-with-title-slot': this.hasSlotController.test('title'),
          'card-with-sub-title-slot': this.hasSlotController.test('sub-title'),
          'card-with-body-slot': this.hasSlotController.test('body'),
          'card-with-icon-slot': this.hasSlotController.test('icon'),
          'card-with-suffix-slot': this.hasSlotController.test('suffix'),
          'items-start': this.verticalAlign === 'top',
          'items-center': this.verticalAlign === 'middle',
          'items-end': this.verticalAlign === 'bottom',
          'text-left': this.textAlign === 'left',
          'text-center': this.textAlign === 'center',
          'text-right': this.textAlign === 'right',
          'text-justify': this.textAlign === 'justify',
          horizontal: this.direction === 'horizontal',
          vertical: this.direction === 'vertical',
          hover: this.hoverHighlight && !this.disabled,
          'no-border': this.noBorder,
          disabled: this.disabled,
          'icon-left': this.iconAlign === 'left',
          'icon-center': this.iconAlign === 'center',
          'icon-right': this.iconAlign === 'right',
          'icon-justify': this.iconAlign === 'justify',
          'sc-button-truncate': this.buttonTruncate,
        })}
        @click=${this.onCardClick}
      >
      ${
        (this.direction === 'vertical' &&
          (this.draggable ||
            this.shouldRenderActionButton ||
            this.icon ||
            this.hasSlotController.test('icon') ||
            this.hasSlotController.test('prefix')))
          ? html`
              <div class="top-container">
                <div class="icon-container with-drag">
                  ${this.draggable ? html` ${this.renderDragIcon()} ` : ''}
                  ${(this.icon || this.hasSlotController.test('icon')) &&
                  (this.iconAlign === 'left' || this.iconAlign === 'justify')
                    ? html` ${this.renderIcon()} `
                    : ''}
                  <slot
                    name="prefix"
                    part="prefix"
                    class="card-prefix card-prefix-slot"
                  ></slot>
                </div>
                <div
                  class="icon-container vertical ${this.iconVerticalAlign !==
                  'top'
                    ? this.iconVerticalAlign === 'middle'
                      ? 'items-center'
                      : 'items-end'
                    : ''}"
                >
                  ${(this.icon || this.hasSlotController.test('icon')) &&
                  this.iconAlign === 'right'
                    ? html` ${this.renderIcon()} `
                    : ''}
                  ${this.shouldRenderActionButton
                    ? this.renderActionButton(
                        'action-button',
                        this.actionButton
                      )
                    : ''}
                </div>
              </div>
            `
          : ''
      }
        <slot
          name='header'
          part='header'
          class='card-header card-header-slot'
        ></slot>
        <div
          class=${classMap({
            content: true,
            'items-start': this.verticalAlign === 'top',
            'items-center': this.verticalAlign === 'middle',
            'items-end': this.verticalAlign === 'bottom',
            'icon-items-center': this.iconVerticalAlign === 'middle',
            'icon-items-end': this.iconVerticalAlign === 'bottom',
          })}
        >
          ${
            this.direction !== 'vertical' &&
            (this.draggable ||
              (this.icon &&
                (this.iconAlign === 'left' || this.iconAlign === 'justify')) ||
              this.hasSlotController.test('prefix'))
              ? html`
                  <div class="icon-container left with-drag">
                    ${this.draggable ? html` ${this.renderDragIcon()} ` : ''}
                    ${this.icon &&
                    (this.iconAlign === 'left' || this.iconAlign === 'justify')
                      ? html` ${this.renderIcon()} `
                      : ''}
                    ${this.hasSlotController.test('prefix')
                      ? html`
                          <slot
                            name="prefix"
                            part="prefix"
                            class="card-prefix card-prefix-slot"
                          ></slot>
                        `
                      : ''}
                  </div>
                `
              : ''
          }
          <div class="card-content-image-wrapper" style="flex-direction: ${
            this.direction === 'horizontal' ? 'row' : 'column'
          };">
            <slot style="order: ${
              this.imagePosition === IMAGE_ALIGN.right &&
              this.direction === DIRECTION.horizontal
                ? 2
                : 0
            };" name='image' part='image' class='card-image-slot ${
      this.direction
    }'></slot>
            <div class='card-content' part='text' style='padding: ${padding}rem; order: 1;'>    
              ${
                this.icon && this.iconAlign === 'center'
                  ? html` ${this.renderIcon()} `
                  : ''
              }    
              ${
                this.subTitle
                  ? html` <div class="card-sub-title">${this.subTitle}</div> `
                  : html`
                      <slot
                        name="sub-title"
                        part="sub-title"
                        class="card-sub-title card-sub-title-slot"
                      ></slot>
                    `
              }
              ${this.renderTitleBody()}
              <slot></slot>
              ${
                this.tagsGroup && this.tagsGroup.length > 0
                  ? html`
                      <div class="tags-container">
                        ${this.tagsGroup.map(
                          (tag, index) => (!this._shownTagNumber || index < this._shownTagNumber) ? html`
                            <sc-tag
                              type="${tag.type}"
                              icon-name="${tag.iconName}"
                            >
                              ${tag.content}
                            </sc-tag>
                          ` : index === this._shownTagNumber ? html`
                            <sc-tooltip trigger=hover style='--sc-tooltip-container-cursor: pointer' content=${this.tagsGroup.slice(this._shownTagNumber).map(tag => tag.content).join(', ')}>
                              <sc-tag class='number-tag' type=grey>+ ${this.tagsGroup.length - this._shownTagNumber}</sc-tag>
                            </sc-tooltip>
                          ` : null
                        )}
                      </div>
                    `
                  : ''
              }    
              ${
                (!this.expandable || (this.expandable && this.expanded)) &&
                this.supplementaryDetails.length > 0
                  ? html`
                      <div class="supplementary-container">
                        ${this.supplementaryDetails.map(
                          (detail, index) => html`
                            <div
                              class="supplementary-detail ${this.expandable &&
                              this.expanded
                                ? 'expanded'
                                : ''}"
                            >
                              <sc-icon
                                name="${detail.iconName}"
                                size="sm"
                              ></sc-icon>
                              ${detail.details}
                              ${index < this.supplementaryDetails.length - 1
                                ? html`<span class="separator"> • </span>`
                                : ''}
                            </div>
                          `
                        )}
                      </div>
                    `
                  : ''
              }
              ${
                this.expandable
                  ? html`
                      <div class="expandable" @click="${this.toggleExpand}">
                        ${this.expanded ? 'Show less...' : 'Show more...'}
                      </div>
                    `
                  : ''
              }
            </div>    
          </div>               
          <slot name='suffix' part='suffix' class='card-suffix card-suffix-slot'></slot>
          ${
            this.direction !== 'vertical' && (this.shouldRenderActionButton || this.icon)
              ? html`
                  <div
                    class="icon-container right ${this.iconVerticalAlign !==
                    'top'
                      ? this.iconVerticalAlign === 'middle'
                        ? 'items-center'
                        : 'items-end'
                      : ''}"
                  >
                    ${this.icon && this.iconAlign === 'right'
                      ? html` ${this.renderIcon()} `
                      : ''}
                    ${this.shouldRenderActionButton &&
                    this.iconAlign === 'right' &&
                    this.iconVerticalAlign === 'top'
                      ? this.renderActionButton(
                          'action-button',
                          this.actionButton
                        )
                      : ''}
                    ${this.shouldRenderActionButton &&
                    this.iconAlign !== 'right'
                      ? this.renderActionButton(
                          'action-button',
                          this.actionButton
                        )
                      : ''}
                  </div>
                `
              : ''
          }
          </div>  
          ${
            !this.clickable &&
            (this.buttonTextLeft ||
              this.buttonTextSecondary ||
              this.buttonTextPrimary)
              ? html`
                  <div class="button-footer">
                    <div class="left-button-container">
                      <sc-button
                        size="xs"
                        type="link"
                        compact
                        class="left-button"
                        aria-hidden=${this.buttonTextLeft ? 'false' : 'true'}
                        style=${styleMap({
                          display: this.buttonTextLeft
                            ? 'inline-block'
                            : 'none',
                        })}
                        ?truncate=${this.buttonTruncate}
                        @click=${() => { this.handleButtonClick('left'); }}
                      >
                        ${this.buttonTextLeft}
                      </sc-button>
                    </div>
                    <div class="right-button-container">
                      <sc-button
                        size="xs"
                        class="secondary-button"
                        type="secondary"
                        state=${this.buttonStateSecondary}
                        ?no-pill=${this.buttonNoPill}
                        aria-hidden=${this.buttonTextPrimary &&
                        this.buttonTextSecondary
                          ? 'false'
                          : 'true'}
                        style=${styleMap({
                          display:
                            this.buttonTextPrimary && this.buttonTextSecondary
                              ? 'inline-block'
                              : 'none',
                        })}
                        ?truncate=${this.buttonTruncate}
                        @click=${() => { this.handleButtonClick('secondary'); }}
                      >
                        ${this.buttonTextSecondary}
                      </sc-button>
                      <sc-button
                        size="xs"
                        fill
                        class="primary-button"
                        type="primary"
                        state=${this.buttonStatePrimary}
                        ?no-pill=${this.buttonNoPill}
                        aria-hidden=${this.buttonTextPrimary ? 'false' : 'true'}
                        style=${styleMap({
                          display: this.buttonTextPrimary
                            ? 'inline-block'
                            : 'none',
                        })}
                        ?truncate=${this.buttonTruncate}
                        @click=${() => { this.handleButtonClick('primary'); }}
                      >
                        ${this.buttonTextPrimary}
                      </sc-button>
                    </div>
                  </div>
                `
              : ''
          }     
          <slot
            name='footer'
            part='footer'
            class='card-footer card-footer-slot'
          ></slot>
        </div>
      </div>
    `;
  }
}
