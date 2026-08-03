import { html } from 'lit';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScMenuLabelStyle from './ScMenuLabel.style.js';

export class ScMenuLabel extends ScElement {

  static styles = ScTheme.getStyles().concat([ScMenuLabelStyle]);

  render() {
    return html` <slot part="base" class="sc-menu-label"></slot> `;
  }
}
