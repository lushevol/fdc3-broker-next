import { html, nothing } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScButtonGroupStyle from './ScButtonGroup.style.js';
import { ScButtonGroupItem } from './ScButtonGroupItem.js';
import { watch } from '../../shared/watch.js';
import '../../../elements/sc-button-group.js';
import '../../../elements/sc-icon-button.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import { COMPACT_SIZE, sizeDown } from '../../shared/util.js';
import { classMap } from 'lit/directives/class-map.js';
import { mediaQuery } from '../../shared/mediaQuery.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from 'lit/directives/repeat.js';

export class ScButtonGroup extends FormInputBase {
  static styles = ScTheme.getStyles().concat([ScButtonGroupStyle]);

  // @ts-ignore
  @property({ type: Array }) value: any[] | any = [];

  @property({ attribute: 'single-select', type: Boolean }) singleSelect = false;

  @property({ attribute: 'enable-deselect', type: Boolean }) enableDeselect = false;

  @property({ type: Array, attribute: false }) _value: Array<any> = [];

  @property({ reflect: true }) size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property({ attribute: 'label-size' }) labelSize: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property({ type: String, attribute: false }) borderType : 'line' | 'box' = 'line';

  @property({ type: String, attribute: 'first-lower-text' }) firstLowerText?:string;

  @property({ type: String, attribute: 'last-lower-text' }) lastLowerText?:string;

  @property({ type: Boolean, attribute: false }) clearable = false;

  @property({ type: Boolean, attribute: false }) _active = false;

  @property({ type: Boolean, attribute: false }) _focus = false;

  @property({ type: Boolean, attribute: false }) useDefaultSlotNotAsLabel = false;

  @property({ type: String, attribute: false }) placeholder = '';

  @property({ type: String, attribute: false }) formControlClsName = 'sc-button-group';

  @queryAssignedElements({ selector: 'sc-button-group-item' })
  public allElements: Array<ScButtonGroupItem>;

  private _inputsWidth = 0;


  constructor() {
    super();
    this.addEventListener('selectItemChanged', (event: any) => {
      event.stopPropagation();
      this._handleClick(event);
    });
  }

  protected firstUpdated(): void {
    this.getStyles();
    this.valueChanged();
  }

  _handleClick(event: CustomEvent) {
    event.stopPropagation();
    const { index, value } = event.detail;
    if (this.singleSelect) {
      if (this._value.includes(value)) {
        if (this.enableDeselect) {
          this._value = [];
        }
      } else {
        this._value = [value]; 
      }
    } else {
      if (this._value.includes(value)) {
        this._value = this._value.filter(item => item !== value); 
      } else {
        this._value.push(value); 
      }
    }
    
    this._valueChanged();
    this.emit('sc-select', {
      detail: {
        index,
        value: this._value,
        target: event.target,
      },
    });

    if (this.isMobile)
      this.requestUpdate();
  }

  @mediaQuery(['mobileSm', 'mobileLg'], { waitAfterUpdate: true })
  _updateContainers() {
    const inputs = this.shadowRoot?.querySelector<HTMLElement>('[part="inputs"]');
    if (inputs) {
      // mobile multi select not supported until GDS design
      if (this.isMobile && this.singleSelect) {
        inputs.style.setProperty('display', 'none');
      } else {
        inputs.style.removeProperty('display');
      }
    }
  }

  inputChanged(): void {
    this.allElements.forEach((el, index) => {
      el.index = index;
      el.selected = this._value.includes(el.value);
    });
    this.styleChanged();
  }

  _valueChanged(): void {
    this.allElements.forEach(
      el => (el.selected = this._value.includes(el.value))
    );
  }

  @watch('value', { waitUntilFirstUpdate: true })
  valueChanged() {
    let value = this.value;
    if (typeof value === 'string' && /^\[.*\]$/.test(value.trim())) {
      try {
        value = JSON.parse(value);
      } catch {}
    } else if (!Array.isArray(value)) {
      value = [value];
    }
    this._value = value || [];
    this._valueChanged();
  }
  @watch(['disabled', 'error', 'readonly'], { waitUntilFirstUpdate: true })
  stateChanged(): void {
    this.allElements.forEach(el => el.requestUpdate());
  }
  @watch(['size', 'truncate'], { waitUntilFirstUpdate: true })
  styleChanged(): void {
    this.allElements.forEach(el => {
      el.size = sizeDown(this.size) as unknown as COMPACT_SIZE;
      el.truncate = this.truncate;
    });
  }

  renderMobileDropdown() {
    // mobile multi select not supported until GDS design
    if (!this.isMobile || !this.singleSelect) return nothing;

    const buttonText =
      this.allElements.find(el => this._value.includes(el.value))
        ?.textContent ||
      this.placeholder ||
      'Select';
    const data = this.allElements.map((el: any, index: number) => ({
      label: () =>
        html`<div
          style="text-overflow:ellipsis;max-width:100dvw;overflow:hidden"
        >
          ${unsafeHTML(el.innerHTML)}
          ${index === 0 && this.firstLowerText
            ? html`(${this.firstLowerText})`
            : nothing}
          ${index === this.allElements.length - 1 && this.lastLowerText
            ? html`(${this.lastLowerText})`
            : nothing}
        </div>`,
      value: el.value,
      disabled: el.disabled,
    }));
    return html`<sc-dropdown-input
      .data=${data}
      .value=${this._value?.[0]}
      .disabled=${this.disabled}
      .readonly=${this.readonly}
      hoist
      truncate
      @sc-select=${this._handleClick}
    >
      <div slot="trigger">
        <sc-button
          type="secondary"
          size=${sizeDown(this.size)}
          state=${this.error ? 'error' : 'default'}
          .disabled=${this.disabled}
          .readonly=${this.readonly}
          no-pill
          truncate
        >
          ${buttonText}
        </sc-button>
        <sc-icon-button
          type="primary"
          name="arrow-ios-downward"
          size=${sizeDown(this.size)}
          state=${this.error ? 'error' : 'default'}
          .disabled=${this.disabled}
          .readonly=${this.readonly}
          no-pill
        ></sc-icon-button>
      </div>
    </sc-dropdown-input>`;
  }

  renderFormControl() {
    return html`
      <div
        class=${classMap({
          'sc-button-group': true,
          disabled: this.disabled || this.readonly,
          readonly: this.readonly,
          'sc-truncate': this.truncate,
          [`size-${this.size}`]: true,
          'has-lower-text':
            this.firstLowerText !== undefined ||
            this.lastLowerText !== undefined,
        })}
      >
        <div class="sc-button-group-container">
          <div
            part="inputs"
            style=${this.isMobile && this.singleSelect ? 'display:none' : ''}
          >
            <slot @slotchange=${this.inputChanged}></slot>
          </div>
          ${this.renderMobileDropdown()}
          ${!this.isMobile && (this.firstLowerText || this.lastLowerText)
            ? html`
                <div class="sc-button-group-lower-text">
                  <span>${this.firstLowerText}</span>
                  <span>${this.lastLowerText}</span>
                </div>
              `
            : ''}
        </div>
        <div part="selected-values">
          ${repeat(
            this.allElements.filter(el => this._value.includes(el.value)),
            el => el.value,
            el => html`<div>${unsafeHTML(el.innerHTML)}</div>`
          )}
          ${this._value.length === 0
            ? html`<slot name="empty-readonly"><em>None</em></slot>`
            : ''}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderBaseFormInput(false)}
    `;
  }
}