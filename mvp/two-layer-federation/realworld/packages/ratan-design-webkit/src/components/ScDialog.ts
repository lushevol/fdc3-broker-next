import { html } from 'lit';
import { property } from 'lit/decorators.js';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.component.js';
import ScTheme from '../styles/ScTheme.js';
import ScElement from '../shared/sc-element.js';

export class ScDialog extends ScElement {
  constructor() {
    super();
  }

  @property({ type: String }) label = '';

  @property({ type: Boolean }) open = false;

  static styles = ScTheme.getStyles();

  static get scopedElements() {
    return {
      'sl-dialog': SlDialog,
    };
  }

  renderDialogStyle() {
    const dialogStyle = html`
      <style>
        sl-dialog::part(close-button) {
          display: none;
        }
      </style>
    `;

    return html` ${dialogStyle} `;
  }

  render() {
    return html`
      ${this.renderDialogStyle()}
      <sl-dialog
        .label=${this.label}
        .open=${this.open}
        class="sc-dialog"
        @sl-request-close=${() => {
          this.open = false;
          this.emit('sc-hide', {
            detail: {
              open: false,
            },
          });
        }}
        @sl-show=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-show', {
            detail: {
              open: true,
            },
          });
        }}
        @sl-hide=${(event: CustomEvent) => {
          this.stopDefaultEvent(event);
          this.emit('sc-hide', {
            detail: {
              open: false,
            },
          });
        }}
      >
        <slot></slot>
        <slot name="label"></slot>
        <slot name="header-actions" slot="header-actions"></slot>
        <slot name="footer"></slot>
      </sl-dialog>
    `;
  }
}
