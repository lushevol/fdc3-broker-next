import { html } from 'lit';
import { property } from 'lit/decorators.js';
import '../../../../elements/sc-icon.js';
import '../../../../elements/sc-dropdown-input.js';
import '../../../../elements/sc-tooltip.js';
import ScElement from '../../../shared/sc-element.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import ScTheme from '../../../styles/ScTheme.js';
import ScTableHeaderWithSortStyle from './ScTableHeaderWithSort.style.js';
import { classMap } from 'lit/directives/class-map.js';

export enum TDirection {
  none = '',
  asc = 'asc',
  desc = 'desc',
}

type TOption = {
  label: string;
  prefixIcon: string;
  value: TDirection;
};

export class ScTableHeaderWithSort extends ScElement {
  @property({ type: String }) direction: TDirection = TDirection.none;

  static styles = ScTheme.getStyles().concat([ScTableHeaderWithSortStyle]);

  static get scopedElements() {
    return {
      'sl-dropdown': SlDropdown,
      'sl-menu': SlMenu,
      'sl-menu-item': SlMenuItem,
    };
  }

  private options: Array<TOption> = [
    {
      label: 'Sort Ascending',
      prefixIcon: 'arrow-upward',
      value: TDirection.asc,
    },
    {
      label: 'Sort Descending',
      prefixIcon: 'arrow-downward',
      value: TDirection.desc,
    },
  ];

  render() {
    return html`
      <div class="sc-table-header-with-sort">
        <div class="header-slot">
          <slot></slot>
        </div>
        <sl-dropdown 
          placement="bottom" 
          class="dropdown"
          @sl-hide=${this.stopDefaultEvent}
          @sl-show=${this.stopDefaultEvent}
        >
          <sc-icon slot="trigger" name="more-horizontal"></sc-icon>
          <sl-menu class="dropdown-menu">
            <div>
              ${this.options.map(option => {
    const { label, value, prefixIcon } = option;
    return html`
                  <sl-menu-item
                    @click=${() => this.onSelect(value)}
                    class=${classMap({
    'dropdown-item': true,
    'dropdown-item-active': value === this.direction,
  })}
                  >
                    <div class="item-wrapper">
                      <sc-icon size="xs" name=${prefixIcon}></sc-icon>
                      <span class="item-text">${label}</span>
                    </div>
                  </sl-menu-item>
                `;
  })}
            </div>
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }
  onSelect(value: TDirection) {
    this.direction = value;
    this.emit('sc-direction-changed', {
      detail: { value: this.direction },
    });
  }
}
