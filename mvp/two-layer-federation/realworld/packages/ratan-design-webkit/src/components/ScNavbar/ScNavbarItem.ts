import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScNavbarItemStyle from './ScNavbarItem.style.js';
import '../../../elements/sc-badge.js';
import '../../../elements/sc-icon.js';

export class ScNavbarItem extends ScElement {

  static styles = ScTheme.getStyles().concat([ScNavbarItemStyle]);

    @property({ type: String })
      name: string;

    @property({ type: String })
      label: string;

    @property({ type: String })
      icon: string;

    @property({ type: String })
      badge?: boolean | string;

    @property({ type: String, attribute: 'active-icon' })
      activeIcon?: string;

    @property({ type: Boolean })
      active = false;

    @property({ type: Boolean })
      hidden = false;

    private handleSelectItem(name: string) {
      this.emit('sc-select', {
        detail: {
          name,
        },
        composed: true,
        bubbles: true,
      });
    }

    render() {  

      let numberBadge = null;
      if (this.badge !== undefined) {
        if (typeof(this.badge) === 'string') {
          numberBadge = parseInt(this.badge);
          if (isNaN(numberBadge)) {
            numberBadge = null;
          }
        }
      }

      return html`
            <div class=${classMap({ 'navbar-item': true, active: this.active, hidden: this.hidden })} 
                @click=${() => {
    if (this.active) return;
    this.handleSelectItem(this.name);
  }}
            >
                ${this.badge !== undefined ? html`<sc-badge color="red" .number=${numberBadge}></sc-badge>` : ''}
                <div class="nav-icon">
                    <sc-icon name=${this.active ? this.activeIcon || this.icon : this.icon} size="lg">
                    </sc-icon>
                </div>
                <div class="nav-label">
                    ${this.label}
                </div>
            </div>
        `;
    }

}