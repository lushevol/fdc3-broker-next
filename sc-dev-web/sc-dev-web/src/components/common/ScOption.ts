import { html } from 'lit';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';

export class ScOption extends ScElement {
  static styles = ScTheme.getStyles();

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`<slot class='sc-option'></slot>`;
  }
}
