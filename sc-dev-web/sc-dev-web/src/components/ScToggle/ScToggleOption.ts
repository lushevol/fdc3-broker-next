import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import { watch } from '../../shared/watch.js';
import ScElement from '../../shared/sc-element.js';
import ScToggleOptionStyle from './ScToggleOption.style.js';
import { TEXT_SIZE, FontSizeMapping } from '../../shared/util.js';

/**
 * @slot - The option's label.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The option's label.
 */
export class ScToggleOption extends ScElement {
  static styles = ScTheme.getStyles().concat([ScToggleOptionStyle]);

  @query('.option__label') defaultSlot: HTMLSlotElement;

  @state() selected = false; // the option is selected and has aria-selected='true'

  /**
   * The option's value. When selected, the containing form control will receive this value. The value must be unique
   * from other options in the same group. Values may not contain spaces, as spaces are used as delimiters when listing
   * multiple values.
   */
  @property({ reflect: true }) value = '';

  @property({ reflect: false }) index = '';

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean }) truncate = false;

  @property() size: `${TEXT_SIZE}` = TEXT_SIZE.xs;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');
    this.setAttribute('aria-selected', 'false');
  }

  @watch('selected')
  handleSelectedChange() {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }

  @watch('value')
  handleValueChange() {
    // Ensure the value is a string. This ensures the next line doesn't error and allows framework users to pass numbers
    // instead of requiring them to cast the value to a string.
    if (typeof this.value !== 'string') {
      this.value = String(this.value);
    }
  }

  // Returns a plain text label based on the option's content.
  getTextLabel() {
    return (this.textContent ?? '').trim();
  }

  render() {
    const labelSize = FontSizeMapping[this.size];
    return html`
      <div
        part='base'
        class=${
  classMap({
    'sc-toggle-option': true,
    selected: this.selected,
    disabled: this.disabled,
    'sc-truncate': this.truncate,
  })}
        style="--sc-toggle-font-size: ${labelSize}"
      >
        <slot part='label' class='option__label'></slot>
      </div>
    `;
  }
}
