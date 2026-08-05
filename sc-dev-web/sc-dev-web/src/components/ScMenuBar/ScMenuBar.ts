import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { map } from 'lit/directives/map.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import { watch } from '../../shared/watch.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-menu.js';
import '../../../elements/sc-side-sheet.js';
import { MenuBarItemData } from './MenuBarItemData.js';
import { MenuItemData } from '../ScMenu/MenuItemData.js';
import ScMenuBarStyle from './ScMenuBar.style.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

export class ScMenuBar extends ScElement {

  static styles = ScTheme.getStyles().concat([ScMenuBarStyle]);

  static get scopedElements() {
    return {
      'sl-dropdown': SlDropdown,
    };
  }


  @property({ type: Array }) data: MenuBarItemData[] = [];

  @property({ type: Number, attribute: 'menu-distance' }) menuDistance = 10;

  @property({ type: Number, attribute: 'max-row' }) maxRow = 0;

  @property({ type: String }) title = '';

  @property({ type: Boolean, attribute: 'search' }) search = false;

  @property({ type: Boolean, attribute: 'notification' }) notification = false;

  @property({ type: Boolean, attribute: 'prevent-default-link' }) preventDefaultLink = false;

  @state()
    activeDropdownIndex = -1;

  @mediaQuery(['mobileSm', 'mobileLg', 'tablet', 'desktop'], { waitAfterUpdate: true })
  renderOnMobile() {
    this.valueUpdate();
    this.requestUpdate();
  }

  @state() _open = false;

  @state()
  private _data: any[] = [];

