import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
// @ts-ignore
import { Icons } from '@scdevkit/icons/libraries/MainIconLibrary.js';
import ScElement from '../../utils/sc-element.js';

export class IconSelector extends ScElement {

  @property({ type: String }) value: string;

  @property({ type: String }) label = '';

  @state() open = false;

  handleIconItemSelect(e: any) {
    const iconItem = e.detail?.item;
    if (!iconItem) return;

    this.emit('value-changed', {
      detail: {
        value: iconItem.value,
      },
    });
  }

  render() {
    const AllIcons = Object.keys(Icons);
    return html`
      <sl-dropdown
        style="width: 100%"
        hoist
        @sl-hide=${this.stopDefaultEvent}
        @sl-show=${this.stopDefaultEvent}
      >
        <div slot="trigger">
          <sc-text-input
            label=${this.label}
            value=${this.value}
            @sc-focus=${() => this.open = true}
            @sc-input=${(e: CustomEvent) => this.emit('value-changed', { detail: { value: e.detail.value } })}
          >
            <sc-icon slot="suffix" name="arrow-ios-downward" @click=${() => this.open = true}></sc-icon>
          </sc-text-input>
        </div>
        ${this.open ? html`
          <sl-menu @sl-select=${this.handleIconItemSelect} style="margin-top: 0.187rem;">
            ${repeat(new Array(Math.ceil(AllIcons.length / 5)), (item: any, index: number) => html`
              <div style="display: flex; --sl-spacing-2x-small: 0">
                ${repeat(AllIcons.slice(index * 5, index * 5 + 5), (icon: string) => html`
                  <sl-menu-item
                    style=${this.value === icon ? 'background: var(--sc-color-blue-900)' : ''}
                    value=${icon}
                    data-id=${icon}
                    class="dropdown-item"
                  >
                    <sc-icon name=${icon}></sc-icon>
                  </sl-menu-item>
                `)}
              </div>
            `)}
          </sl-menu>
        ` : nothing}
      </sl-dropdown>
    `;
  }
}

if (!window.customElements.get('sc-icon-selector')) {
  window.customElements.define('sc-icon-selector', IconSelector);
}