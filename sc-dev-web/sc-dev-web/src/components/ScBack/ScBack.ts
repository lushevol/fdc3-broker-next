import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-link.js';
import ScTheme from '../../styles/ScTheme.js';

export class ScBack extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  @property({ type: String }) mode:
    | 'history'
    | 'href' = 'href';

  @property({ type: String }) to = '#';

  @property({ type: String }) label = 'Back';

  @property({ type: Boolean, reflect: true }) disabled = false;

  static styles = ScTheme.getStyles();

  renderStyle() {
    const baseStyle = html`
      <style>
        .sc-back {
          display: flex;
          align-items: center;
        }
        .sc-back sc-icon {
          margin-top: 0.5px;
          margin-right: 4px;
        }
      </style>
    `;

    return html` ${baseStyle} `;
  }

  render() {
    const content = this.mode === 'history' 
      ? html `
          <sc-link class='sc-back' 
            title=${this.label} 
            ?disabled=${this.disabled}
            @click=${() => { window.history.back(); }}
          >
            <sc-icon name='arrow-ios-backward' size='sm'></sc-icon>
            ${this.label}
          </sc-link>
        `
      : html `
          <sc-link 
            class='sc-back' 
            href=${this.to} 
            title=${this.label} 
            ?disabled=${this.disabled}
          >
            <sc-icon name='arrow-ios-backward' size='sm'></sc-icon>
            ${this.label}
          </sc-link>
        `;
    
    return html `
      ${this.renderStyle()}
      ${content}
    `;
  }
}
