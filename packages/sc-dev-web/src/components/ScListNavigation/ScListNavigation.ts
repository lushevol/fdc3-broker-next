import { TemplateResult, html, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { watch } from '../../shared/watch.js';
import { ScListNavigationItem } from './ScListNavigationItem.js';
import type { ScSearchField } from '../ScSearchField/ScSearchField.js';
import { SIZE, SizeMapping } from '../../shared/util.js';
import { ListNavigationStyle } from './ScListNavigation.style.js';

type NAVIGATION_ITEM_TYPE = {
  key: string;
  title: string;
  titleLine?: number;
  body?: any;
  bodyLine?: number;
  prefix?: string;
  suffix?: string | (() => TemplateResult);
  selected?: boolean;
  disabled?: boolean;
  open?: boolean;
  'no-border'?: boolean;
  children?: NAVIGATION_ITEM_TYPE[];
}

export const findParents: any = (tree: any, target: string, parents: any = []) => {
  if (tree.key === target) {
    return parents;
  }
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const result = findParents(child, target, [...parents, tree]);
      if (result.length > 0) {
        return result;
      }
    }
  }
  // If no parents are found, return an empty array
  return [];
};
export class ScListNavigation extends ScElement {
  static styles = ScTheme.getStyles().concat(ListNavigationStyle);

  @queryAssignedElements({ selector: 'sc-list-navigation-item' })
  public _items: Array<ScListNavigationItem>;

  @query('sc-search-field') searchField: ScSearchField;

  @property({ attribute: 'space-size' }) spaceSize: `${SIZE}` = SIZE.none;

  @property({ type: Boolean, attribute: 'show-right-arrow' }) showRightArrow = false;

  @property({ type: Number, attribute: 'title-line' }) titleLine = 0;

  @property({ type: Number, attribute: 'body-line' }) bodyLine = 0;

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property() radius: `${SIZE}` = SIZE.xxs;

  @property({ type: Boolean }) compact = true;

  @property({ type: Boolean }) box = false;

  @property({ type: Boolean }) searchable = false;

  @property({ type: Array }) items: NAVIGATION_ITEM_TYPE[];

  @state() _openKeys: string[] = [];

  @state() _selectedKeys: string[] = [];

  @watch('items')
  itemsChange() {
    this.updateStateByItems(this.items);
  }

  updateStateByItems(items: NAVIGATION_ITEM_TYPE[]) {
    items.forEach((item: NAVIGATION_ITEM_TYPE) => {
      if (item.open && item.children) {
        this._openKeys.push(item.key);
      }

      if (item.selected && !item.children) {
        this._selectedKeys = [item.key];
      }

      if (this.getSelectedStatus(item)) {
        if (!this._openKeys.find(k => k === item.key) && item.children) {
          this._openKeys.push(item.key);
        }
      }

      if (item.children) {
        this.updateStateByItems(item.children);
      }
    });
  }

  @watch('box', { waitUntilFirstUpdate: true })
  boxChange(): void {
    this._itemsChanged();
  }

  private _itemsChanged(): void {
    const itemCount = this._items.length - 1;
    this._items.forEach((item: ScListNavigationItem, index: number) => {
      // @ts-ignore
      item.addEventListener('sc-action', (event: CustomEvent) => {
        !event.detail.disabled && this.emit('sc-select', {
          detail: {
            selectedKeys: [event.detail.key],
          },
        });
      });
      item.borderTop = !this.box;
      item.titleLine = item.titleLine || this.titleLine;
      item.bodyLine = item.bodyLine || this.bodyLine;
      item.borderBottom = this.box
        ? index === itemCount
          ? false
          : true
        : false;
    });
  }

  getSelectedStatus(item: NAVIGATION_ITEM_TYPE): boolean {
    if (item.selected) {
      return true;
    } else {
      if (item.children) {
        return !!item.children.find(c => this.getSelectedStatus(c));
      }
      return false;
    }
  }

