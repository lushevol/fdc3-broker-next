import { css, html } from 'lit';
import ScElement from '../../shared/sc-element.js';
import { property, state, query } from 'lit/decorators.js';
import { SIZE, BUTTON_TYPE, BUTTON_STATE, FLOAT } from '../../shared/util.js';
import { ScDropdownInput, TData } from '../ScDropdown/ScDropdownInput.js';
import '../../../elements/sc-dropdown-input.js';
import { stateConverter } from '../../shared/converter.js';
import { watch } from '../../shared/watch.js';

type T_BTN_TYPE = `${BUTTON_TYPE}`;
type T_BTN_SIZE = `${SIZE}`;

export class ScButtonDropdown extends ScElement {
  static styles = css`
    :host {
      display: inline-block;
      max-width: 100%;
    }
  `;
  // button
  @property() type: T_BTN_TYPE = 'secondary';

  @property({ converter: stateConverter }) state: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property() size: T_BTN_SIZE = 'sm';

  @property({ type: Boolean }) fill = false;

  @property() float: `${FLOAT}` = 'left';

  @property({ type: String, attribute: 'button-text' }) buttonText = 'Button';
  @property({ type: Boolean, attribute: 'update-button-text' })
  updateButtonText = false;

  @property({ type: Boolean }) inverse = false;

  @property({ type: Boolean, attribute: 'no-pill' }) noPill = false;

  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: 'loading-text' }) loadingText = '';

  @property({ type: String, attribute: 'empty-text' }) emptyText = 'No data found';

  @property({ type: Boolean }) truncate = false;
  @property({ type: Boolean, attribute: 'hide-tick-mark' }) hideTickMark = false;

  // dropdown
  @property({ type: Array }) data: TData[];

  @property({ type: Boolean }) hoist = false;

  @property({ type: Boolean }) open = false;

  // common
  @property({ type: Boolean }) disabled = false;

  @property({ type: String, attribute: 'left-icon' }) leftIcon: string | null = '';

  @state() _open = false;

  @query('sc-dropdown-input')
  dropdown: ScDropdownInput;

  @watch('open')
  updateOpenStatus() {
    this._open = this.open;
  }

  updateBtnText(str: string) {
    this.buttonText = str;
  }

  handleSelect(e: CustomEvent) {
    if (this.updateButtonText) {
      this.updateBtnText(e.detail.displayValue || e.detail.value);
    }
    this.emit('sc-select', {
      detail: e.detail,
    });
  }

  changeOpenStatus(status: boolean) {
    this._open = status;
  }

  render() {
    return html`
      <sc-dropdown-input
        ?hoist=${this.hoist}
        ?open=${this._open}
        .data=${this.data}
        @sc-select=${this.handleSelect}
        float=${this.float}
        @sc-hide=${() => this.changeOpenStatus(false)}
        @sc-show=${() => this.changeOpenStatus(true)}
        ?error=${this.state === BUTTON_STATE.error}
        ?hide-tick-mark=${this.hideTickMark}
        style="--sc-dropdown-min-width: 200px"
      >
        <sc-button
          slot="trigger"
          .type=${this.type}
          .size=${this.size}
          .noPill=${this.noPill}
          .loading=${this.loading}
          .loadingText=${this.loadingText}
          .disabled=${this.disabled}
          .state=${this.state}
          .leftIcon=${this.leftIcon}
          ?truncate=${this.truncate}
          width="auto"
          right-icon="arrow-ios-downward"
        >
          <slot name="button">${this.buttonText}</slot>
        </sc-button>
        <slot name='empty-text' slot="empty-text">${this.emptyText}</slot>
        <!-- default slot -->
        <slot></slot>
      </sc-dropdown-input>
    `;
  }
}
