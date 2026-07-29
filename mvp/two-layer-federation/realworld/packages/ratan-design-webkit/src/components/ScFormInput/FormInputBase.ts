import { property, state, query } from 'lit/decorators.js';
import { html, PropertyValues, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FormBase } from '../common/FormBase.js';
import {
  formGroupStyle,
  activeInputStyle,
  focusInputStyle,
} from './FormInput.style.js';
import '../../../elements/sc-label.js';
import '../../../elements/sc-icon.js';
import { getNamedSlotTextContent, HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { ICON_SIZE, TEXT_SIZE, LABEL_POSITION } from '../../shared/util.js';
import { msg } from '@lit/localize';

export class FormInputBase extends FormBase {
  @property() value: any = '';

  @property({ type: String, attribute: 'border-type' }) borderType : 'line' | 'box' = 'box';

  @property({ type: Boolean }) clearable = false;

  @property({ attribute: 'label-position' }) labelPosition: `${LABEL_POSITION}` = LABEL_POSITION.top;

  @property() size: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @property({ attribute: 'icon-size' }) iconSize?: `${ICON_SIZE}`;

  @property({ type: String, attribute: 'text-align' }) textAlign: 'left' | 'right' = 'left';

  @property({ type: Boolean, state: true }) _active = false;

  @property({ type: Boolean, state: true }) _focus = false;
  @property({ type: Boolean, state: true }) _focusPointer = false;
  @property({ type: Boolean, state: true }) _hover = false;

  @property({ type: Boolean, attribute: 'default-slot-not-as-label' })
  useDefaultSlotNotAsLabel = false;

  @property({ type: String, attribute: false }) formControlClsName =
    'sc-form-control';

  @state() private prefixIconSize: number | false;

  @state() isExpanded = false;

  @state() showExpandButton = false;

  iconChangeObserver?: ResizeObserver;

  get hasLabel() {
    return !!(
      this.label ||
      this.hasSlotController.test('[default]') ||
      this.hasSlotController.test('form-label') ||
      this.hasSlotController.test('label') ||
      this.tooltip ||
      this.hasSlotController.test('label-tooltip')
    );
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip',
    'form-label',
    'label-hint',
    'prefix',
    'error',
    'success'
  );

  bindEvents() {
    const textInput = (this.renderRoot as any) // eslint-disable-line
      .querySelector(`.${this.formControlClsName}`);
    
    const inputGroup = this.renderRoot.querySelector('.sc-form-group-input');
    
    if (inputGroup) {
      inputGroup.addEventListener('mouseover', (e: Event) => {
        this.emit('sc-mouseover', {
          detail: {
            value: (e.target as HTMLInputElement).value,
          },
        });
        this._hover = true;
      });
      inputGroup.addEventListener('mouseleave', (e: Event) => {
        this.emit('sc-mouseleave', {
          detail: {
            value: (e.target as HTMLInputElement).value,
          },
        });
        this._hover = false;
      });
    }
    if (textInput) {
      textInput.addEventListener('input', (e: any) => {
        textInput.value = e.target.value;
        this.value = e.target.value;
        this._active = true;
        if (e.target?.getAttribute && e.target.getAttribute('custom-input-event') === 'true') {
          return;
        }
        this.emit('sc-input', {
          detail: {
            value: e.target.value,
          },
        });
        this.emit('sc-bubble-input', {
          bubbles: true,
          composed: true,
          detail: {
            value: e.target.value,
          },
        });
      });

      textInput.addEventListener('focus', (e: MouseEvent) => {
        this.emit('sc-focus', {
          detail: {
            value: (e.target as HTMLInputElement).value,
          },
        });
        this._focus = true;
      });

      textInput.addEventListener('blur', (e: MouseEvent) => {
        this.emit('sc-blur', {
          detail: {
            value: (e.target as HTMLInputElement).value,
          },
        });
        this._active = false;
        this._focus = false;
        this._focusPointer = false;
      });

      textInput.addEventListener('mousedown', (e:MouseEvent)=>{
        this._focusPointer = true;
      });
      textInput.addEventListener('touchstart', (e:TouchEvent)=>{
        this._focusPointer = true;
      });
    }
  }

  protected firstUpdated(): void {
    this.bindEvents();
    this.bindAfterFirstUpdated();
    this.observePrefixIconSize();
    this.getStyles();
    requestAnimationFrame(() => this.shouldShowExpandButton());
  }

  updated(properties: PropertyValues) {
    if (
      properties.has('readonly') &&
      !!properties.get('readonly') !== !!this.readonly
    ) {
      this.bindEvents();
    }
    this.observePrefixIconSize();
    this.getStyles(); 
  }

  stopDefaultEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  bindAfterFirstUpdated() {}

  renderFormControl(): any {
    return '';
  }

  renderInputStyle() {
    return html`
      ${formGroupStyle}
      ${this._active && !this.disabled ? activeInputStyle : ''}
      ${this._focus && !this.disabled ? focusInputStyle : ''}
    `;
  }

  
  clearValue(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.value = '';
    this.emit('sc-clear');
  }

  getCurrentIconSize() {
    if (this.iconSize) {
      return this.iconSize;
    }
    let iconSize: `${ICON_SIZE}`;
    switch (this.size) {
      case 'sm':
        iconSize = 'xxs';
        break;
      case 'md':
        iconSize = 'sm';
        break;
      case 'lg':
        iconSize = 'md';
        break;
      default:
        iconSize = 'sm';
        break;
    }
    return iconSize;
  }
  
  renderClearIcon() {
    return html`
      <div class='clear'>
        <sc-icon @click=${this.clearValue} name='close-circle--fill' size=${this.getCurrentIconSize()}></sc-icon>
      </div>
    `;
  }

  renderClearablePart() {
    return html`
      ${this.clearable && !this.disabled && this.value && (this._hover || this._focus) ? this.renderClearIcon() : null}
    `;
  }

  renderMoreIcons() {}

  renderPrefix() {}

  renderDescription() {}

  observePrefixIconSize() {
    const prefix = this.shadowRoot!.querySelector(
      '.sc-form-prefix-icon sc-icon'
    ); 
    if (prefix !== null) {
      this.iconChangeObserver = new ResizeObserver(() => {
        this.prefixIconSize = this.getPrefixIconSize();
      });
      this.iconChangeObserver.observe(prefix);
    }
  }

  getPrefixDot(prefix:any) {
    let prefixDot = null;
    if (!prefix) {
      prefixDot = this.hasSlotController.test('prefix');
    }
    return prefixDot;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    if (this.iconChangeObserver) {
      const prefix = this.shadowRoot!.querySelector(
        '.sc-form-prefix-icon sc-icon'
      ); 
      if (prefix) {
        this.iconChangeObserver.unobserve(prefix);
      }
      this.iconChangeObserver = undefined;
    }
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback();
  }

  private handleResize = () => {
    this.shouldShowExpandButton();
  };

  @watch(['borderType', 'prefixIconSize', 'readonlyRows'])
  getStyles() {
    setTimeout(() => {
      const iconDefaultSize = 36;
      const scFormPaddingLeft = 12;
      const scFormPaddingRight = 12;
      const prefix = this.shadowRoot!.querySelector('.sc-form-prefix-icon'); // eslint-disable-line
      const prefixDot = this.getPrefixDot(prefix);
      const suffix = this.shadowRoot!.querySelector('.sc-form-more-icons'); // eslint-disable-line
      const tipIcon = this.shadowRoot!.querySelector('.sc-form-group-icon'); // eslint-disable-line
      let paddingLeft = (prefix?.clientWidth || 0) + scFormPaddingLeft;
      // add padding left if has prefix dot for dropdown input
      if (prefixDot) {
        paddingLeft = 25;
      }
      const tipWidth = tipIcon ? tipIcon.clientWidth || iconDefaultSize : 0;
      let paddingRight =
        (suffix?.clientWidth ?? 0) +
        tipWidth +
        scFormPaddingRight;
      const scFormControl: any = this.shadowRoot!.querySelector(
        `.${this.formControlClsName}`
      ); // eslint-disable-line
      if (this.borderType === 'line' && !this.readonly) {
        paddingLeft = 0;
        paddingRight = 0;
      }
      if (scFormControl) {
        scFormControl.style['padding-left'] = `${paddingLeft}px`;
        scFormControl.style['padding-right'] = `${paddingRight}px`;
        scFormControl.style['-webkit-line-clamp'] = this.readonlyRows;
      }
      const expandButton = this.shadowRoot!.querySelector('.expand-button') as HTMLElement;
      if (expandButton) {
        expandButton.style.setProperty('padding-left', `${paddingLeft}px`);
        expandButton.style.setProperty('padding-right', `${paddingRight}px`);
      }
    }, 0);
  }
  @watch(['value', 'readonly', 'maxRows', 'readonlyRows'])
  async shouldShowExpandButton() {
    await this.updateComplete;
    if (!this.readonly || !this.maxRows) {
      this.showExpandButton = false;
      return;
    }
    if (this.isExpanded) {
      this.showExpandButton = true;
      return;
    }

    requestAnimationFrame(() => {
      const scFormControl = this.shadowRoot?.querySelector(
        `.${this.formControlClsName}`
      ) as HTMLElement | null;

      if (scFormControl) {
        const computedStyle = getComputedStyle(scFormControl);
        const lineHeight = parseFloat(computedStyle.lineHeight || '0') || 16;

        if (!lineHeight || isNaN(lineHeight)) {
          this.showExpandButton = true;
          return;
        }

        const tolerance = 1;
        this.showExpandButton =
          scFormControl.scrollHeight > scFormControl.clientHeight + tolerance;
      } else {
        this.showExpandButton = false;
      }
    });
  }
  
  handleExpandClick() {
    const scFormControl = this.shadowRoot!.querySelector(
      `.${this.formControlClsName}`
    ) as HTMLElement | null;
  
    if (scFormControl) {
      scFormControl.style['display'] = this.isExpanded ? '-webkit-box' : 'block';
    }
    this.isExpanded = !this.isExpanded;
  }

  private getPrefixIconSize() {
    const prefix = this.shadowRoot!.querySelector(
      '.sc-form-prefix-icon sc-icon'
    );
    if (!prefix) {
      return false;
    }   
    return prefix.clientWidth;
  }

  renderBaseFormInput(
    useDefaultSlotAsLabel = true
  ): TemplateResult {
    const hasTootip =
      this.tooltip.length > 0 || this.hasSlotController.test('label-tooltip');
    const hasHint =
      this.hint.length > 0 || this.hasSlotController.test('label-hint');
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasSuccessSlotContent =
      getNamedSlotTextContent(this, 'success').length > 0;
    const hasErrorSlotContent =
      getNamedSlotTextContent(this, 'error').length > 0;
    const renderLabel = 
      (hasDefaultSlot && useDefaultSlotAsLabel && !this.useDefaultSlotNotAsLabel) 
      || hasLabelSlot || this.label || hasTootip || hasHint;

    let expandButtonIcon;
    let expandButtonText;
    if (this.isExpanded) {
      expandButtonIcon = 'arrow-ios-upward';
      expandButtonText = msg('Collapse all', { id: 'sc-form-input-collapse-all' });
    } else {
      expandButtonIcon = 'arrow-ios-downward';
      expandButtonText = msg('Expand all', { id: 'sc-form-input-expand-all' });
    }
    return html`
      ${this.renderInputStyle()}
      <div
        class=${classMap({
          'sc-form-group': true,
          [`sc-form-group-${this.size}`]: Boolean(this.size),
          'sc-form-group-error': this.error,
          'sc-form-group-success': this.success,
          'sc-form-group-readonly': this.readonly,
          'sc-form-group-readonly-max-rows': this.readonly && this.maxRows,
          'sc-form-group-disabled': this.disabled,
          'no-label': !this.hasLabel,
          focus: this._focus && !this._focusPointer,
          'label-right': this.labelPosition === 'right',
          'label-top': this.labelPosition === 'top',
          'label-top-right': this.labelPosition === 'top-right',
          'label-left': this.labelPosition === 'left',
          'label-bottom': this.labelPosition === 'bottom',
          [this.borderType]: true,
          [`sc-form-group-${this.textAlign}`]: Boolean(this.textAlign),
        })}
        aria-label=${this.label}
        aria-labelledby="label"
        aria-errormessage="error-message"
        aria-describedby="help-text"
        part="base"
      >
        <div
          class=${classMap({
            'sc-form-group-main-context': true,
            'label-right': this.labelPosition === 'right',
            'label-top': this.labelPosition === 'top',
            'label-top-right': this.labelPosition === 'top-right',
            'label-left': this.labelPosition === 'left',
            'label-bottom': this.labelPosition === 'bottom',
            [this.borderType]: true,
          })}
        >
          <div
            class='sc-form-group-label'
            style='display: ${renderLabel ? 'block' : 'none'}'
            id='label'
            part='label'
            @click=${this.stopDefaultEvent}
          >
            <sc-label
              exportparts="sc-label-root"
              tooltip-placement=${this.tooltipPlacement}
              hint-placement=${this.hintPlacement}
              label-size=${this.labelSize || this.size}
              label=${this.label}
              label-alignment=${this.labelPosition === 'top-right' ? 'right' : 'left'}
              ?required=${this.required}
              ?truncate=${this.truncate}
            >
              ${hasDefaultSlot &&
              useDefaultSlotAsLabel &&
              !this.useDefaultSlotNotAsLabel
                ? html`<slot slot="label">${this.label}</slot>`
                : hasLabelSlot
                ? html`<slot name="label" slot="label">${this.label}</slot>`
                : null}
              ${hasTootip
                ? html`
                    <slot name="label-tooltip" slot="tooltip"
                      >${this.tooltip}</slot
                    >
                  `
                : ''}
              ${hasHint
                ? html`
                    <slot name="label-hint" slot="hint"
                      >${this.hint}</slot
                    >
                  `
                : ''}
            </sc-label>
          </div>
          <div class='sc-form-group-input' part="input-area">
            <span class='sc-form-prefix-icon'>
              ${this.renderPrefix()}
            </span>
            <span part='more-icons' class='sc-form-more-icons'>
              ${this.renderMoreIcons()}
            </span>
            <div part="input-group">
              <slot name="form-control" class="form-control">
                ${this.renderFormControl()}
              </slot>
            </div>
            ${this.showExpandButton
              ? html`
                  <sc-button
                    class="expand-button"
                    type="link"
                    state="default"
                    right-icon=${expandButtonIcon}
                    compact
                    @click=${this.handleExpandClick}
                  >
                    ${expandButtonText}
                  </sc-button>
                `
              : ''}
            <!-- ${this.error || this.success
              ? html`<div
                  class="sc-form-group-icon"
                  part="tips-icon"
                  @click=${this.stopDefaultEvent}
                >
                  ${this.error
                    ? html`<sc-icon
                        size="md"
                        name="alert-circle--line"
                      ></sc-icon>`
                    : html`<sc-icon
                        size="md"
                        name="checkmark-circle--line"
                      ></sc-icon>`}
                </div> `
              : null} -->
              </div>
            </div>
          <div class='sc-form-group-description'>
            <div class='message-container'>
              ${this.labelPosition !== 'left' ? 
                html`<div
                  class='help-message ${classMap({
                    'help-text-container': true,
                    hide: !(this.helpText || this.hasSlotController.test('help')),
                    'label-right': this.labelPosition === 'right',
                  })}'
                  id='help-text'
                  part='help-message'
                >
                <slot name='help'>
                  ${this.helpText}
                </slot>
              </div>` : ''}
              ${this.successMessage || hasSuccessSlotContent ? html`
                <div
                  class="success-message"
                  id="success-message"
                  part="success-message"
                >
                  <slot name="success"> ${this.successMessage} </slot>
                </div>
              ` : null}
              ${this.errorMessage || hasErrorSlotContent ? html`
                <div
                  class="error-message"
                  id="error-message"
                  part="error-message"
                >
                  <slot name="error"> ${this.errorMessage} </slot>
                </div>
              ` : null}
            </div> 
            ${this.renderDescription()}
          </div>
      </div>
    `;
  }

  render(): TemplateResult {
    return html` ${this.renderBaseFormInput()} `;
  }
}