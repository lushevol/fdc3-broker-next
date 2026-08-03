import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScCheckboxStyle from './ScCheckbox.style.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';

export class ScCheckbox extends FormInputBase {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([ScCheckboxStyle]);

  static get scopedElements() {
    return {
      'sl-checkbox': SlCheckbox,
    };
  }

  @property({ type: Boolean }) checked = false;

  @property({ type: Boolean }) indeterminate = false;

  @property({ type: Boolean }) compact = false;

  @property({ type: String, attribute: false }) direction: 'horizontal' | 'default'  = 'default';
  
  @property({ type: Number }) columns: number;

  @query('sl-checkbox') slCheckbox: SlCheckbox;

  protected firstUpdated(): void {
    const SlCheckbox = this.renderRoot.querySelector('sl-checkbox');
    if (SlCheckbox) {
      SlCheckbox.addEventListener('sl-change', (event: any) => {
        this.checked = event.target.checked;
        this.emit('sc-change', {
          detail: {
            checked: event.target.checked,
          },
        });
      });
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('checked')) {
      const slCheckbox = this.shadowRoot?.querySelector('sl-checkbox') as HTMLInputElement;
      if (slCheckbox) {
        slCheckbox.checked = this.checked;
      }
    }
  }

  click() {
    this.slCheckbox.click();
  }

  renderFormControl() {
    if (this.readonly) {
      return html`
        <div class="sc-checkbox-readonly"><slot></slot></div>
      `;
    }
    return html`
      ${this.renderCheckbox()}    
    `;
  }
  
  renderCheckbox() {
    return html`
      <sl-checkbox
        style="--sl-input-font-size-medium: 14px;"
        class=${classMap({
          'sc-checkbox': true,
          horizontal: this.direction === 'horizontal',
          'sc-checkbox-flex': !!this.columns,
          'has-message': 
            this.hasSlotController.test('help') || 
            this.hasSlotController.test('success') || 
            this.hasSlotController.test('error'),
          'sc-truncate': this.truncate,
        })}
        .value=${this.value}
        part=selection
        ?disabled=${this.disabled}
        ?checked=${this.checked}
        ?indeterminate=${this.indeterminate}
      >
        <slot></slot>
      </sl-checkbox>
    `;
  }

  render() {
    if (this.compact) {
      return html`
        ${this.renderCheckbox()}
      `;
    }
    return html`
      ${this.renderBaseFormInput(false)}
    `;
  }
}
