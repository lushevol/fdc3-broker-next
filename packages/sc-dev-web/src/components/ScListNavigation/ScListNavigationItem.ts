import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import { TEXT_SIZE, FontSizeMapping } from '../../shared/util.js';
import { HasSlotController } from '../../shared/slot.js';
import { ListNavigationItemStyle } from './ScListNavigation.style.js';

/**
 * @summary List navigation item is used to show navigation items in list format.
 */

export class ScListNavigationItem extends ScElement {
  static styles = ScTheme.getStyles();

  @property({ type: String }) prefix = '';

  @property({ type: String }) suffix = '';

  @property({ type: Boolean }) selected = false;

  @property({ type: Boolean, attribute: 'no-suffix' }) noSuffix = false;

  @property({ type: String }) title = '';

  @property({ type: String }) key = '';

  @property({ attribute: 'title-size' }) titleSize: `${TEXT_SIZE}` = TEXT_SIZE.xs;

  @property({ type: Number, attribute: 'title-line' }) titleLine = 0;

  @property({ type: String }) body = '';

  @property({ type: Number, attribute: 'body-line' }) bodyLine = 0;

  @property({ type: String }) href = '';

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property({ type: Boolean, attribute: false }) compact = true;

  @property({ attribute: false }) borderTop = false;

  @property({ attribute: false }) borderBottom = true;

  @property({ type: Boolean }) disabled = false;

  get hasBody() {
    return !!(
      this.body ||
      this.hasSlotController.test('body')
    );
  }

  readonly hasSlotController = new HasSlotController(
    this,
    'title',
    'body',
    'prefix'
  );

  renderCustomStyle() {
    const hasTitle = this.title || this.hasSlotController.test('title');
    const hasBody = this.body || this.hasSlotController.test('body');

    const baseStyle = html`
      <style>
        .sc-list-navigation-item {
          border-top: ${!this.noBorder && this.borderTop
    ? '1px solid var(--sc-list-navigation-border-color, var(--sc-color-grey-250))'
    : 'none'
};
          border-bottom: ${!this.noBorder && this.borderBottom
    ? '1px solid var(--sc-list-navigation-border-color, var(--sc-color-grey-250))'
    : 'none'
};
          border-collapse: collapse;
          width: 100%;
          cursor: pointer;
        }
        ${ListNavigationItemStyle}
        .sc-list-navigation-item [part='title'] {
            -webkit-line-clamp: ${this.titleLine};
            min-height: 1.625rem;
            line-height: 1.625rem;
        }
        .sc-list-navigation-item [part='body'] {
            -webkit-line-clamp: ${this.bodyLine};
        }
      </style>
    `;

    const noTitleStyle = html`
        <style>
          .sc-list-navigation-item [part='title'] {
            display: none;
          }
          .sc-list-navigation-item [part='body'] {
            line-height: 1.625rem;
          }
        </style>
    `;
    return html` ${baseStyle} ${(hasBody && !hasTitle) ? noTitleStyle : ''}`;
  }

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.emit('sc-action', {
      detail: {
        target: event.target,
        key: this.key || this.title,
        disabled: this.disabled,
      },
    });
    if (!this.disabled && this.href) {
      window.location.href = this.href;
    }
  };

  render() {
    const titleSize = FontSizeMapping[this.titleSize];

    return html`
      ${this.renderCustomStyle()}
      <div
        part=item
        class=${classMap({
          'sc-list-navigation-item': true,
          selected: this.selected,
          disabled: this.disabled,
          'with-body': this.hasBody,
          compact: this.compact,
        })}
      >
        <a @click=${this.handleClick}>
          <div class='sc-list-navigation-item-base'>
            ${this.prefix && typeof this.prefix === 'string'
    ? html`
                  <sc-icon 
                    class='sc-list-navigation-prefix' 
                    name='${this.prefix}' 
                    size='md'
                  >
                  </sc-icon>
                ` 
    : html`
                <slot name='prefix'></slot>
              `
}
            <div part='text'>
              <div part='title'>
                <slot name="title"
                  style='font-size: ${titleSize}'
                >
                  ${this.title}
                </slot>            
              </div>
              <div part='body'>
                <slot name="body">${this.body}</slot>
              </div>
            </div>
          </div>
          ${!this.noSuffix ?  
            this.suffix && typeof this.suffix === 'string' ? html`
                        <sc-icon
                          class='sc-list-navigation-suffix'
                          name=${this.suffix}
                          size='sm'
                        ></sc-icon>
                      `
                        : html`<slot name='suffix'></slot>`
            : ''
          }
        </a>
        <slot></slot>
      </div>
    `;
  }
}