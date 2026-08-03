import { html, LitElement } from 'lit';
import ScTheme from '../../styles/ScTheme.js';

/**
 * @summary Tab divider is used inside [tab groups] to represent divider between tabs.
 */

export class ScTabDivider extends LitElement {
  static styles = ScTheme.getStyles();

  renderTabGroupStyle() {
    const TabStyle = html`
      <style>
        .sc-tab-divider {
          border-right: 2px solid
            var(--sc-tab-divider-color, var(--sc-color-grey-40));
          margin-top: 1rem;
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
          color: var(--sc-tab-color, var(--sc-color-blue-900));
          white-space: nowrap;
          user-select: none;
          -webkit-user-select: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 0;
        }
      </style>
    `;
    return html` ${TabStyle}`;
  }

  render() {
    return html`
      ${this.renderTabGroupStyle()}
      <div class='sc-tab-divider'></div>
    `;
  }
}
