import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ScElement from '../utils/ScElement.js';

@customElement('sc-file-tool-icon')
export class ScFileToolIcon extends ScElement {
  static styles = [css`
    :host {
      display: block;
      margin: 0rem;
    }
    sc-button {
      --sc-button-padding-sm: 0.5rem;
      --sc-button-border-width: 0;
      --sc-button-border-radius-md: 0.25rem;
      --sc-button-height-sm: 2rem;
      --sc-button-label-display: contents;
      --sc-button-text-background-color: transparent;
      --sc-button-text-hover-background-color: transparent;
      --sc-button-text-press-background-color: var(--sc-button-text-background-color);
      --sc-button-text-select-background-color: var(--sc-button-text-background-color);
    }

    :host([active]) sc-button {
      --sc-button-text-background-color: var(--sc-color-blue-100);
      --sc-button-text-hover-background-color: var(--sc-button-text-background-color);
    }
  `];

  @property({ type: String }) label = '';
  @property({ type: String }) icon = '';
  @property({ type: Object }) clicked?: (e:Event) => void;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`
      <sc-tooltip
        part="tooltip"
        hover-hide-delay="0"
        hover-show-delay="150"
        trigger="hover"
        hoist
        content=${this.label}
        .disabled=${this.disabled || !this.label}
        @click=${(e: Event) =>
          e.target instanceof HTMLElement &&
          e.target.tagName === 'SC-TOOLTIP' &&
          e.stopImmediatePropagation()}
      >
        <sc-button part="button" type="text" no-pill .disabled=${this.disabled}>
          ${this.icon
            ? html`<sc-icon part="icon" name=${this.icon} size="sm"></sc-icon>`
            : html`<slot part="slot"></slot>`}
        </sc-button>
      </sc-tooltip>
    `;
  }
}