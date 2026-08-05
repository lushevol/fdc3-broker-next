import { html } from 'lit';
import { property } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import { TEXT_SIZE, FontSizeMapping } from '../../shared/util.js';

/**
 * @summary List item is used to show title and help info in list format.
 */

export class ScListItem extends ScElement {
  static styles = ScTheme.getStyles();

  @property({ type: String }) title = '';

  @property({ attribute: 'title-size' }) titleSize: `${TEXT_SIZE}` = TEXT_SIZE.sm;

  @property({ type: Number, attribute: 'title-line' }) titleLine = 0;

  @property({ type: String }) body = '';

  @property({ type: Number, attribute: 'body-line' }) bodyLine = 0;

  renderCustomStyle() {
    const BaseStyle = html`
      <style>
        .sc-list-item {
          width: 100%;
          padding: var(--sc-list-navigation-margin, 16px 0);
        }
        .sc-list-item [part='title'], .sc-list-item [part='body'] {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          
        }
        .sc-list-item [part='title'] {
          color: var(--sc-list-item-title-color, var(--sc-color-blue-700));
          font-weight: var(--sc-list-item-title-font-weight, 600);
          -webkit-line-clamp: ${this.titleLine};
        }
        .sc-list-item [part='body'] {
          color: var(--sc-list-item-body-color, var(--sc-color-grey-600));
          font-size: 0.875rem;
          -webkit-line-clamp: ${this.bodyLine};
        }
      </style>
    `;
    return html` ${BaseStyle}`;
  }

  render() {
    const titleSize = FontSizeMapping[this.titleSize];
    return html`
      ${this.renderCustomStyle()}
      <div class='sc-list-item'>
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
    `;
  }
}
