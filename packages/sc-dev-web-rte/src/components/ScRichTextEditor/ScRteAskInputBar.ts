import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScRteElement from '../../shared/sc-rte-element.js';
export class ScRteAskInputBar extends ScRteElement {
  @property({ type: Number }) rows = 1;
  @property({ type: String }) defaultValue = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) typingOrLoading = false;

  static styles = css`
    .sc-rte-ask-ai-input-bar {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
    }
    .sc-rte-ask-ai-input-bar-item {
      position: relative;
      width: calc(100% - 3.75rem);
    }
    .sc-rte-ask-ai-input-bar-more {
      position: absolute;
      right: 1rem;
      top: 0.65rem;
      z-index: 2;
      background-color: var(--sc-form-control-background-color, var(--sc-color-white));
      cursor: pointer;
      color: var(--sc-button-link-text-color, var(--sc-color-blue-500));
    }
    .sc-rte-ask-ai-input-bar-more-icon:hover {
      color: var(--sc-button-link-hover-text-color, var(--sc-color-blue-400));
    }
  `;

  renderActions() {
    const wrapStyle = 'display: flex;margin: 4px 0;';
    const textStyle = 'padding-left: .5rem;';
    return html`<sc-dropdown-input hoist 
    class="sc-rte-ask-ai-input-bar-more"
    style=${this.disabled ? '--sc-form-control-background-color: var(--sc-form-disabled-input-background-color, var(--sc-color-grey-50));' : '' }
    ?disabled=${this.disabled}
    >
      <div slot="trigger">
        <sc-icon class="sc-rte-ask-ai-input-bar-more-icon" name="more-horizontal" size="md"></sc-icon>
      </div>
      <sc-dropdown-option value="image">
        <div style=${wrapStyle}>
          <sc-icon name="image--line" size="xs"></sc-icon>
          <span style=${textStyle}>Image</span>
        </div>
      </sc-dropdown-option>
      <sc-dropdown-option value="file">
        <div style=${wrapStyle}>
          <sc-icon name="paper-clip" size="xs"></sc-icon>
          <span style=${textStyle}>Attach file</span>
        </div>
      </sc-dropdown-option>
    </sc-dropdown-input>`;
  }
  

  @state() multiline = true;
  @state() innerRows: number = this.rows;

  connectedCallback(): void {
    super.connectedCallback();
    // Reset to multiple rows when no value in text-input
    this.multiline = true;
    setTimeout(() => {
      let inputDom: HTMLTextAreaElement | undefined | null = this.shadowRoot!.querySelector('.sc-rte-ask-ai-input-bar-input')?.shadowRoot?.querySelector('textarea');
      inputDom?.focus();
      inputDom?.dispatchEvent(new InputEvent('input'));
      this.innerRows = this.rows;
      inputDom = null;
    }, 100);
  }

  disconnectedCallback(): void {
    // Reset to 1 row when no value in text-input
    super.disconnectedCallback();
    this.multiline = false;
    this.innerRows = 1;
  }

  private _currentValue = '';
  onSendOrStop() {
    if (this.typingOrLoading) {
      this.dispatchEvent(new CustomEvent('sc-rte-ask-stop'));
    }
    else {
      this.onSend();
    }
  }

  onSend() {
    this.dispatchEvent(new CustomEvent('sc-rte-ask-send', { detail: { value: this._currentValue } }));
  }

  onKeypress(event: any) {
    if (!event.shiftKey && event.charCode === 13) {
      this.onSend();
    }
  }

  onInputEventTrigger(current: {name: 'blur' | 'input' | 'focus' | 'clear', data: CustomEvent}) {
    if (current.name === 'clear') {
      this.innerRows = 1;
    } else if (current.name === 'input' && this.innerRows !== this.rows) {
      this.innerRows = this.rows;
    }
    const val = current.data.detail.value;
    this._currentValue = val;
    this.emit(`sc-${current.name}`, { detail: { value: val } });
  }

  render() {
    return html`
    <div class="sc-rte-ask-ai-input-bar">
        <div class="sc-rte-ask-ai-input-bar-item">
            <sc-text-input class="sc-rte-ask-ai-input-bar-input" 
              ?disabled=${this.disabled}
              resizable="auto" suffix-icon="plus" 
              ?clearable=${true} 
              ?multiline=${this.multiline} 
              rows=${this.innerRows} 
              size="lg" 
              placeholder="Enter text here…" 
              value=${this.defaultValue} 
              @sc-blur=${(e: CustomEvent) => this.onInputEventTrigger({ name: 'blur', data: e })}  
              @sc-clear=${(e: CustomEvent) => this.onInputEventTrigger({ name: 'clear', data: e })} 
              @sc-input=${(e: CustomEvent) => this.onInputEventTrigger({ name: 'input', data: e })} 
              @sc-focus=${(e: CustomEvent) => this.onInputEventTrigger({ name: 'focus', data: e })}
              @keypress=${(e: any) => this.onKeypress(e)}
            >
            </sc-text-input>
            ${this.renderActions()}
        </div>
        <sc-icon-button type="primary" state="default" size="md" .name=${this.typingOrLoading ? 'stop--line' : 'send'} @click=${() => this.onSendOrStop()}>
        </sc-icon-button>
    </div>
    `;
  }
}
