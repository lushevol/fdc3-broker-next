import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import { HasSlotController } from '../../shared/slot.js';
import { SIZE, TEXT_ALIGN, FontSizeMapping } from '../../shared/util.js';

enum DIVIDER_MODE {
  default = 'default',
  filled = 'filled',
  'card-header' = 'card-header',
}

export class ScDivider extends LitElement {
  static styles = ScTheme.getStyles();

  @property({ type: String }) title = '';

  @property() size: `${SIZE}` = SIZE.xs;

  @property() mode: `${DIVIDER_MODE}` = DIVIDER_MODE.default;

  @property({ attribute: 'line-width' }) lineWidth: `${SIZE}` = SIZE.xxs;

  @property({ attribute: 'line-height' }) lineHeight: `${SIZE}` = SIZE.xxs;

  @property({ attribute: 'text-align' }) textAlign: `${TEXT_ALIGN}` = TEXT_ALIGN.left;

  @property({ type: Boolean, reflect: true }) vertical = false;

  @property({ type: Boolean, reflect: true }) compact = false;

  @property({ type: Number, reflect: true, attribute: 'card-number' }) cardNumber?: number;

  @property({ type: Boolean, reflect: true, attribute: 'optional-text' }) optionalText = false;

  @property({ type: SIZE, attribute: 'label-size' }) labelSize = 'sm';

  private readonly hasSlotController = new HasSlotController(this, 'title');

  updated(): void {
    if (this.mode === DIVIDER_MODE.filled || this.mode === DIVIDER_MODE['card-header']) {
      this.vertical = true;
    }
  }

  getWidth() {
    let leftWidth, rightWidth;

    switch (this.textAlign) {
      case 'left':
        leftWidth = '10%';
        rightWidth = '90%';
        break;
      case 'right':
        leftWidth = '90%';
        rightWidth = '10%';
        break;
      default:
        leftWidth = '50%';
        rightWidth = '50%';
        break;
    }
    return { leftWidth, rightWidth };
  }

  getLineWidth() {
    switch (this.lineWidth) {
      case 'lg':
        return 'var(--sc-line-width-8, 8px)';
      case 'md':
        return 'var(--sc-line-width-5, 5px)';
      case 'sm':
        return 'var(--sc-line-width-3, 3px)';
      case 'xs':
        return 'var(--sc-line-width-2, 2px)';
      default:
        return 'var(--sc-line-width-1, 1px)';
    }
  }

  getLineHeight() {
    switch (this.lineHeight) {
      case 'xxl':
        return 'var(--sc-spacing-40, 2.5rem)';
      case 'xl':
        return '2.25rem';
      case 'lg':
        return 'var(--sc-spacing-32, 2rem)';
      case 'md':
        return '1.75rem';
      case 'sm':
        return 'var(--sc-spacing-24, 1.5rem)';
      case 'xs':
        return 'var(--sc-spacing-20, 1.25rem)';
      default:
        return 'var(--sc-spacing-16, 1rem)';
    }
  }

  getSpace() {
    switch (this.size) {
      case 'lg':
        return 'var(--sc-spacing-48, 3rem)';
      case 'md':
        return 'var(--sc-spacing-32, 2rem)';
      case 'sm':
        return 'var(--sc-spacing-24, 1.5rem)';
      case 'xs':
        return 'var(--sc-spacing-12, .75rem)';
      default:
        return 'var(--sc-spacing-8, .5rem)';
    }
  }

