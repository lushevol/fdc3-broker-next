import { PropertyValueMap, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-text-input.js';
import '../../../elements/sc-spinner.js';
import { ScTextInput } from '../ScFormInput/ScTextInput.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScTableFilterStyle from './ScTableFilter.style.js';
import { watch } from '../../shared/watch.js';
import { Virtualizer } from '../../controllers/virtualizer/virtualizer.js';
import { ScCheckbox } from '../../../elements/sc-checkbox.js';
import { Debouncer } from '../../controllers/virtualizer/debounce.js';
import { timeOut } from '../../controllers/virtualizer/async.js';
import { closest } from '../../shared/util.js';

const BASE_CLASS = 'sc-table-filter';

const SCROLLBAR_WIDTH = 18;
const SHADOW_WIDTH = 4;

export type TOption = {
  label: string;
  value: string;
};

export type TLookup = (keyword?: string) => Promise<TOption[]> | TOption[];

const ALL = Symbol('sc-table-filter-select-all').toString();

export class ScTableFilter extends ScElement {
  static styles = ScTheme.getStyles().concat([ScTableFilterStyle]);

  @query('sl-menu') menu: SlMenu;
  @property({ type: Array }) options: Array<TOption> = [];
  @property({ attribute: false }) lookup: undefined | TLookup;
  @property({ type: Boolean }) compact = false;
  
  @state() filteredOptions: Array<TOption> = [];
  /**
   * data which used throughout this component
   */
  @state() data: TOption[] = [];
  @state() values = new Set<string>();
  @state() loading = false;
  @state() dropdownState = false;
  @state() isSearching = false;
  
  
  protected virtualizer: Virtualizer;

  connectedCallback(): void {
    super.connectedCallback();
  }
  protected willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('lookup')) {
      this.updateDataByLookup();
      this.values = new Set();
      this.updateInputText();
    } else if (changedProperties.has('options')) {
      this.updateDataByOptions();
      this.values = new Set();
      this.updateInputText();
    }
  }


  @watch(['dropdownState', 'filteredOptions'])
  onDropdownStateChange () {
    this.updateComplete.then(() => {
      this.updateVirtualizer();
    });
  }
  updateVirtualizer() {
    if (this.dropdownState) {
      if (this.virtualizer) {
        this.virtualizer.flush();
        const options = this.finalizeOpt();
        this.virtualizer.size = options.length;
        this.virtualizer.update();
      }
    }
  }

  @watch('data')
  onDataChange() {
    this.filteredOptions = [...this.data];
  }
  updateDataByOptions() {
    this.data = this.options;
  }
  async updateDataByLookup() {
    this.data = await this.invokeLookup();
  }
  invokeLookup(keyword?: string) {
    return new Promise<TOption[]>(resolve => {
      if (this.lookup) {
        const res = this.lookup(keyword);
        if (res instanceof Promise) {
          this.loading = true;
          res.then(r => {
            resolve(r);
            this.loading = false;
          });
        } else {
          resolve(res);
        }
      } else {
        resolve([]);
      }
    });
    
  }

  static get scopedElements() {
    return {
      'sl-dropdown': SlDropdown,
      'sl-menu': SlMenu,
      'sl-menu-item': SlMenuItem,
    };
  }

  @query('.trigger') triggerEl: HTMLElement;
  @query('sl-menu') slMenuEl: SlMenu;
  @query('sl-dropdown') slDropdownEl: SlDropdown;
  @query('sc-text-input') scInput: ScTextInput;

  async onDropdownShow(event: CustomEvent) {
    this.scInput.value = '';
    this.setPopupWidth();
    this.dropdownState = true;
    this.stopDefaultEvent(event);
    if (this.lookup) {
      this.filteredOptions = await this.invokeLookup();
    }
  }

  
  createPhysicalEl() {
    const div = document.createElement('div');
    div.style.setProperty('width', '100%');
    const checked = document.createElement('sc-checkbox');
    div.appendChild(checked);
    return div;
  }

  updateElement(element: HTMLElement, index: number) {
    const checkbox = element.querySelector('sc-checkbox');
    if (checkbox) {
      const options = this.finalizeOpt();
      const data = options[index];
      if (data) {
        checkbox.value = data.value;
        checkbox.textContent = data.label;
        checkbox.checked = this.values.has(data.value);
      }
    }
  }
  onScrollClick(e: any) {
    this.onItemClick(e, (<ScCheckbox>e.target)?.value);
  }

  protected firstUpdated(): void {
    this.virtualizer = new Virtualizer({
      createElements: (count: number) => {
        return [...Array(count)].map(() => {
          return this.createPhysicalEl();
        });
      },
      updateElement: (el: HTMLElement, index: number) => {
        this.updateElement(el as ScCheckbox, index);
      },
      scrollTarget: this.menu,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scrollContainer: this.menu.querySelector('.scroll-element')!,
      reorderElements: true,
    });
  }

  updateInputText() {
    const extraOne = this.values.has(ALL) ? 1 : 0;
    if (this.scInput) {
      this.scInput.value = this.values.size ? `${this.values.size - extraOne} selected` : '';
    }
  }
  onDropdownHide(event: CustomEvent) {
    this.updateInputText();
    this.filteredOptions = [...this.data];
    this.isSearching = false;
    this.scInput.blur();
    this.dropdownState = false;
    this.stopDefaultEvent(event);
  }

  setPopupWidth() {
    if (this.triggerEl?.clientWidth) {
      const scTable = closest(this.triggerEl, e => {
        return e.tagName === 'SC-TABLE' && e?.scrollWidth > e?.clientWidth;
      });
      
      let width = this.triggerEl.clientWidth;

      // to fix header filter's popup alignment issue 
      if (scTable && this.triggerEl) {
        const rect = this.triggerEl.getBoundingClientRect();
        const rectLeft = rect.left;
        const rectRight = rect.right;

        const tableStyle = window.getComputedStyle(<Element>scTable);
        const tableRect = scTable.getBoundingClientRect();
        const tableLeft = tableRect.left;
        const tableRight = tableRect.right;
        const tableBorderRight = parseFloat(tableStyle.borderRightWidth);
        const tableBorderLeft = parseFloat(tableStyle.borderLeftWidth);

        const tableScrollY = scTable.scrollHeight > scTable.clientHeight;
        const leftStickyColumn = scTable.shadowRoot?.querySelector('.sticky-left');
        const rightStickyColumn = scTable.shadowRoot?.querySelector('.sticky-right');

        let gap = 0;

        // reset popup position shift
        this.slDropdownEl.skidding = 0;

        // reduce popup width to avoid displaying outside of table
        if (rectLeft < tableLeft) {
          gap = tableLeft - rectLeft + tableBorderLeft;
          if (leftStickyColumn) {
            gap = gap + SHADOW_WIDTH;
          }
          // add skidding to make sure popup right side algin with the input trigger
          this.slDropdownEl.skidding = gap;
        }
  
        if (rectRight > tableRight) {
          gap = rectRight - tableRight + tableBorderRight;
          if (rightStickyColumn) {
            gap = gap + SHADOW_WIDTH;
          }
          // if table has a horizontal scroll bar
          if (tableScrollY) {
            width = width - SCROLLBAR_WIDTH;
          }
        }
        width = width - gap;
      }

      this.slMenuEl.setAttribute(
        'style',
        `width: ${width}px`
      );
    }
  }

  finalizeOpt() {
    if (!this.filteredOptions.length) {
      return [];
    }
    if (this.isSearching) {
      return [...this.filteredOptions];
    }
    return [{ label: '(Select All)', value: ALL }, ...this.filteredOptions];
  }
  
  inputDebouncer: Debouncer;
  onInputDebouncer(event: CustomEvent) {
    this.inputDebouncer = Debouncer.debounce(
      this.inputDebouncer,
      timeOut.after(200),
      this.onInput.bind(this, event)
    );
  }

  async onInput(event: CustomEvent) {
    const keyword = event.detail.value;
    if (keyword) {
      if (this.lookup) {
        this.filteredOptions = await this.invokeLookup(keyword);
      } else {
        this.filteredOptions = this.data.filter(opt =>
          opt.label.includes(keyword)
        );
      }
      this.isSearching = true;
    } else {
      this.isSearching = false;
      this.filteredOptions = [...this.data];
    }
  }
  onItemClick(e: Event, selectValue: TOption['value']) {
    e.preventDefault();
    e.stopPropagation();
    if (selectValue === ALL) {
      if (this.values.has(ALL)) {
        this.values = new Set();
      } else {
        this.values = new Set(this.filteredOptions.map(_ => _.value));
      }
    } else if (this.values.has(selectValue)) {
      this.values.delete(selectValue);
      this.values = new Set([...this.values]);
    } else {
      this.values = new Set([...this.values, selectValue]);
    }
    let len = this.values.size;
    if (this.values.has(ALL)) --len;
    if (len === this.filteredOptions.length) {
      this.values = new Set([...this.values, ALL]);
    } else {
      this.values.delete(ALL);
      this.values = new Set([...this.values]);
    }
    this.updateVirtualizer();
    this.emit('sc-filter', {
      detail: { value: [...this.values].filter(_ => _ !== ALL) },
    });
  }

  renderEmptyOptions() {
    return html` <div class="empty-options">No data found</div> `;
  }
  renderLoading() {
    return html`
      <div
        part="loading-text"
        id="loading-text"
        class="loading-text"
        aria-hidden=${this.loading ? 'false' : 'true'}
        style="${styleMap({
    display: this.loading ? 'block' : 'none',
  })}"
      >
        <sc-spinner size="md" ></sc-spinner>
      </div>
    `;
  }

  onKeydown (e: KeyboardEvent) {
    if (e.code === 'Space') {
      e.stopPropagation();
    }
  }

  render() {
    const options = this.finalizeOpt();
    return html`
      <div
       class=${classMap({ [BASE_CLASS]: true })}
       @sl-hide=${(e: Event) => e.stopPropagation()}
       >
        <sl-dropdown
          hoist
          class="dropdown"
          @sl-show=${this.onDropdownShow}
          @sl-hide=${this.onDropdownHide}
        >
        
          <div class=${classMap({ trigger: true, compact: this.compact })} @keydown=${this.onKeydown} slot="trigger">
            <sc-text-input
              @sc-input=${this.onInputDebouncer}
              suffix-icon="arrow-ios-downward"
              placeholder=""
              border-type="box"
            >
            </sc-text-input>
          </div>
          <sl-menu class="dropdown-menu">
            <div class="scroll-element" @click=${this.onScrollClick} style=${styleMap({
  display: this.loading || !options.length ? 'none' : 'block',
})}></div>
            ${this.loading ? this.renderLoading() : nothing}
            ${!options.length && !this.loading ? this.renderEmptyOptions() : nothing}
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }
}
