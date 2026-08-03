import { html } from 'lit';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import type SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import { FormBase } from '../common/FormBase.js';
import { property, state } from 'lit/decorators.js';
import type { ScTextInput } from '../ScFormInput/ScTextInput.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

export default class DropdownBase extends FormBase {
  
  @property({ type: String }) placeholder = 'Please select';

  @property({ type: Boolean }) open = false;

  @state() componentWidth = 0;

  @state() shouldRenderMenu = false;

  @mediaQuery(['mobileSm', 'mobileLg', 'tablet', 'desktop'], { waitAfterUpdate: true })
  renderOnMobile() {
      this.requestUpdate();
  }

  static get scopedElements() {
    return {
      'sl-menu': SlMenu,
      'sl-menu-item': SlMenuItem,
      'sl-dropdown': SlDropdown,
    };
  }

  get originalOptions() {
    const originalOptions = this.querySelectorAll('sc-dropdown-option');
    return Array.from(originalOptions) as any[];
  }

  get options() {
    const originalOptions = this.querySelectorAll('sc-dropdown-option');
    const slots = (
      originalOptions.length ? 
        originalOptions : 
        this.shadowRoot?.querySelector('sl-dropdown')
          ?.querySelector('sl-menu')?.querySelectorAll('sl-menu-item sc-dropdown-option')
    ) as any;
    return Array.from(slots || []) as any[];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.updateStyle.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateStyle.bind(this));
    super.disconnectedCallback();
  }

  updateStyle() {
    if (this.isMobile) return;
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sl-dropdown'),
      customElements.whenDefined('sl-menu'),
      customElements.whenDefined('sc-text-input'),
      customElements.whenDefined('sl-popup'),
    ]);

    this.updateComplete.then(() => {
      whenAllDefined.then(() => {
        setTimeout(async () => {
          const menu = this.shadowRoot?.querySelector<SlMenu>('sl-menu');
          const inputWrapper = this.shadowRoot?.querySelector<ScTextInput>('sc-text-input');
          
          !menu?.isUpdatePending || await menu?.updateComplete;
          !inputWrapper?.isUpdatePending || await inputWrapper?.updateComplete;

          const input = inputWrapper?.shadowRoot?.querySelector('.sc-form-group');
          const inputMainContext = inputWrapper?.shadowRoot?.querySelector('.sc-form-group-main-context');
          if (menu && input && inputMainContext) {
            menu.style.setProperty('margin-top', `${inputMainContext.clientHeight - input.clientHeight + 3}px`);
            menu.style.setProperty('overflow-y', 'auto');
            menu.style.setProperty('overflow-x', 'hidden');
            if (input.clientWidth) {
              menu.style.setProperty('width', `${input.clientWidth}px`);
            }
          }

          const dropdown = this.shadowRoot?.querySelector<SlDropdown>('sl-dropdown');
          !dropdown?.isUpdatePending || await dropdown?.updateComplete;
          const popup = dropdown?.shadowRoot?.querySelector<SlPopup>('sl-popup');
          !popup?.isUpdatePending || await popup?.updateComplete;
          const panel = popup?.querySelector<HTMLElement>('.dropdown__panel');
          if (panel) {
            panel.style.fontFamily = 'inherit';
          }
          this.componentWidth = this.getBoundingClientRect().width;
        }, 0);
      });
    });
  }

  renderDefaultSlot() {
    return html`<slot style='display: none' @slotchange=${this.requestUpdate}></slot>`;
  }
}
