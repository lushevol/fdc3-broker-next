import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScElement from '../../shared/sc-element.js';
import TitleStyle from './ScTitle.style.js';

export class ScTitle extends ScElement {

  static styles = css`${TitleStyle}`;
  
  @property({ type: Number }) level = 1;

  @property({ type: Number }) rows = 1;

  @property({ type: Boolean }) ellipsis = false;

  @property({ type: Boolean }) hero = false;

  renderCustomStyle() {
    return html`
      <style>
        .sc-title {
          -webkit-line-clamp: ${this.rows};
          white-space: ${this.rows > 1 ? 'inherit' : 'nowrap'};
        }
      </style>
    `;
  }

  renderTitleEle() {
    const classNames = classMap({
      'sc-title': true,
      [`level${this.level}`]: this.level,
      ellipsis: this.ellipsis,
      hero: this.hero,
    });

    switch (this.level) {
      case 1:
        return html`<h1 class=${classNames}><slot></slot></h1>`;
      case 2:
        return html`<h2 class=${classNames}><slot></slot></h2>`;
      case 3:
        return html`<h3 class=${classNames}><slot></slot></h3>`;
      case 4:
        return html`<h4 class=${classNames}><slot></slot></h4>`;
      case 5:
        return html`<h5 class=${classNames}><slot></slot></h5>`;
      case 6:
        return html`<h6 class=${classNames}><slot></slot></h6>`;
      default:
        return html`<h1 class=${classNames}><slot></slot></h1>`;
    }
  }
  render() {
    

    return html`
      ${this.renderCustomStyle()}
      ${this.renderTitleEle()}
    `;
  }
}