import { html } from 'lit';
import { property, queryAssignedElements, query } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScInputGroupStyle from './ScInputGroup.style.js';
import { FormBase } from '../common/FormBase.js';
import { HasSlotController } from '../../shared/slot.js';
import '../../../elements/sc-text-input.js';
import { COMPACT_SIZE, TEXT_SIZE } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';

const INPUT_TAGS = ['sc-dropdown-input', 'sc-text-input', 'sc-date-input', 'sc-number-input', 'sc-card-number-input', 'sc-time-input'];

export class ScInputGroup extends FormBase {
  static styles = ScTheme.getStyles().concat([ScInputGroupStyle]);

  @query('slot[name="label"]') labelSlot: HTMLSlotElement;

  @property() width = '100%';

  @property({ type: Boolean, attribute: false }) readonly = false;

  @property({ type: Boolean, attribute: false }) clear = false;

  @property({ type: String, attribute: 'border-type' }) borderType = 'box';

  @property({ type: String, attribute: false }) type = 'text';

  @property({ type: String, attribute: false }) placeholder = '';

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property({ attribute: 'label-size' }) labelSize: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @queryAssignedElements({ selector: 'sc-input-group > *' })
  public allElements: Array<any>;

  private _error = false;

  get hasTooltip() {
    return !!(this.tooltip || this.hasSlotController.test('label-tooltip'));
  }
  get hashint() {
    return !!(this.hint || this.hasSlotController.test('label-hint'));
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip',
    'label-hint',
    'error',
    'success',
    'help'
  );

  private setCommonProperty(item: {el: any, property: string}) {
    // @ts-ignore
    if (this[item.property]) {
      item.el[item.property] = true;
    }
  }

  @watch('size', { waitUntilFirstUpdate: true })
  setSize() {
    const inputContainer = this.shadowRoot?.querySelector('[part="input-container"]');
    inputContainer?.childNodes?.forEach(el => {
      if (el.firstChild) {
        (el.firstChild as any).size = this.size;
      }
    });
  }


  private inputChanged(): void {
    const inputContainer = this.shadowRoot?.querySelector('[part="input-container"]');
    const inputs = this.shadowRoot?.querySelector('[part="inputs"]');
    let firstEl: any, lastEl: any;
    let index = 0;
    this._error = false;
    const fragments = document.createDocumentFragment();
    this.allElements.forEach((el: any) => {
      if (INPUT_TAGS.includes(el.tagName.toLowerCase())) {
        if (index === 0) firstEl = el;
        lastEl = el;
        index += 1;
        el.label = '';
        el.borderType = 'box';
        if (el.error) {
          this._error = true;
        }
        el.style.setProperty('--sc-group-form-input-border-radius-size', 'none');
        if (inputContainer) {
          const div = document.createElement('div');
          div.appendChild(el);
          ['error', 'success', 'disabled', 'readonly'].forEach(prop => {
            this.setCommonProperty({ el, property: prop });
          });
          el.size = this.size;
          if ('success' in el && el.success) div.style.setProperty('z-index', '2');
          if ('error' in el && el.error) div.style.setProperty('z-index', '2');
          div.style.setProperty('width', el.attributes.width ? el.attributes.width.value : '100%');
          fragments.appendChild(div);
        }
      } else {
        el.parentNode.removeChild(el);
      }
    });
    // one input gets error, show error state in group
    if (this._error) {
      fragments.childNodes.forEach(el => {
        if (el.firstChild) {
          (el.firstChild as any).error = true;
        }
      });
    }
    inputContainer?.appendChild(fragments);
    if (index === 1) {
      firstEl!.style.setProperty(
        '--sc-group-form-input-border-radius-size',
        'var(--sc-form-input-border-radius-size, 6px)'
      );

      firstEl!.style.setProperty(
        '--sc-input-group-item-border-color',
        'var(--sc-form-input-error-border-color, var(--sc-color-red-500))'
      );
    } else {
      if (firstEl) {
        firstEl.style.setProperty(
          '--sc-input-group-item-border-color',
          'var(--sc-form-input-error-border-color, var(--sc-color-red-500)) var(--sc-form-control-border-color, var(--sc-color-grey-150)) var(--sc-form-input-error-border-color, var(--sc-color-red-500)) var(--sc-form-input-error-border-color, var(--sc-color-red-500))'
        );

        firstEl.style.setProperty(
          '--sc-group-form-input-border-radius-size',
          'var(--sc-form-input-border-radius-size, 6px) 0 0 var(--sc-form-input-border-radius-size, 6px)'
        );
      }
      if (lastEl) {
        lastEl.style.setProperty(
          '--sc-group-form-input-border-radius-size',
          '0 var(--sc-form-input-border-radius-size, 6px) var(--sc-form-input-border-radius-size, 6px) 0'
        );
       
        lastEl.style.setProperty(
          '--sc-input-group-item-border-color',
          'var(--sc-form-input-error-border-color, var(--sc-color-red-500)) var(--sc-form-input-error-border-color, var(--sc-color-red-500))  var(--sc-form-input-error-border-color, var(--sc-color-red-500)) var(--sc-form-control-border-color, var(--sc-color-grey-150))'
        );
      }
    }
    if (inputs) {
      inputs.childNodes.forEach(n => n.remove());
    }
  }

  render() {
    const hasLabelSlot = this.hasSlotController.test('label');
    const errorSlot = this.hasSlotController.test('error') ? html`<slot name='error' slot='error'></slot>` : null;
    const successSlot = this.hasSlotController.test('success') ? html`<slot name='success' slot='success'></slot>` : null;
    const helpSlot = this.hasSlotController.test('help') ? html`<slot name='help' slot='help'></slot>` : null;

    return html`
    <div 
      class='sc-input-group ${this.error ? 'error' : this.success ? 'success' : ''}' 
      style='--sc-input-group-width: ${this.width};'
    >
      <sc-text-input
        label=${this.label}
        .required=${this.required}
        ?truncate=${this.truncate}
        help-text=${this.helpText}
        error-message=${this.errorMessage}
        success-message=${this.successMessage}
        tooltip=${this.tooltip}
        tooltip-placement=${this.tooltipPlacement}
        hint=${this.hint}
        hint-placement=${this.hintPlacement}
        label-size=${this.labelSize}
      >
        ${this.label ? null : hasLabelSlot ? html`<slot name="label"></slot>` : null}
        ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : null}
        ${this.hashint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
        <div slot="form-control">
          <div part="inputs">
              <slot @slotchange=${this.inputChanged}></slot>
          </div>
          <div part="input-container"></div>
        </div>
        ${this.helpText ? null : helpSlot}
        ${this.successMessage ? null : successSlot}
        ${this.errorMessage ? null : errorSlot}
      </sc-text-input>
    </div>
    `;
  }
}