  handleMenuShow(event: Event, activeMenuIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    const menuTriggers = this.shadowRoot?.querySelectorAll('.menu-trigger') as any;
    Array.from(menuTriggers).forEach((el: any, index) => {
      if (index === activeMenuIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  handleMenuHide(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const menuTriggers = this.shadowRoot?.querySelectorAll('.menu-trigger') as any;
    Array.from(menuTriggers).forEach((el: any) => {
      el.classList.remove('active');
    });
  }

  @watch('data')
  valueUpdate() {
    this._data = this.data.map((barItem: MenuBarItemData) => {
      if (barItem.menuItems && barItem.menuItems.length) {
        const categoryMap = barItem.menuItems.reduce((acc: any, menuItem: MenuItemData) => {
          const category = menuItem.category || 'empty';
          if (category in acc) {
            acc[category].push(menuItem);
          } else {
            acc[category] = [menuItem];
          }
          return acc;
        }, {});
        const cols: any = [];
        const categories = Object.keys(categoryMap);
        categories.forEach(category => {
          const items = categoryMap[category];
          if (this.maxRow) {
            for (let i = 0; i < items.length; i += this.maxRow) {
              cols.push([...(categories.length > 1 ? [(i === 0 ? {
                category,
                elementType: 'label',
              } : { elementType: 'empty' })] : []), ...(items.slice(i, i + this.maxRow))]);
            }
          } else {
            cols.push([...(categories.length > 1 ? [{
              category,
              elementType: 'label',
            }] : []), ...items]);
          }
        });
        const rowCount = cols.reduce((acc: any, col: any) => {
          return Math.max(acc, col.length);
        }, 0);
        const rows: any[][] = Array.from({ length: rowCount }, (_, i) =>
          cols.map((col: any) => i < col.length ? col[i] : { elementType: 'empty' })
        );
        return {
          ...barItem,
          cols,
          rows,
          categories,
          selected: barItem.menuItems.some((menuItem: any) => menuItem.selected),
        };
      } else {
        return { ...barItem };
      }
    });
    requestAnimationFrame(() => {
      this.setBottomLineStyle();
    });
  }

  setBottomLineStyle() {
    const bottomLine: any = this.shadowRoot?.querySelector('.bottom-line');
    const container = this.shadowRoot?.querySelector('.sc-menu-bar');
    const selectedMenu = this.shadowRoot?.querySelector('.menu-trigger.selected');

    if (bottomLine && !selectedMenu) {
      bottomLine.style.width = '';
      bottomLine.style.left = '';
      bottomLine.style.bottom = '';
      return;
    }

    if (bottomLine && container && selectedMenu) {
      const containerRect = container.getBoundingClientRect();
      const menuRect = selectedMenu.getBoundingClientRect();
      if (containerRect.left && menuRect.left) {
        bottomLine.style.width = `${menuRect.width + (Math.floor(menuRect.right) === Math.floor(containerRect.right) ? 12 : 0)}px`;
        bottomLine.style.left = `${menuRect.left - containerRect.left - 2}px`;
        const bottom = Math.abs(parseInt(getComputedStyle(bottomLine).getPropertyValue('bottom')));
        // recalculate bottom based on menu height if used in header
        if (bottom > 2) {
          bottomLine.style.bottom = `calc((${containerRect.height}px - 3.25rem - 1px) / 2)`;
        }
      }
    }
  }

  private hideAllDropdowns() {
    const dropdowns = Array.from(this.renderRoot.querySelectorAll<SlDropdown>('sl-dropdown') ?? []);
    dropdowns.forEach(d => d?.hide());
  }

  handleMenuClick(event: Event, data: any, type = 'menu') {
    event.preventDefault();
    event.stopPropagation();
    this._open = false;
    this.hideAllDropdowns();
    this.requestUpdate();
    this.emit('sc-action', {
      detail: {
        target: event.target,
        data,
        type: type || 'menu',
      },
    });
    if (data.href && !this.preventDefaultLink) {
      window.open(data.href, data.target || '_self');
    }
  }

  onScMenuItemClick(event: Event, data: any) {
    event.preventDefault();
    event.stopPropagation();
    this._open = false;
    this.hideAllDropdowns();
    this.emit('sc-action', {
      detail: {
        target: event.target,
        data,
      },
    });
  }

  toggleSideSheet() {
    this._open = !this._open;
  }

  renderMobileDisplay() {
    return html`
      <div class='sc-menu-bar'>
        <sc-side-sheet 
          position=right 
          width=${`calc(${document.body.clientWidth  }px - var(--sc-left-offset, 0px))`}
          no-footer
          no-close-icon
          ?open=${this._open}
          @sc-show=${() => this._open = true}
          @sc-hide=${() => this._open = false}
        >
          ${this._data.map(menu => {
            return html`
              <div class=category-container>
                ${
                  menu.menuItems && menu.menuItems.length ? html`
                    <sc-title level=5>${menu.title}</sc-title>
                    ${
                      map(menu.cols,
                        (col: MenuItemData[], index: number) => col[0].category ? html`
                          <sc-accordion summary=${menu.categories[index]} icon-position=left>
                            <div class=accordion-list>
                              ${
                                map(col, item => item.elementType === 'label' ? nothing : this.renderMenuItem(item))
                              }
                            </div>
                          </sc-accordion>
                        ` : map(col, item => item.elementType === 'label' ? nothing : this.renderMenuItem(item))
                      )
                    }
                  ` : this.renderLink(menu, true)
                }
              </div>
            `; 
          })}
          <div slot=label>${this.title}</div>
        </sc-side-sheet>
        <sc-icon name=${this._open ? 'cross' : 'menu'} @click=${this.toggleSideSheet}></sc-icon>
        ${this._data?.length && (this.search || this.notification) ? html`
          <sc-divider size='sm' line-height='sm' compact></sc-divider>
        ` : null}
        ${this.search ? html`
          <div class='icon-wrapper'>
            <sc-link href='' @sc-action=${(event: Event) => this.handleMenuClick(event, {}, 'search')}>
              <sc-icon name='search'></sc-icon>
            </sc-link>
          </div>
        ` : null}
        ${this.notification ? html`
          <div class='icon-wrapper'>
            <sc-link href='' @sc-action=${(event: Event) => this.handleMenuClick(event, {}, 'notification')}>
              <sc-icon name='bell--line'></sc-icon>
            </sc-link>
          </div>
        ` : null}
      </div>
    `;
  }

  renderMenuItem(col: MenuItemData) {
    return html`
      <sc-menu-item 
        ?prevent-default-link=${this.preventDefaultLink}
        @sc-action=${(event: Event) => this.onScMenuItemClick(event, col)}
        type='normal'
        ?disabled=${col.disabled}
        ?checked=${col.checked}
        ?selected=${col.selected}
        value=${col.value}
        href=${col.href}
        target=${col.target}
        style=${styleMap({ 
          '--sc-menu-item-hover-background-color': 'var(--sc-menu-background-color, var(--sc-color-white))',
          'margin-left': this.isMobile || this.isTablet ? '-0.875rem' : 0,
        })}
      >
        ${col.title}
        ${col.description ? html`
          <div class='description-slot' slot='description'>${col.description}</div>
        ` : null}
        ${col.prefixIcon ? html`
          <span slot='prefix' class='prefix'>
            <sc-icon name=${col.prefixIcon} size=${col.description ? 'lg' : 'sm'}></sc-icon>
          </span>
        ` : null}
        ${col.suffixIcon ? html`
          <span slot='suffix' class='suffix'>
            <sc-icon name=${col.suffixIcon} size=${col.description ? 'lg' : 'sm'}></sc-icon>
          </span>` : null}
      </sc-menu-item>
    `;
  }

  renderLink(menu: MenuBarItemData, mobileMode?: boolean) {
    return html`
      <span class='menu-trigger ${menu.selected ? 'selected' : ''}'>
        <sc-link
          ?prevent-default-link=${this.preventDefaultLink}
          ?disabled=${menu.disabled}
          target=${menu.target || '_self'}
          href=${menu.href}
          @sc-action=${(event: Event) => this.handleMenuClick(event, menu)}
          style="${menu.selected ? '' : '--sc-link-content-color: none'}"
        >
          ${mobileMode ? html`<sc-title level=5>${menu.title}</sc-title>` : menu.title}
        </sc-link>
      </span>
    `;
  }

  render() {
    if (this.isMobile || this.isTablet) return this.renderMobileDisplay();
    return html`
      <div class='sc-menu-bar'>
        <div class='bottom-line ${this._data.some(menu => menu.selected) ? 'selected' : ''}'></div>
        ${this._data.map((menu, menuIndex) => menu.menuItems && menu.menuItems.length ? html`
          <sl-dropdown 
            placement='bottom' 
            distance=${this.menuDistance}
            @sl-after-show=${(event: Event) => this.handleMenuShow(event, menuIndex)}
            @sl-after-hide=${this.handleMenuHide}
          >
            <span slot="trigger" class='menu-trigger ${menu.selected ? 'selected' : ''}'>
              ${menu.title}
              <sc-icon name='arrow-ios-downward'></sc-icon>
            </span>
            <sc-menu 
              width=${menu.width || 'auto'}
              style='--menu-left-position: ${menu.leftPosition}; height: 0; display: block'
            >
              <div class='menu-child'>
              ${
                map(menu.rows,
                  (row: any, rowIndex: number) => html`
                    <sc-grid-row no-gutters class=${menu.categories.length > 1 ? 'show-label' : ''}>
                      ${
                        row.map((col: any, i: number) => html`
                          <sc-grid-column class=${
                            col.elementType === 'label' ? 'label-cell' : 
                            col.elementType === 'empty' ? 
                            'empty-cell' : ''
                            } xs='12' 
                            sm='${Math.floor(12 / row.length) + (i < 12 - Math.floor(12 / row.length) * row.length ? 1 : 0) }'>
                              ${menu.categories.length > 1 && col.elementType === 'label' ? html`
                              <sc-menu-label>
                                <div class='label-content ${rowIndex === 0 ? '' : 'center'}'>
                                  ${col.category || 'No category'}
                                </div>
                              </sc-menu-label>
                            ` : col.elementType === 'empty' ? html`
                              <div></div>
                            ` : !col.elementType ? this.renderMenuItem(col) : null
                          }
                          </sc-grid-column>
                        `)
                      }
                    </sc-grid-row>
                  `
                )
              }
              </div>
            </sc-menu>
          </sl-dropdown>
        ` : this.renderLink(menu))}
        ${this._data?.length && (this.search || this.notification) ? html`
          <sc-divider size='sm' line-height='sm' compact></sc-divider>
        ` : null}
        ${this.search ? html`
          <div class='icon-wrapper'>
            <sc-link href='' @sc-action=${(event: Event) => this.handleMenuClick(event, {}, 'search')}>
              <sc-icon name='search'></sc-icon>
            </sc-link>
          </div>
        ` : null}
        ${this.notification ? html`
          <div class='icon-wrapper'>
            <sc-link href='' @sc-action=${(event: Event) => this.handleMenuClick(event, {}, 'notification')}>
              <sc-icon name='bell--line'></sc-icon>
            </sc-link>
          </div>
        ` : null}
      </div>
    `;
  }
}