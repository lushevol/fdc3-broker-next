import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio.component.js';
import ScTheme from '../../styles/ScTheme.js';
import ScRadioStyle from './ScRadio.style.js';
import ScElement from '../../shared/sc-element.js';
import { watch } from '../../shared/watch.js';

export class ScRadio extends ScElement {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([ScRadioStyle]);

  static get scopedElements() {
    return {
      'sl-radio': SlRadio,
    };
  }

  @query('sl-radio') slRadio: SlRadio;

  @property({ type: Boolean }) checked = false;

  @property({ type: Boolean }) error = false;

  @property({ type: String }) value = '';

  @property({ type: String }) key = '';

  @property({ type: Boolean }) disabled = false;

  @property({ type: String, attribute: 'help-text' }) helpText: string | undefined; 

  @property({ type: String, attribute: false }) direction: 'horizontal' | 'default'  = 'default';

  @property({ type: Boolean, attribute: false }) _disabled = false;

  @state() _checked = false;

  textChangeObserver?: ResizeObserver;

  firstUpdated() {
    this.helpTextDisabledUpdated();
    // resolve: first render when checked=true sl-radio not slected 
    this._checked = this.checked;
  }

  private updateHelpTextHeight() {
    const helpTextElement = this.shadowRoot?.querySelector('.sc-radio-help-text') as HTMLElement;
    const helpTextHorizontalElement = this.shadowRoot?.querySelector('.sc-radio-help-text.horizontal') as HTMLElement;
    if (helpTextHorizontalElement) {
      const helpTextHeight = helpTextElement.offsetHeight;
      const radioElement = this.shadowRoot?.querySelector('.radio-wrapper.horizontal') as HTMLElement;
      if (radioElement) {
        radioElement.style.paddingBottom = `${helpTextHeight}px`;
      }
    } else if (helpTextElement) {
      const radioElement = this.shadowRoot?.querySelector('.radio-wrapper') as HTMLElement;
      if (radioElement) {
        radioElement.style.paddingBottom = '0px';
      }
    }
  }
  
  @watch(['helpText, disabled'], { waitUntilFirstUpdate: true })
  helpTextDisabledUpdated(): void {
    this._disabled = this.disabled;
    this.updateComplete.then(() => {
      this.updateHelpTextHeight();
    });
    const textElement = this.shadowRoot?.querySelector('.sc-radio-help-text');
    if (textElement) {
      this.textChangeObserver = new ResizeObserver(() => {
        this.updateHelpTextHeight();
      });
      this.textChangeObserver.observe(textElement);
    }
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  disableUpdate() {
    this._disabled = this.disabled;
  }

  @watch('checked', { waitUntilFirstUpdate: true })
  updateCheckedStatus() {
    this._checked = this.checked;
    this.emit('sc-change', {
      detail: {
        value: this.checked,
      },
    });
  }

  willUpdate(properties: any) {
    if (properties.has('key') && this.key) {
      if (this.slRadio) {
        this.slRadio.checked = this.checked;
      }
    }
  }

  render() {
    return html`
      <div
        class=${classMap({
        'radio-wrapper': true,
        horizontal: this.direction === 'horizontal',
  })} 
        role="presentation" 
        part='base'
      >
        <sl-radio
          .key=${this.key}
          .value=${this.value}
          .disabled=${this._disabled}
          .checked=${this._checked}
          ?error=${this.error}
          class='sc-radio'
        >
          <slot></slot>
          ${this.helpText
    ? html`
                <div 
                  part="help-text" 
                  class="sc-radio-help-text ${this.error ? 'error' : ''} ${this.direction === 'horizontal' ? 'horizontal' : ''}"
                  >
                  ${this.helpText}
                </div>
              ` : ''}
        </sl-radio>
      </div>
    `;
  }
}