  renderCustomStyle() {
    const hasTitle = this.title.length > 0 || this.hasSlotController.test('title');
    const { leftWidth, rightWidth } =
      this.mode === DIVIDER_MODE['card-header']
        ? { leftWidth: '0%', rightWidth: '100%' }
        : this.getWidth();
    const labelSize = FontSizeMapping[this.labelSize as keyof typeof FontSizeMapping];
    const dividerStyle = this.vertical
      ? html`
          <style>
            .sc-divider {
              display: flex;
              align-items: center;
              white-space: nowrap;
              padding-top: ${this.mode === DIVIDER_MODE.filled ||
              this.mode === DIVIDER_MODE['card-header'] ||
              this.compact
                ? 0
                : this.getSpace()};
              padding-bottom: ${this.mode === DIVIDER_MODE.filled ||
              this.mode === DIVIDER_MODE['card-header'] ||
              this.compact
                ? 0
                : this.getSpace()};
              border-top: ${this.mode === DIVIDER_MODE.filled
                ? '1px solid var(--sc-divider-filled-color, var(--sc-color-grey-150))'
                : ''};
              border-bottom: ${this.mode === DIVIDER_MODE.filled
                ? '1px solid var(--sc-divider-filled-color, var(--sc-color-grey-150))'
                : ''};
              color: var(--sc-divider-text-color, var(--sc-color-blue-900));
            }
            .sc-divider::before,
            .sc-divider::after {
              content: '';
              height: ${this.mode === DIVIDER_MODE['card-header']
                ? 0
                : this.mode === DIVIDER_MODE.filled
                  ? 'var(--sc-line-width-24, 1.5rem)'
                  : this.getLineWidth()};
              background-color: ${this.mode === DIVIDER_MODE.filled
                ? 'var(--sc-divider-filled-background-color, var(--sc-color-grey-50))'
                : 'var(--sc-divider-color, var(--sc-color-grey-150))'};
              flex-grow: 1;
            }
            .sc-divider::before {
              width: ${hasTitle ? `calc(${leftWidth} - var(--sc-spacing-8, .5rem))` : '100%'};
              margin-right: ${hasTitle ? 'var(--sc-spacing-8, .5rem)' : '0'};
            }
            .sc-divider::after {
              width: ${hasTitle ? `calc(${rightWidth} - var(--sc-spacing-2, .5rem))` : '100%'};
              margin-left: ${hasTitle ? 'var(--sc-spacing-8, .5rem)' : '0'};
            }
            .sc-divider-optional-text {
              color: var(--sc-divider-optional-text-color, var(--sc-color-grey-400));
            }
            .sc-divider-indicator-container {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              font-size: ${labelSize};
            }
            .sc-divider-indicator {
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(
                --sc-divider-indicator-background-color,
                var(--sc-color-blue-500)
              );
              color: var(--sc-divider-indicator-color, var(--sc-color-white));
              border: 1px solid var(--sc-divider-indicator-border-color, var(--sc-color-blue-500));
              width: 1rem;
              height: 1rem;
              text-align: center;
              border-radius: 6.5rem;
              font-size: 0.75rem;
            }
          </style>
        `
      : html`
          <style>
            .sc-divider {
              display: inline-block;
              vertical-align: middle;
              margin: auto;
              margin-left: ${this.compact ? 0 : this.getSpace()};
              margin-right: ${this.compact ? 0 : this.getSpace()};
              width: ${this.getLineWidth()};
              height: var(--sc-divider-height, ${this.getLineHeight()});
              background-color: var(--sc-divider-color, var(--sc-color-grey-50));
            }
          </style>
        `;

    return html` ${dividerStyle}`;
  }

  render() {
    return html`
      ${this.renderCustomStyle()}
      <div class="sc-divider">
        <div class="sc-divider-indicator-container">
          ${this.mode === DIVIDER_MODE['card-header'] && this.cardNumber
            ? html` <span class="sc-divider-indicator"> ${this.cardNumber} </span>`
            : ''}
          ${this.vertical
            ? html` ${this.hasSlotController.test('title')
                ? html`<slot name="title"></slot>`
                : html`${this.title} `}`
            : ''}
        </div>
        ${this.mode === DIVIDER_MODE['card-header'] && this.optionalText
          ? html` <span class="sc-divider-optional-text">&nbsp;(optional)</span>`
          : ''}
      </div>
    `;
  }
}
