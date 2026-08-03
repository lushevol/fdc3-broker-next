import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlDetails from '@shoelace-style/shoelace/dist/components/details/details.component.js';
import '../../../elements/sc-icon.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';

export class ScStickyPanel extends ScElement {
  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-details': SlDetails,
    };
  }

  @property({ type: String }) summary = '';

  @property({ type: Number, attribute: 'summary-line' }) summaryLine = 0;

  @property({ type: Boolean }) open = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  renderCustomStyle() {
    const baseStyle = html`
      <style>
        .sc-panel::part(summary) {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${this.summaryLine};
          font-size: 1rem;
          font-weight: 500;
        }
        .sc-panel::part(header):focus {
          outline: 0;
        }
        .sc-panel::part(base) {
          position: absolute;
          z-index: 500;
          top: 0;
          left: 0;
          width: 100%;
          color: var(--sc-panel-title-color, var(--sc-color-blue-900));
          border: none;
          border-radius: 0;
          background-color: var(--sc-panel-background-color, var(--sc-color-white));
          box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
          opacity: 1;
        }
        .sc-panel::part(summary-icon) {
          color: var(--sc-panel-icon-color, var(--sc-color-blue-500));
          rotate: none;
        }
        .sc-panel::part(header) {
          padding: 8px 16px;
        }
        .sc-panel::part(content) {
          padding: 8px 16px 16px 16px;
          font-weight: 400;
          font-size: 0.875rem;
          color: var(--sc-panel-content-color, var(--sc-color-grey-600));
        }
      </style>
    `;

    return html` ${baseStyle} `;
  }

  render() {
    return html`
      ${this.renderCustomStyle()}
      <sl-details
        class='sc-panel'
        .open=${this.open}
        .disabled=${this.disabled}
        @sl-show=${(event: CustomEvent) => {
    this.stopDefaultEvent(event);
    this.open = true;
    this.emit('sc-show', {
      detail: {
        open: true,
      },
    });
  }}
        @sl-hide=${(event: CustomEvent) => {
    this.stopDefaultEvent(event);
    this.open = false;
    this.emit('sc-hide', {
      detail: {
        open: false,
      },
    });
  }}
      >
        <sc-icon
          compact
          name='arrow-ios-downward'
          slot='expand-icon'
          size='sm'
          style='display: ${this.disabled ? 'none' : 'flex'}'
        ></sc-icon>
        <sc-icon
          compact
          name='arrow-ios-upward'
          slot='collapse-icon'
          size='sm'
          style='display: ${this.disabled ? 'none' : 'flex'}'
        ></sc-icon>
        <slot slot='summary' name='summary'>${this.summary}</slot>
        <slot></slot>
      </sl-details>
    `;
  }
}
