import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScButtonGroupItemStyle from './ScButtonGroupItem.style.js';
import '../../../elements/sc-button.js';
import { COMPACT_SIZE, sizeDown, sizeUp } from '../../shared/util.js';
import type { ScButtonGroup } from './ScButtonGroup.js';

export class ScButtonGroupItem extends ScElement {
  static styles = ScTheme.getStyles().concat([ScButtonGroupItemStyle]);

  @property({ reflect: true }) size: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ type: Boolean }) disabled = false;
  
  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean }) error = false;

  @property({ }) value: any;

  @property({ type: Boolean, attribute: false }) selected = false;

  @property({ attribute: false }) index = -1;

  @property() width = 'auto';

  @property({ type: Boolean, reflect: true }) truncate = false;

  _handleClick(event: Event) {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('selectItemChanged', {
        bubbles: true,
        detail: {
          index: this.index,
          value: this.value,
          target: event.target,
        },
      })
    );
  }

  render() {
    const parent = this.parentElement?.matches('sc-button-group')
        ? (this.parentElement as ScButtonGroup) : null;
    const disabled =
      this.disabled ||
      this.readonly ||
      !!parent?.disabled ||
      !!parent?.readonly;
    const error = this.error || !!parent?.error;
    const buttonClasses = classMap({
      ['sc-button-group-item']: true,
      [`sc-button-group-item-size-${this.size}`]: true,
      ['button-disabled']: disabled,
      ['button-error']: error,
      ['button-selected']: this.selected,
    });

    return html`
      <sc-button 
        class='${buttonClasses}'
        size=${this.size}
        ?disabled=${disabled}
        type=${this.selected ? 'primary' : 'secondary'}
        state=${error ? 'error' : 'default'}
        .width=${this.width}
        ?truncate=${this.truncate}
        no-pill
        @click=${this._handleClick}
      >
        <slot>Button</slot>
      </sc-button>
    `;
  }
}
