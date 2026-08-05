import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { ScChatInputStyle } from './ScChat.style.js';

export class ScChatInput extends ScExtElement {
  @property({ type: Boolean }) processing = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) rows = 1;
  @property({ type: String, attribute: 'default-value' }) defaultValue = '';
  @property({ type: String }) placeholder = 'Enter text here...';

  @state() multiline = true;
  @state() innerRows = this.rows;

  private _currentValue = '';

  static styles = [ScChatInputStyle];


  connectedCallback(): void {
    super.connectedCallback();
    this.multiline = true;
    setTimeout(() => {
      const inputDom = this.shadowRoot
        ?.querySelector('.chat-input-box-input')
        ?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
      inputDom?.focus();
      inputDom?.dispatchEvent(new InputEvent('input'));
      this.innerRows = this.rows;
    }, 100);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.multiline = false;
    this.innerRows = 1;
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('rows')) {
      this.innerRows = this.rows;
    }
    if (changedProperties.has('defaultValue')) {
      this._currentValue = this.defaultValue;
    }
  }

  private onSend() {
    this.dispatchEvent(new CustomEvent('send', { detail: { value: this._currentValue } }));
  }

  private onCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  private onInputEventTrigger(current: {
    name: 'blur' | 'input' | 'focus' | 'clear';
    data: CustomEvent<{ value: string }>;
  }) {
    if (current.name === 'clear') {
      this.innerRows = 1;
    } else if (current.name === 'input' && this.innerRows !== this.rows) {
      this.innerRows = this.rows;
    }

    const value = current.data.detail.value;
    this._currentValue = value;
    this.dispatchEvent(new CustomEvent(`sc-${current.name}`, { detail: { value } }));
  }

  private onKeypress(event: KeyboardEvent) {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.onSend();
    }
  }

  render() {
    return html`
      <div class="chat-input-box">
        <div class="chat-input-box-item">
          <sc-text-input
            .disabled=${this.processing || this.disabled}
            class="chat-input-box-input"
            resizable="auto"
            ?clearable=${true}
            ?multiline=${this.multiline}
            rows=${this.innerRows}
            size="lg"
            placeholder=${this.placeholder}
            .value=${this.defaultValue}
            @sc-blur=${(e: CustomEvent<{ value: string }>) => this.onInputEventTrigger({ name: 'blur', data: e })}
            @sc-clear=${(e: CustomEvent<{ value: string }>) => this.onInputEventTrigger({ name: 'clear', data: e })}
            @sc-input=${(e: CustomEvent<{ value: string }>) => this.onInputEventTrigger({ name: 'input', data: e })}
            @sc-focus=${(e: CustomEvent<{ value: string }>) => this.onInputEventTrigger({ name: 'focus', data: e })}
            @keypress=${(e: KeyboardEvent) => this.onKeypress(e)}
          >
          </sc-text-input>
        </div>
        <sc-icon-button
          type="primary"
          state="default"
          size="md"
          ?disabled=${this.disabled}
          .name=${this.processing ? 'stop--line' : 'send'}
          @click=${() => {
            if (this.disabled) {
              return;
            }
            if (this.processing) {
              this.onCancel();
            } else {
              this.onSend();
            }
          }}
        >
        </sc-icon-button>
      </div>
    `;
  }
}
