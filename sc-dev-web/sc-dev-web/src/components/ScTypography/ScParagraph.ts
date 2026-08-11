import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScElement from '../../shared/sc-element.js';
import ParagraphStyle from './ScParagraph.style.js';

export class ScParagraph extends ScElement {

  static styles = [ParagraphStyle];
  
  @property({ type: Number }) rows = 1;

  @property({ type: Boolean }) ellipsis = false;

  @property({ type: String }) size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  renderCustomStyle() {
    return html`
      <style>
        .sc-paragraph {
          -webkit-line-clamp: ${this.rows};
          white-space: ${this.rows > 1 ? 'inherit' : 'nowrap'};
        }
      </style>
    `;
  }

  render() {
    return html`
      ${this.renderCustomStyle()}
      <div
        class=${classMap({
          'sc-paragraph': true,
          ellipsis: this.ellipsis,
          [this.size]: this.size,
        })}
      >
        <slot></slot>
      </div>
    `;
  }
}