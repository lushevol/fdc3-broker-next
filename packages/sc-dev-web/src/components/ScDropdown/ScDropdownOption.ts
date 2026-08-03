import { html } from 'lit';
import { ScOption } from '../common/ScOption.js';

export class ScDropdownOption extends ScOption {

  render() {
    return html`<slot class='sc-dropdown-option'></slot>`;
  }
}
