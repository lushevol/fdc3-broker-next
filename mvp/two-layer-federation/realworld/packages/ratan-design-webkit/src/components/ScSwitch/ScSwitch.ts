import { html } from 'lit';
import { property, query } from 'lit/decorators.js';

import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.component.js';
import ScTheme from '../../styles/ScTheme.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../../shared/watch.js';
import ScSwitchStyle from './ScSwitch.styles.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import '../../../elements/sc-icon.js';
import { COMPACT_SIZE, LABEL_POSITION } from '../../shared/util.js';

export class ScSwitch extends FormInputBase {
  static styles = ScTheme.getStyles().concat([ScSwitchStyle]);

  static get scopedElements() {
    return {
      'sl-switch': SlSwitch,
    };
  }

  @query('input[type="checkbox"]') input: HTMLInputElement;

  @property({ type: Boolean }) checked = false;

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ attribute: 'label-size' }) labelSize: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property({ type: LABEL_POSITION, attribute: 'label-position' }) labelPosition = LABEL_POSITION.right;

  @property({ type: Boolean, attribute: false }) _focus = false;
  
  @property({ type: String, attribute: 'text-icon-label' }) textIconLabel: null | 'text-label' | 'icon-label';
  
  @property({ type: Boolean, reflect: true }) loading = false;


  @watch('checked', { waitUntilFirstUpdate: true })
  handleCheckedChange() {
    this.input.checked = this.checked; // force a sync update
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (this.checked) {
        this.emit('sc-change', {
          detail: {
            checked: false,
          },
        });
      }
      this.checked = false;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (!this.checked) {
        this.emit('sc-change', {
          detail: {
            checked: true,
          },
        });
      }
      this.checked = true;
    }
  }

  private handleClick() {
    this.emit('sc-change', {
      detail: {
        checked: !this.checked,
      },
    });
    this.checked = !this.checked;
  }

  private handleInput(e: any) {
    this.emit('sc-input', {
      detail: {
        checked: e.target.checked,
      },
    });
    this.checked = e.target.checked;
  }

  private handleFocus() {
    this.emit('sc-focus', {});
    this._focus = true;
  }

  private handleBlur() {
    this.emit('sc-blur', {});
    this._focus = false;
  }

  /** Simulates a click on the switch. */
  click() {
    this.input.click();
  }

  /** Sets focus on the switch. */
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  /** Removes focus from the switch. */
  blur() {
    this.input.blur();
  }

  getSizeHeight() {
    switch (this.size) {
      case 'lg':
        return '1.5rem';
      case 'md':
        return '1.25rem';
      case 'sm':
      default:
        return '1rem';
    }
  }

  renderFormControl() {
    if (this.readonly) {
      return html`
        <div class=sc-form-control>
          <slot>${this.label}</slot>
          <slot>${this.checked ? 'On' : 'Off'}</slot>
        </div>
      `;
    }

    return html`
      <div
        part="base"
        class=${classMap({
    'sc-switch': true,
  })}
        style='--sc-toggle-size: ${this.getSizeHeight()}; 
        ${this.labelPosition === 'top' ? 'margin-top: -2.5px;' : 'margin-top: 3.5px;'}
        '
      >        
        <label
          part="sc-switch-input"
          class=${classMap({
    switch: true,
    'switch--checked': this.checked,
    'switch--disabled': this.disabled || this.loading,
    'switch--loading': this.loading,
    'switch--focused': this._focus,
  })}
        >
          <input
            class="switch__input"
            type="checkbox"
            value=${this.value}
            .checked=${this.checked}
            .disabled=${this.disabled || this.loading}
            .loading=${this.loading}
            role="switch"
            aria-checked=${this.checked ? 'true' : 'false'}
            @input=${this.handleInput}
            @click=${this.handleClick}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          />
          <span part="control" class="switch__control">
            <span part="thumb" class="switch__thumb">
              ${this.loading ? html`
                <div class="sc-switch-spinner"></div>
              ` : ''}
            </span>
          </span>
          ${this.textIconLabel && this.size === 'lg' ? html`
          <div class="sc-switch-label">
            <span style="visibility: ${this.checked ? 'visible' : 'hidden'};">
              ${this.textIconLabel === 'text-label' ? html`
              <span 
                class='sc-switch-label-text'>On</span>
              ` : html`
              <sc-icon
                class='sc-switch-label-icon'
                compact
                name='tick'
                size='sm'
                ></sc-icon>
              `}
            </span>
            <span style="visibility: ${this.checked ? 'hidden' : 'visible'};">
              ${this.textIconLabel === 'text-label' ? html`
              <span class='sc-switch-label-text'>Off</span>
              ` : html`
              <sc-icon
                class='sc-switch-label-icon'
                compact
                name='cross'
                size='sm'
                ></sc-icon>
              `}
            </span>
          </div>
          ` : ''}
        </label>        
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderBaseFormInput()}
    `;
  }
}
