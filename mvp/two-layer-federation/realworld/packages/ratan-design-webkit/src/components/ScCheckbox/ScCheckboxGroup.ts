import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScCheckboxGroupStyle from './ScCheckboxGroup.style.js';
import type { ScCheckbox } from './ScCheckbox.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import { watch } from '../../shared/watch.js';
export class ScCheckboxGroup extends FormInputBase {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([ScCheckboxGroupStyle]);

  private activeCheckboxs: ScCheckbox[] = [];

  checkboxs: ScCheckbox[] = [];

  @property({ type: String }) direction: 'horizontal' | 'default' = 'default';

  // @ts-ignore
  @property({ type: Array }) value: any[] = [];
  @property({ type: Number }) columns?: number;

  @watch('value', { waitUntilFirstUpdate: true })
  updateStatusAccordingValue() {
    this.activeCheckboxs = [];
    const initialActiveCheckboxs = this.getActiveCheckboxs();
    if (initialActiveCheckboxs) {
      this.setActiveCheckboxs(initialActiveCheckboxs, {
        emitEvents: false,
      });
    }
    this.updateParentCheckboxState();
  }

  @watch(['direction', 'disabled'])
  handlePropertyChange() {
    this.syncCheckboxs();
  }

  connectedCallback() {
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-checkbox'),
    ]);

    super.connectedCallback();
    this.updateComplete.then(() => {
      whenAllDefined.then(() => {
        this.updateStatusAccordingValue();
      });
    });
    if (this.direction === 'default')
      this.style.setProperty('--sc-form-group-input-min-height', 'auto');
  }

  private getAllCheckboxs(
    options: { includeDisabled: boolean } = { includeDisabled: true }
  ) {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      '.sc-checkbox-group slot'
    );
    return [...(slot?.assignedElements() as ScCheckbox[] || [])].filter(el => {
      const isScCheckbox = el.tagName.toLowerCase() === 'sc-checkbox';
      if (isScCheckbox && this.direction === 'horizontal') {
        el.direction = 'horizontal';
        if (this.columns) {
          el.columns = this.columns;
        }
      }
      if (this.disabled) {
        el.shadowRoot?.querySelector('sl-checkbox')?.setAttribute('disabled', 'true');
      } else if (!el.disabled) {
        el.shadowRoot?.querySelector('sl-checkbox')?.removeAttribute('disabled');
      }
      return options.includeDisabled
        ? isScCheckbox
        : isScCheckbox && !el.disabled;
    });
  }

  private syncCheckboxs() {
    this.checkboxs = this.getAllCheckboxs({ includeDisabled: true });
  }

  private getActiveCheckboxs() {
    return this.checkboxs.filter((el: ScCheckbox) =>
      this.checkIfInValue(el.value)
    );
  }

  private checkIfInValue(value: any) {
    if (!this.value) {
      return false;
    }
    if (Array.isArray(this.value)) {
      return !!this.value.find(v => v == value); // eslint-disable-line
    }
  }

  setActiveCheckboxs(
    checkboxs: ScCheckbox[],
    config?: { emitEvents?: boolean }
  ) {
    const options = {
      emitEvents: config?.emitEvents,
      ...config,
    };

    checkboxs.forEach((checkbox: ScCheckbox) => {
      const exist = this.activeCheckboxs.includes(checkbox);
      if (!exist) {
        this.activeCheckboxs.push(checkbox);
      }
    });

    // Sync active checkbox
    this.syncActiveCheckbox();

    // Emit events
    if (options.emitEvents) {
      this.emit('sc-change', {
        detail: {
          value: this.getActiveCheckboxValue(),
        },
      });
    }
  }

  syncActiveCheckbox() {
    this.checkboxs.forEach(
      (el: ScCheckbox) => (el.checked = this.activeCheckboxs.includes(el))
    );
  }

  getActiveCheckboxValue() {
    return this.activeCheckboxs
      .filter(checkbox => checkbox?.role !== 'parent') // removing parent checkbox value from event
      .map(checkbox => checkbox.value);
  }

  removeActiveCheckbox(checkbox: ScCheckbox) {
    const activeIndex = this.activeCheckboxs.findIndex(c => c === checkbox);
    if (activeIndex > -1) {
      this.activeCheckboxs.splice(activeIndex, 1);
    }
    this.syncActiveCheckbox();
    this.emit('sc-change', {
      detail: {
        value: this.getActiveCheckboxValue(),
      },
    });
  }

  removeAllActiveCheckbox() {
    this.activeCheckboxs = [];
    this.syncActiveCheckbox();
    this.emit('sc-change', {
      detail: {
        value: this.getActiveCheckboxValue(),
      },
    });
  }

  updateParentCheckboxState() {
    const parentCheckbox = this.checkboxs.find(el => el.role === 'parent');

    if (parentCheckbox) {
      const childCheckbox = this.checkboxs.filter(el => el.role !== 'parent');
      const checkedCount = childCheckbox.filter(el => el.checked).length;

      this.checkboxs = this.checkboxs.map(el => {
        if (el.role === 'parent') {
          el.checked = childCheckbox.length === checkedCount;
          el.indeterminate =
          checkedCount > 0 && checkedCount < childCheckbox.length;
        }
        return el;
      });
    }
  }

  handleClick(event: MouseEvent) {
    this.stopDefaultEvent(event);
    if (this.disabled || this.readonly) return;
    const target = event.target as HTMLElement;
    const checkbox: ScCheckbox = target.closest('sc-checkbox')!; // eslint-disable-line
    const checkboxGroup = checkbox?.closest('sc-checkbox-group');
    if (checkbox?.disabled) return;
    // Ensure the target tab is in this tab group
    if (checkboxGroup !== this) {
      return;
    }
    if (checkbox?.role && checkbox?.role === 'parent') {
      if (checkbox.checked) {
        this.removeAllActiveCheckbox();
      } else {
        this.setActiveCheckboxs([...this.checkboxs], { emitEvents: true });
      }
    } else if (checkbox !== null) {
      if (checkbox.checked) {
        this.removeActiveCheckbox(checkbox);
      } else {
        this.setActiveCheckboxs([checkbox], { emitEvents: true });
      }
    }
    this.updateParentCheckboxState();
  }

  renderFormControl() {
    if (this.readonly) {
      const text: any[] = [];
      this.value?.forEach(v => {
        const checkboxs = this.querySelectorAll('sc-checkbox');
        if (checkboxs) {
          const activeCheckbox = Array.from(checkboxs).find(c => c.value == v); // eslint-disable-line
          if (activeCheckbox) {
            text.push(activeCheckbox.innerText);
          }
        }
      });
      return html` <div class=sc-form-control>${text.join(', ')}</div> `;
    }
   
    return html`
      <style>
        .sc-checkbox-group-flex.horizontal slot{
          display: flex;
          flex-wrap: wrap; 
          justify-content: flex-start;
          width: 100%;
          gap: 4px;
        }
        .sc-checkbox-group-flex ::slotted(sc-checkbox)  {
          flex: 0 0 calc(${(100 / (this.columns || 1)).toFixed(2)}% - 5px);
          text-align: left;
          box-sizing: border-box;
        }
      </style>
      <div
        class=${classMap({
          'sc-checkbox-group': true,
          'sc-checkbox-group-flex': this.direction === 'horizontal' && !!this.columns,
          horizontal: this.direction === 'horizontal',
          'has-message':
            this.hasSlotController.test('help') ||
            this.hasSlotController.test('success') ||
            this.hasSlotController.test('error'),
          'has-child': !!this.checkboxs.find(el => el.role === 'parent'),
        })}
        @click=${this.handleClick}
      >
        <slot @slotchange=${this.syncCheckboxs}></slot>
      </div>
    `;
  }

  render() {
    return html` ${this.renderBaseFormInput(false)} `;
  }
}
