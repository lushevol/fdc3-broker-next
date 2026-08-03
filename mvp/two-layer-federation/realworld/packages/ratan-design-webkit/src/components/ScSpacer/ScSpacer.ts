import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';

type SpacerSize = '04' | '08' | '12' | '16' | '20' | '24' |
                  '32' | '40' | '48' | '56' | '64';

/**
 * @summary Spacer is used to add space between rows.
 */
export class ScSpacer extends LitElement {
  static styles = ScTheme.getStyles();

  @property({ type: String, reflect: true }) size: SpacerSize = '04';

  @property({ type: Boolean, reflect: true }) vertical = false;

  getSpace() {
    switch (this.size) {
      case '64':
        return 'var(--sc-spacing-64, 4rem)';
      case '56':
        return 'var(--sc-spacing-56, 3.5rem)';
      case '48':
        return 'var(--sc-spacing-48, 3rem)';
      case '40':
        return 'var(--sc-spacing-40, 2.5rem)';
      case '32':
        return 'var(--sc-spacing-32, 2rem)';
      case '24':
        return 'var(--sc-spacing-24, 1.5rem)';
      case '20':
        return 'var(--sc-spacing-20, 1.25rem)';
      case '16':
        return 'var(--sc-spacing-16, 1rem)';
      case '12':
        return 'var(--sc-spacing-12, 0.75rem)';
      case '08':
        return 'var(--sc-spacing-8, 0.5rem)';
      default:
        return 'var(--sc-spacing-4, 0.25rem)';
    }
  }

  renderCustomStyle() {
    const spacerStyle = html`
      <style>
        .sc-spacer {
          display: ${this.vertical ? 'block' : 'inline-block'};
          padding-top: ${this.vertical ? this.getSpace() : 0};
          padding-right: ${this.vertical ? 0 : this.getSpace()};
        }
      </style>
    `;
    return html` ${spacerStyle}`;
  }

  render() {
    return html`
      ${this.renderCustomStyle()}
      <div class="sc-spacer"></div>
    `;
  }
}