  clearAllChildKeys(items: NAVIGATION_ITEM_TYPE[]) {
    items.forEach(item => {
      const index = this._openKeys.findIndex(k => k === item.key);
      if (index > -1) {
        this._openKeys.splice(index, 1);
      }
      if (item.children) {
        this.clearAllChildKeys(item.children);
      }
    });
  }

  onItemClick(item: NAVIGATION_ITEM_TYPE) {
    if (item.disabled) {
      return;
    }
    const index = this._openKeys.findIndex(k => k === item.key);
    if (item.children) {
      if (index > -1) {
        this._openKeys.splice(index, 1);
        this.clearAllChildKeys(item.children);
      } else {
        this._openKeys.push(item.key);
      }
      this.requestUpdate();
      return;
    } else {
      this._selectedKeys = [];
      this._selectedKeys.push(item.key);
    }
    this.emit('sc-select', {
      detail: {
        selectedKeys: this._selectedKeys,
        openKeys: this._openKeys,
      },
    });
    this.requestUpdate();
  }

  isSingleCategory() {
    let res = true;
    this.items.some(item => {
      if (item.children && item.children.length > 0) {
        res = false;
        return true;
      }
    });
    return res;
  }

  renderItems(items: NAVIGATION_ITEM_TYPE[], parent?: NAVIGATION_ITEM_TYPE): any {
    if (!items) return nothing;
    // @ts-ignore
    const parentOpened = !!this._openKeys.find(k => k === parent?.key);
    return html`
      <div
        class=${classMap({
      'item-container': true,
      child: !!parent?.key,
      show: !parent?.key || parentOpened,
    })}
      >
      ${repeat(
      items,
      item => item.key,
      (item, index) => {
        const borderTop = !this.box;
        const borderBottom = this.box
          ? index === items.length - 1 && !item.children
            ? false
            : true
          : false;

        const selected = this._selectedKeys.find(k => k === item.key);
        const opened = !!this._openKeys.find(k => k === item.key);
        const arrowIcon =
          opened ? 'arrow-ios-downward' : 'arrow-ios-forward';
        const disabled = item.disabled ?? parent?.disabled;
        const itemWithParentDisabled = { ...item, disabled };
        const containsChildern = this.items.some(item => item.children);
        
        return html`
            <sc-list-navigation-item
              class=${classMap({
                'last-item': !!(parent?.key && index === items.length - 1),
                'first-item': !!(parent?.key && index === 0),
                'parent-item': !!(item.children),
                'child-item': containsChildern ? !item?.children : false,
              })}
              .selected=${selected}
              .key=${item.key} 
              .title=${item.title}
              .titleLine=${item.titleLine || this.titleLine}
              .body=${item.body}
              .bodyLine=${item.bodyLine || this.bodyLine}
              ?disabled=${disabled}
              ?no-border=${this.noBorder}
              ?compact=${this.compact}
              .borderTop=${borderTop}
              .borderBottom=${borderBottom}
              ?no-suffix=${!this.showRightArrow && !item.suffix}
              .suffix=${this.showRightArrow && !item.suffix ? 'arrow-ios-forward' : item.suffix}
              @sc-action=${() => this.onItemClick(itemWithParentDisabled)}
            >
              ${item.children ? this.renderItems(item.children, itemWithParentDisabled) : ''}
              ${!this.isSingleCategory() ? html`<div slot=prefix class=${classMap({
                'sc-list-navigation-prefix': true, 
                'sc-list-navigation-prefix-disabled': Boolean(disabled),
              })}>
                <sc-icon 
                  name=${arrowIcon}
                  size=md
                  style='width: 20px; display: ${item.children ? 'block' : 'none'}'
                ></sc-icon>
                ${typeof item.prefix === 'string' ? html`  
                  <sc-icon 
                    name=${item.prefix || arrowIcon}
                    size=md
                    style='width: 20px'
                  ></sc-icon>
                ` : item.prefix}
              </div>` : nothing}
              ${item.suffix ? html`<div slot="suffix">
                                    ${typeof item.suffix === 'function' ? item.suffix() : item.suffix}
                                  </div>`
            : nothing}
            </sc-list-navigation-item>
          `;
      }
    )}
      </div>      
    `;
  }

