import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio.component.js';
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScRadioStyle from './ScRadio.style.js';
import type { ScRadio } from './ScRadio.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import { generateUniqueId } from '../../shared/generate-unique-id.js';
import { watch } from '../../shared/watch.js';

export class ScRadioGroup extends FormInputBase {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([ScRadioStyle]);

  static get scopedElements() {
    return {
      'sl-radio': SlRadio,
      'sl-radio-group': SlRadioGroup,
    };
  }

  private activeRadio?: ScRadio;

  radios: ScRadio[] = [];

  clickTimer: undefined | ReturnType<typeof setTimeout> = undefined;

  clicked = false;

  @property({ type: String }) value: string;

  @property({ type: Boolean, attribute: 'enable-cancellation' }) enableCancellation = false;

  @property({ type: String }) direction: 'horizontal' | 'vertical'  = 'vertical';

  @property({ type: Number }) columns?: number;

  connectedCallback() {
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-radio'),
    ]);

    super.connectedCallback();
    this.updateComplete.then(() => {
      whenAllDefined.then(() => {
        this.setActiveRadio(this.getActiveRadio() as any);
      });
    });
    this.addEventListener('mouseup', this.handleMouseUp);
    this.addEventListener('keydown', this.handleKeyDownTab);
    this.addEventListener('keydown', this.handleKeyDownSpacebar);
  }

  @watch(['value', 'readonly', 'disabled', 'error'])
  async onStateChange() {
    if (!this.readonly) {
      await this.updateComplete;
      this.syncRadios();
      this.setActiveRadio(this.getActiveRadio());
    }
  }

  private getAllRadios(
    options: { includeDisabled: boolean } = { includeDisabled: true }
  ) {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('.sc-radio-group slot');
    const assignedElements = slot?.assignedElements() ?? [];
    return [...(assignedElements as ScRadio[])].filter(el => {
      const isScRadio = el.tagName.toLowerCase() === 'sc-radio';
      if (isScRadio && this.direction === 'horizontal') {
        el.direction = 'horizontal';
        if (!!this.columns) {
          const targetDiv = el?.shadowRoot?.querySelector('div.radio-wrapper');
          targetDiv?.classList.add('sc-radio-flex');
        }
      } else {
        el.direction = 'default';
      }
      if (isScRadio) {
        el._disabled = this.disabled || el.disabled;
        el.error = this.error;
        el.checked = el === this.activeRadio;
      }
      return options.includeDisabled
        ? isScRadio
        : isScRadio && !el.disabled;
    });
  }

  private handleKeyDownTab = async (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const radios = this.radios || [];
    if (!radios.length) return;
    const active = event.target;
    const currentIndex = radios.findIndex(r => r === active);
    let nextIndex: number;
    if (!event.shiftKey) {
      nextIndex = (currentIndex + 1) % radios.length;
    } else {
      nextIndex = (currentIndex - 1 + radios.length) % radios.length;
    }
    const slRadio = await radios[nextIndex].shadowRoot?.querySelector('sl-radio') as HTMLElement | null;
    slRadio?.focus();
    event.preventDefault();
  };

  private handleKeyDownSpacebar = (event: KeyboardEvent) => {
    const radios = this.radios || [];
    const activeIndex = radios.findIndex(r => r === event.target);
    if (event.key === ' ' || event.key === 'Spacebar') {
      const focusedRadio = radios[activeIndex];
      if (focusedRadio && !focusedRadio.disabled) {
        this.value = focusedRadio.value;
        this.setActiveRadio(focusedRadio);
        event.preventDefault();
      }
    }
  };

  private syncRadios() {
    // Track disabled radios to ensure they can be unchecked when value changes
    this.radios = this.getAllRadios({ includeDisabled: true });
    this.radios.forEach(radio => {
      radio.tabIndex  = (radio === this.getActiveRadio()) ? 0 : -1;
    });
  }

  private getActiveRadio() {
    return this.radios.find((el: ScRadio) => el.value === this.value);
  }

  bindEvents() {}

  setActiveRadio(radio: ScRadio | undefined) {
    if (!radio) {
      this.radios.forEach(
        (el: ScRadio) => { 
          el.checked = false; el.key = generateUniqueId(); }
      );
    } else {
      if (radio !== this.activeRadio) {
        this.activeRadio = radio;
        this.value = this.activeRadio.value;
  
        // Sync active radio
        this.radios.forEach(
          (el: ScRadio) => { el.checked = el === this.activeRadio; el.key = generateUniqueId(); }
        );
      }
    }
  }

  handleClick = (event: MouseEvent) => {
    if (this.clicked) return;
    this.clicked = true;
    const target = event.target as HTMLElement;
    const radio: ScRadio = target.closest('sc-radio')!; // eslint-disable-line
    const radioGroup = radio?.closest('sc-radio-group');
    // Ensure the target tab is in this tab group
    if (radioGroup !== this) {
      return;
    }
    this.clickTimer = setTimeout(() => {
      this.clicked = false;
      if (radio !== null && !this.disabled) {
        const isDisabled = this.disabled || radio.disabled;
        if (isDisabled) return;
        this.setActiveRadio(radio);
        this.emit('sc-change', {
          detail: {
            value: radio?.value,
          },
        });
      }
    }, !this.enableCancellation ? 0 : 200);
  };

  handleMouseUp = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const radio: ScRadio = target.closest('sc-radio')!;
    const radioGroup = radio?.closest('sc-radio-group');
  
    if (radioGroup === this && this.clicked) {
      this.clicked = false;
    }
  };
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseup', this.handleMouseUp);
    this.removeEventListener('keydown', this.handleKeyDownTab);
    this.removeEventListener('keydown', this.handleKeyDownSpacebar);
  }

  handleDoubleClick = () => {
    if (!this.enableCancellation || this.disabled || this.readonly) {
      return;
    }
    clearTimeout(this.clickTimer);
    this.clicked = false;
    // Cancel the selected value
    this.value = '';
    this.setActiveRadio(this.getActiveRadio() as any);
    this.emit('sc-change', {
      detail: {
        value: '',
      },
    });
  };

  renderBaseRadioStyle () {
    const baseStyle = html`
      <style>      
        .sc-radio::part(base) {
          toggle-size: 1rem;
          toggle-color: white;
          toggle-border-color: blue;
          toggle-border-width: .125rem;
        }
        .sc-radio::part(control) {
          indicator-color: blue;
          indicator-size: .5rem;
        } 
        .sc-radio-group-flex.horizontal slot{
          display: flex;
          flex-wrap: wrap; 
          justify-content: flex-start;
          width: 100%;
          gap: 4px;
        }
        .sc-radio-group-flex ::slotted(sc-radio)  {
          flex: 0 0 calc(${(100 / (this.columns || 1)).toFixed(2)}% - 5px);
          text-align: left;
          box-sizing: border-box;
        }
        sc-radio.sc-radio-flex::part(base){
          margin: 0 0 0.5rem 0;
        }
      </style>
    `;

    return html` ${baseStyle} `;
  }

  renderFormControl() {
    if (this.readonly) {
      let text = '';
      if (this.value) {
        const items = this.querySelectorAll('sc-radio');
        if (items) {
          const activeItem = Array.from(items).find(r => r.value == this.value); // eslint-disable-line
          if (activeItem) {
            text = activeItem.innerText;
          }
        }
      }
      return html`
        <div class='sc-form-control'>${text}</div>
      `;
    } else {
      return html`
      ${this.renderBaseRadioStyle()}
      <div
        class=${classMap({
    'sc-radio-group': true,
    'sc-radio-group-flex': this.direction === 'horizontal' && !!this.columns,
    error: this.error,
    horizontal: this.direction === 'horizontal',
  })}
        @click=${this.handleClick}
        @dblclick=${this.handleDoubleClick}
      >
        <slot @slotchange=${this.syncRadios}></slot>
      </div>
    `;
    }
  }

  render() {
    return html`
      ${this.renderBaseFormInput(false)}
    `;
  }
}