  renderSearch() {
    return html`
      <sc-search-field
        show-suggestion
        threshold=1
        @sc-input=${this.onSearchInputChange}
        @sc-search=${this.onSearch}
      ></sc-search-field>
    `;
  }

  getFilterItems(
    value: string,
    filterItems?: NAVIGATION_ITEM_TYPE[],
    items?: NAVIGATION_ITEM_TYPE[],
    parentIndex?: any
  ) {
    const _filterItems: any[] = filterItems || [];
    const _items = items || this.items;
    _items.forEach((item, index) => {
      let _parentIndex: number = parentIndex;
      if (!items) _parentIndex = index;
      if (item.children) {
        this.getFilterItems(value, _filterItems, item.children, _parentIndex);
        return;
      }
      if (item.title.includes(value) || item.key.includes?.(value)) {
        _filterItems.push({
          key: item.key,
          title: item.title,
          parents: findParents(this.items[_parentIndex], item.key, []),
        });
      }

    });
    return _filterItems;
  }

  onSearchInputChange(event: CustomEvent) {
    const v = event.detail.value;
    let filterItems: any[] = [];
    filterItems = this.getFilterItems(v);
    setTimeout(() => {
      this.searchField.updateSuggestion(
        filterItems.map(l => {
          return {
            value: l.key,
            text: () => html`
              <div>
                <div
                  style='
                    color: var(--sc-list-navigation-title-color, var(--sc-color-blue-900));
                    font-weight: var(--sc-navigation-title-font-weight, 600);
                  '
                >${l.title}</div>
                <div 
                  style='font-size: 0.875rem; color:var(--sc-list-navigation-sub-title-color, var(--sc-color-grey-600));'
                >${l.parents.length === 0 ? nothing :
                html`
                      <div>
                        ${l.parents.map((p: any, index: number) => {
                  if (index === 0) return nothing;
                  return html`
                              <span>${p.title}</span>
                              ${index < l.parents.length - 1 ?
                      html`<sc-icon name=arrow-ios-forward></sc-icon>` :
                      nothing
                    }
                            `;
                })
                  }
                      </div>
                    `
              }</div>
              </div>
            `,
          };
        })
      );
    }, 0);
  }

  onSearch(event: CustomEvent) {
    const value = event.detail.value;
    this._selectedKeys = [];
    this._selectedKeys.push(value);
    let parents: any[] = [];
    this.items.forEach(item => {
      const data = findParents(item, value, []);
      if (data.length > 0) {
        parents = data;
      }
    });
    parents.forEach(p => {
      if (!this._openKeys.find(k => k === p.key) && p.children) {
        this._openKeys.push(p.key);
      }
    });
    this.searchField.value = '';
    this.emit('sc-select', {
      detail: {
        selectedKeys: this._selectedKeys,
        openKeys: this._openKeys,
      },
    });
  }

  render() {
    const padding = SizeMapping[this.spaceSize];
    const radius = SizeMapping[this.radius];
    return html`
      ${this.searchable ? this.renderSearch() : nothing}
      <div
        class='sc-list-navigation'
        style='
          padding: ${padding / 2}rem ${padding}rem;
          border-radius:${radius}rem;
          border: ${!this.noBorder && this.box
        ? '1px solid var(--sc-list-navigation-border-color, var(--sc-color-grey-250))'
        : 'none'
      };
        '
      >
          ${this.renderItems(this.items)}
          <slot @slotchange=${this._itemsChanged}></slot>
      </div>
    `;
  }
}