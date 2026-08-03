import { TemplateResult, html, nothing, render } from 'lit';
import { html as sHtml, unsafeStatic } from 'lit/static-html.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property, query, queryAll, queryAssignedElements, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { guard } from 'lit/directives/guard.js';
import ScTheme from '../../styles/ScTheme.js';
import ScDropdownInputStyle from './ScDropdownInput.style.js';
import DropdownBase from './DropdownBase.js';
import '../../../elements/sc-text-input.js';
import '../../../elements/sc-search-field.js';
import '../../../elements/sc-side-sheet.js';
import '../../../elements/sc-scrollbar.js';
import '../../../elements/sc-bottom-sheet.js';
import { ScTextInput } from '../ScFormInput/ScTextInput.js';
import { ScSearchField } from '../ScSearchField/ScSearchField.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import { HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { Virtualizer } from '../../controllers/virtualizer/virtualizer.js';
import { ArrowShortcutMixin } from './arrow-shortcut-mixin.js';
import { Enum } from '../../shared/enum.js';
import { ToolMixin } from '../../mixins/tool-mixin.js';
import { COMPACT_SIZE, FLOAT, TEXT_SIZE } from '../../shared/util.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';
import { mediaQuery } from '../../shared/mediaQuery.js';

/**
 * @summary Dropdown input displays suggestions as you type.
 *
 * @dependency sl-dropdown
 * @dependency sl-menu
 *
 * @slot empty-text - The text or content that is displayed when there is no suggestion based on the input.
 *
 * @csspart empty-text - The empty text's wrapper.
 *
 */


type TVirtualLabel = TemplateResult | Element | string

export type TData = {
  label: TVirtualLabel | (() => TVirtualLabel);
  value: string;
  children?: TData[];
  displayValue?: string;
  disabled?: boolean;
  hideOption?: boolean;
};
// from high level to low level, both p and pp
export type TDropdown = TData & { path: string, parentPath?: string; frozen?: boolean, checked?: boolean }

const escapeRegExp = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');


export const E_CLASS = Enum(['has-children', 'expanded-menu-item'] as const);
export const E_TRIGGER_FOR_BASEON = Enum(['watch'] as const);
export enum E_OPERTION {
  'add',
  'substract'
}

export class ScDropdownInput extends ToolMixin(ArrowShortcutMixin(DropdownBase)) {
  static styles = ScTheme.getStyles().concat([ScDropdownInputStyle]);

  @query('sc-text-input') input: ScTextInput;
  @query('sl-menu') menu: SlMenu;
  @query('.scroll-element') scrollElement: HTMLElement;
  @query('sl-dropdown') dropdown: SlDropdown;
  @query('.sc-side-sheet-content') sideSheet!: HTMLElement;
  @queryAll('sl-menu-item') items: SlMenuItem[];
  @query('sc-bottom-sheet sc-search-field') searchField: ScSearchField;

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property() float: `${FLOAT}` = FLOAT.left;

  @property({ type: Boolean }) loading = false;

  @property({ type: Boolean }) clearable = false;

  @property({ type: Boolean, attribute: 'display-raw-value' }) displayRawValue = false;

  @property({ type: Array }) data: TData[];

  @property({ type: Object, attribute: false })
  dataLookup: (value: string) => Promise<TData[]>;

  @property({ type: Boolean }) hoist = false;

  @state() el2data: TData[];

  @state() activePath = new Set<string | undefined>();
  @state() activeOptionsSizeOfParentPath = new Map<string, number>();

  @property({ type: String, reflect: true, attribute: 'loading-text' }) loadingText = 'Loading...';

  @property({ type: String, reflect: true, attribute: 'retry-button' }) retryButton = '';

  @property({ type: String, reflect: true, attribute: 'empty-text' }) emptyText = 'No data found';

  @property({ type: Number, reflect: true }) threshold = 3;

  @property({ type: String }) value: string;
  @state() searchValue: string;

  @state() inputValue = '';
  @state() previousSelectedVal: string;

  @property({ type: Boolean, attribute: 'only-filter-by-value' }) onlyFilterByValue = false;

  @property({ type: String, attribute: 'border-type' }) borderType: 'line' | 'box' = 'box';

  @property({ type: String, attribute: 'dropdown-header' }) dropdownHeader: '';

  @property({ type: String, attribute: 'prefix-icon' }) prefixIcon = '';

  @property({ type: String }) arrowIcon = 'arrow-ios-downward';

  @property({ type: String, reflect: true, attribute: 'advanced-search-text' }) advancedSearchText = '';

  @property({ type: String, attribute: 'advanced-search-icon' }) advancedSearchIcon = 'search';

  @property({ type: Boolean, attribute: false }) tabbed = false;

  @property({ type: Boolean, attribute: 'hide-tick-mark' }) hideTickMark = false;

  @property({ attribute: 'label-size' }) labelSize: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @property({ attribute: 'icon-size' }) iconSize?: `${COMPACT_SIZE}`;

  @property({ type: String, attribute: 'text-align' }) textAlign: 'left' | 'right' = 'left';

  protected virtualizer: Virtualizer | null;
  // latest dropdown options
  @state() immutableDropdownOptions: Set<TDropdown> = new Set();

  // store all history dropdown options
  @state() allImmutableDropdownOptions: Set<TDropdown> = new Set();

  @state() _open = false;

  // all dropdown option but with path
  protected readonly immutableDropdownOptionsBaseOnPath = new Map<string, TDropdown>();

  // children length sum of each parent
  protected readonly immutableChildrenSumBaseParentPath = new Map<string, number>();

  // rendered dropdown options
  @state() dropdownOptionsWithIndex: Map<number, TDropdown> = new Map();

  initializeVirtualizerState = true;

  hasMultipleLevels = false;

  onDropdownShow() {
    this.arrowIcon = 'arrow-ios-upward';
    this.emit('sc-show', {
      detail: {
        open: true,
      },
    });
  }

  onDropdownHide() {
    this.arrowIcon = 'arrow-ios-downward';
    this.emit('sc-hide', {
      detail: {
        open: false,
      },
    });
  }

  get isHierarchical() {
    return !!this.data?.find(data => data.children?.length);
  }

  get needInitialHeight() {
    const hasTriggerSlot = this.hasSlotController.test('trigger');
    return this.isVirtual && !hasTriggerSlot && !this.isMobile && this.initializeVirtualizerState && this.immutableDropdownOptions.size;
  }

  constructor() {
    super();
    this.clickCb = this.clickCb.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  updated() {
    const menu = this.menu;
    if (!menu) return;

    const visibilityObserver = new IntersectionObserver(entries => {
      const menuVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0);
      if (menuVisible) {
        this.initializeVirtualizerState = false;
      }
      visibilityObserver.disconnect();
    }, {
      threshold: [0, 0.01],
    });

    visibilityObserver.observe(menu);
  }

  @mediaQuery(['mobileSm', 'mobileLg', 'tablet', 'desktop'], { waitAfterUpdate: true })
  async deviceChanged() {
    if (!this.isVirtual) return;
    this.virtualizer = null;
    await this.updateComplete;
    this.initializeVirtualizer();
  }

  updateIndexDropdownOptions(immutableDropdownOptions: Set<TDropdown>) {
    this.dropdownOptionsWithIndex.clear();
    this.dropdownOptionsWithIndex = new Map();

    let index = 0;
    immutableDropdownOptions.forEach(imOption => {
      if (imOption.parentPath) {
        if (this.activePath.has(imOption.parentPath)) {
          this.dropdownOptionsWithIndex.set(index, imOption);
          ++index;
        }
      } else {
        this.dropdownOptionsWithIndex.set(index, imOption);
        ++index;
      }
    });
  }

  @watch(['value', 'immutableDropdownOptions'])
  handleInputFieldVal() {
    Promise.resolve(this.hasUpdated || this.updateComplete).then(() => {
      // reset all options
      this.immutableDropdownOptions.forEach(option => (option.checked = false));
      // check hierarchy upward
      let option = [...this.immutableDropdownOptions].find(
        i => i.value === this.value
      );
      while (option) {
        option.checked = true;
        if (!option?.parentPath) break;
        option = this.immutableDropdownOptionsBaseOnPath.get(
          option.parentPath
        );
      }

      this.items?.forEach(item => {
        item.classList.toggle(
          'selected',
          this.immutableDropdownOptionsBaseOnPath.get(item.dataset.path ?? '')
            ?.checked
        );
      });
    });

    if (this.value === '' || this.value === null || this.value === undefined) {
      this.inputValue = '';
      return;
    }

    for (const option of this.immutableDropdownOptions) {
      if (`${option.value}` === this.value) {
        this.inputValue = this.getFinalizeVal(option, this.value) ?? '';
        break;
      }
      // adding value that doesn't exist
      else {
        this.inputValue = this.value;
      }
    }
  }

  @watch(['data', 'el2data'])
  onDataChange(_: any, latestData: any) {
    this.updateImmutableDropdownOptions(latestData);
    this.updateIndexDropdownOptions(this.immutableDropdownOptions);
    this.requestUpdate(); 
    this.updateComplete.then(async () => {
      if (this.isMobile && !this._open) return;
      this.initializeVirtualizer();
      if (this.virtualizer) {
        this.virtualizer.size = this.dropdownOptionsWithIndex.size;
        this.virtualizer.update();
      }
    });
  }


  @watch(['readonly'], { waitUntilFirstUpdate: true })
   handleReadonlyChange() {
    if (!this.readonly) {
      this.virtualizer = null;
      this.initializeVirtualizer();
    }
  }

  @watch('searchValue')
  handleBlur() {
    if (!this.searchValue || this.isMobile) return;
    if (this.getCurrentItem() && this.dropdown?.open) return;
    if (this.searchValue && this.dropdown?.open && !this.tabbed) return;
    this.searchValue = '';
    this.tabbed = false;
    this.resetInput();
  }
  
  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      this.tabbed = true;
      this.handleBlur();
    }
  }

  resetInput() {
    if (!this.input) return;
    if (this.input.value === this.inputValue) return;
    this.input.value = this.inputValue;
    this.emit('sc-input', {
      detail: {
        value: this.input.value,
      },
    });
  }

  get isVirtual() {
    return this.data && this.data.length > 0;
  }

  getPlacement(): string {
    switch (this.float) {
      case 'center':
        return 'bottom';
      case 'left':
        return 'bottom-start';
      case 'right':
        return 'bottom-end';
      default:
        return 'bottom-start';
    }
  }

  isClickOutside(els: HTMLElement[]) {
    let result = true;
    for (const el of els) {
      if (el.tagName === this.tagName) {
        result = false;
        break;
      }
    }
    return result;
  }

  clickCb(e: Event) {
    if (e.target === this) return;
    if (this.isClickOutside(e.composedPath() as HTMLElement[])) {
      this.handleBlur();
    }
  }
  interObserver: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();
    this.interObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          this.updateStyle();
        }
      });
    });
    this.interObserver?.observe?.(this);
    this.updateStyle();
    window.addEventListener('click', this.clickCb);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this.clickCb);
    this.interObserver?.disconnect?.();
  }

  get hasLabel() {
    return !!(
      this.label ||
      this.hasSlotController.test('label') ||
      this.hasTooltip ||
      this.hasHint
    );
  }

  get hasTooltip() {
    return this.tooltip || this.hasSlotController.test('label-tooltip');
  }

  get hasHint() {
    return this.hint || this.hasSlotController.test('label-hint');
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip',
    'label-hint',
    'prefix'
  );

  removeSelectedWhenClear() {
    this.inputValue = '';
    this.value = '';
    this.searchValue = '';
    this.emit('sc-select', {
      detail: {
        value: this.value,
        displayValue: this.value,
      },
    });
  }

  triggerLookup(value: string) {
    if (this.dataLookup && typeof this.dataLookup === 'function') {
      new Promise((resolve, reject) => {
        this.dataLookup(value)
          .then((options: TData[]) => {
            this.data = options;
            resolve(options);
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }
  handleFocus(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-focus', {
      detail: {
        value,
      },
    });
  }
  handleInputBlur(event: CustomEvent) {
    const { value } = event.detail;
    this.emit('sc-blur', {
      detail: {
        value,
      },
    });
  }
  handleTextInput(event: CustomEvent) {
    const { value } = event.detail;
    if (value === '' || value.length >= this.threshold) {
      this.searchValue = value;
    }
    if (value === '') {
      this.removeSelectedWhenClear();
    }
    this.emit('sc-input', {
      detail: {
        value,
      },
    });
  }

  isParent(data: TDropdown) {
    return (data.children?.length ?? 0) > 0;
  }

  @watch('searchValue')
  handleSearchValueChange() {
    this.triggerLookup(this.searchValue);
    if (!this.searchValue) {
      this.updateIndexDropdownOptions(this.immutableDropdownOptions);
      this.updateVirtualizer();
      return;
    }
    this.show();
    this.loading = true;
    this.show();
    // when control manually, it will empty dropdownOptionsWithIndex
    // but since it reset the slot, so dropdownOptionsWithIndex will get latest input
    const res = this.getDropdownBaseon(this.searchValue, E_TRIGGER_FOR_BASEON.watch);
    this.updateIndexDropdownOptions(res);
    this.updateVirtualizer();
    this.loading = false;
  }

  updateVirtualizer() {
    if (this.virtualizer) {
      this.virtualizer.flush();
      this.virtualizer.size = this.dropdownOptionsWithIndex.size;
      this.virtualizer.update();
    }
    this.updateStyle();
  }

  renderPhysical() {
    return html`
      <sl-menu-item
        style="width: 100%;"
        class="dropdown-item"
      >
        <div class="prefix-of-sl-menu-item" slot="prefix">
          <sc-icon class="expand-children-icon" name="chevron-right" size=${this.size}></sc-icon>
        </div>
        <sc-icon slot="suffix" name="tick" class="tick-mark"></sc-icon>
      </sl-menu-item>
    `;
  }

  @watch('open', { waitUntilFirstUpdate: true })
  openOrCloseDropdown() {
    if (this.open) {
      this.dropdown.show();
      return;
    }
    if (this.open === false) {
      this.dropdown.hide();
    }
  }

  private createPhysicalEl(options?: { index?: number, disabled?: boolean }): HTMLElement {
    const fragment = document.createDocumentFragment();
    render(this.renderPhysical(), fragment);
    return fragment.querySelector('sl-menu-item') as HTMLElement;
  }

  updateElement(menuItem: HTMLElement, index: number) {
    const data = this.dropdownOptionsWithIndex.get(index);
    if (data) {
      menuItem.setAttribute('value', data.value);
      if (data?.disabled) {
        menuItem.setAttribute('disabled', `${data.disabled}`);
      } else {
        menuItem.removeAttribute('disabled');
      }
      menuItem.classList.toggle('selected', data.checked);

      this.updateChildrenPart(data, menuItem);

      const rawLabel = typeof data.label === 'function' ? data.label() : data.label;
      if (typeof rawLabel === 'string') {
        const highlightedLabel = this.highlightMatch(rawLabel, this.searchValue);
        render(highlightedLabel, menuItem);
      } else if (
        rawLabel &&
        typeof rawLabel === 'object' &&
        '_$litType$' in rawLabel &&
        Array.isArray(rawLabel.strings) &&
        rawLabel.values && rawLabel.values.length === 0
      ) {
        const labelText: string = rawLabel.strings[0];
        const highlightedLabel = this.highlightMatch(labelText, this.searchValue);
        render(highlightedLabel, menuItem);
      } else {
        render(rawLabel, menuItem);
      }
    }
  }

  private highlightMatch(text: string, search: string): TemplateResult {
    if (!search) {
      return html`${unsafeHTML(`${text}`)}`;
    }
    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);
    if (matchIndex === -1) {
      return html`${unsafeHTML(`${text}`)}`;
    } else {
      const beforeMatch = text.substring(0, matchIndex);
      const matchText = text.substring(matchIndex, matchIndex + search.length);
      const afterMatch = text.substring(matchIndex + search.length);
      return html`
        ${unsafeHTML(`${beforeMatch}<b>${matchText}</b>${afterMatch}`)}
      `;
    }
  }

  initializeVirtualizer() {
    if (!this.isVirtual) {
      this.virtualizer = null;
      return;
    }
    if (!this.virtualizer && this.menu && this.menu.querySelector('.scroll-element') && this.menu.querySelector('.scrollable-content')) {
      this.virtualizer = new Virtualizer({
        createElements: (count: number) => {
          return [...Array(count)].map((item, index: number) => {
            return this.createPhysicalEl({
              index,
            });
          });
        },
        updateElement: (el: HTMLElement, index: number) => {
          this.updateElement(el, index);
        },
        scrollTarget: this.menu.querySelector('.scrollable-content')!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        scrollContainer: this.menu.querySelector('.scroll-element')!,
        reorderElements: true,
        createCallback: () => { 
          this.initializeVirtualizerState = false; 
          this.menu.style.height = 'auto'; 
          console.log('createCallback', this.menu.style.height);
        },
      });
      this.virtualizer.size = this.dropdownOptionsWithIndex.size;
    }
  }

  replaceTag(htmlStr: string) {
    return htmlStr.replace(/(<([^>]+)>)/gi, '').trim();
  }

  reCompile(data: TData) {
    let str = '';
    const label = typeof data.label === 'function' ? data.label() : data.label;
    if (label instanceof Element) {
      str = label.textContent ?? '';
    } else if (typeof label === 'string') {
      str = label;
    } else if (typeof label === 'number') {
      str = `${label}`;
    } else {
      const { strings, values } = label;
      for (let i = 0; i < strings.length; ++i) {
        str += strings[i].trim();
        if (['string', 'number'].includes(typeof values[i])) {
          str += values[i] ?? '';
        }
      }
    }
    return str;
  }

  getDropdownBaseon(value?: string, trigger?: string) {
    let filteredDropdowns = this.immutableDropdownOptions;
    if (value) {
      const reg = new RegExp(
        `(${escapeRegExp(value ?? '')})`,
        'ig'
      );
      filteredDropdowns = new Set(Array.from(this.immutableDropdownOptions).filter(data => {
        if (data.value === 'selectAllOptions') {
          return true;
        }

        let shouldDisplay = reg.test(data.value);
        if (!shouldDisplay && !this.onlyFilterByValue) {
          shouldDisplay = reg.test(this.replaceTag(this.reCompile(data)));
        }
        return shouldDisplay;
      }));
    }

    const res = new Set<TDropdown>();
    filteredDropdowns.forEach(option => {
      this.insertRelativeDropdown(option, res, trigger);
    });
    return res;
  }

  show() {
    this._open = true;
    this.dropdown?.show();
  }

  hide() {
    this._open = false;
    this.dropdown?.hide();
  }

  setDropdownStatus(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.dropdown?.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  setAdvancedSearch() {
    if (this.sideSheet) {
      this.sideSheet.setAttribute('open', 'true');
    }
  }

  reset() {
    this.value = '';
  }

  get visibleOptions() {
    return this.dropdownOptionsWithIndex;
  }

  get hasResults() {
    return this.visibleOptions.size > 0;
  }

  get shouldDisplayLoadingText() {
    return this.loading;
  }

  get shouldDisplayEmptyText() {
    return !this.shouldDisplayLoadingText && !this.hasResults && this.emptyText;
  }

  getTextContent(selectedOption: TData) {
    return this.replaceTag(this.reCompile(selectedOption));
  }

  getFinalizeVal(selectedOption: TData, value: string) {
    if (selectedOption?.displayValue) {
      //@ts-ignore
      return selectedOption?.displayValue;
    } else {
      return this.displayRawValue ? value : this.getTextContent(selectedOption);
    }
  }

  async updateSelectedValue() {
    await this.updateComplete;
    if (typeof this.value === 'undefined') {
      this.input.value = '';
      return;
    }
    for (const option of this.immutableDropdownOptions) {
      if (option.value === this.value) {
        this.input.value = this.getFinalizeVal(option, this.value) ?? '';
        this.previousSelectedVal = option.value;
        break;
      }
    }
  }

  @queryAssignedElements() assignedElsOfDefaultSlot: Element[];

  finalizeDropdownOptions(assignedEls: Element[]) {
    function fn(_assignedEls: Element[]) {
      const res: Element[] = [];
      _assignedEls.forEach(el => {
        if (el instanceof HTMLSlotElement) {
          res.push(...fn(el.assignedElements()));
        } else if (el.tagName.toLowerCase() === 'sc-dropdown-option') {
          res.push(el);
        }
      });
      return res;
    }
    return fn(assignedEls);
  }

  // determine whether there is a tag 
  containsHTMLTag(str:string) {
    return /<[^>]+>/.test(str);
  }

  onSlotChange() {
    if (this.isVirtual) return;
    const dropdownOptions = this.finalizeDropdownOptions(this.assignedElsOfDefaultSlot);

    this.el2data = dropdownOptions.filter(o => o.getAttribute('value')).map(option => {
      const htmlLabel = this.containsHTMLTag(option.innerHTML) ? (option.innerHTML as string) : (option.textContent as string);
      return {
        value: option.getAttribute('value') as string,
        label: sHtml`${unsafeStatic(htmlLabel)}`,
        displayValue: option.getAttribute('displayValue') as string,
        disabled: !!(option.getAttribute('disabled') as string),
        hideOption: option.hasAttribute('hideOption'),
      };
    });
  }

  renderNormalItems() {
    const fragment = document.createDocumentFragment();
    const fragment2 = document.createDocumentFragment();
    const rootEl = this.renderVirtualItems(false);
    render(rootEl, fragment);

    const items: HTMLElement[] = [];
    this.dropdownOptionsWithIndex.forEach((option, index) => {
      if (option.hideOption) return;
      const physicalEl = this.createPhysicalEl();
      this.updateElement(physicalEl, index);
      items.push(physicalEl);
      return physicalEl;
    });
    render(items, fragment2);
    fragment.querySelector('.scroll-element')?.appendChild(fragment2);
    return fragment;
  }

  renderVirtualItems(isVitrual = true) {
    return html`
    <div
        class=${classMap({
      'scroll-element': true,
      'virtual-list': isVitrual,
      hierarchical: this.hasMultipleLevels,
    })}
        aria-hidden=${this.shouldDisplayLoadingText || this.shouldDisplayEmptyText ? 'true' : 'false'}
        style='${styleMap({
      display: this.shouldDisplayLoadingText || this.shouldDisplayEmptyText ? 'none' : 'block',
    })}'
      >
    </div>`;
  }

  isExpandedMenuItem(el: HTMLElement) {
    return el.classList && el.classList.contains(E_CLASS.reverse['has-children']);
  }

  /**
   * add or minus 1 to a parent path
   * @param path parent path
   * @param operation add or substract
   * @returns void
   */
  updateActiveOptionsSizeOfPath(path: string, operation: E_OPERTION) {
    const maxChildrenSum = this.immutableChildrenSumBaseParentPath.get(path) ?? +this.nonExistence;
    if (maxChildrenSum === +this.nonExistence) return;

    const currentSize = this.activeOptionsSizeOfParentPath.get(path) ?? 0;
    const adjustment = operation === E_OPERTION.add ? 1 : -1;
    this.activeOptionsSizeOfParentPath.set(
      path,
      this.clamp(currentSize + adjustment, 0, maxChildrenSum)
    );
  }

  updateActivePath(path?: string) {
    if (!path) return;
    if (this.activePath.has(path)) {
      this.activePath.forEach(p => {
        if (p?.startsWith(path)) {
          this.activePath.delete(p);
        }
      });
      this.activePath.delete(path);
    } else {
      this.activePath.add(path);
    }
  }

  updateExpandedBehaviour(el: HTMLElement) {
    const path = el.dataset.path;
    if (!path) return;
    let dropdownOptions = this.immutableDropdownOptions;
    if (this.searchValue) {
      dropdownOptions = this.getDropdownBaseon(this.searchValue);
    }
    this.updateActivePath(path);
    this.updateIndexDropdownOptions(dropdownOptions);
    this.updateVirtualizer();
  }

  insertRelativeDropdown(dropdown: TDropdown, target: Set<TDropdown>, trigger?: string) {
    const fn = (dd?: TDropdown) => {
      if (dd) {
        const parentPath = dd.parentPath;
        if (parentPath) {
          fn(this.immutableDropdownOptionsBaseOnPath.get(parentPath));
        }
        if (trigger === E_TRIGGER_FOR_BASEON.watch) {
          this.activePath.add(dd.path);
        }
        target.add(dd);
      }
    };
    fn(dropdown);
  }

  async updateChildrenPart(data: TDropdown, menuItem: HTMLElement) {
    const hasChildren = data?.children?.length;
    if (!hasChildren) {
      menuItem.classList.remove(E_CLASS.reverse['has-children']);
    } else {
      menuItem.classList.add(E_CLASS.reverse['has-children']);
    }
    if (this.activePath.has(data.path)) {
      menuItem.classList.add(E_CLASS.reverse['expanded-menu-item']);
    } else {
      menuItem.classList.remove(E_CLASS.reverse['expanded-menu-item']);
    }

    menuItem.dataset.path = data.path;
    menuItem.dataset.parentPath = data.parentPath ?? this.nonExistence;
    if (this.tagName === 'SC-DROPDOWN-INPUT') {
      await this.updateComplete;
      const menuBaseItem: HTMLElement | undefined | null = menuItem?.shadowRoot?.querySelector('.menu-item');
      if (menuBaseItem) {
        menuBaseItem.style.setProperty('padding-left', `${this.getLevel(data.path)}px`, 'important');
      }
    } else {
      menuItem.style.paddingLeft = `${this.getLevel(data.path)}px`;
    }
    menuItem.style.width = '100%';
  }

  getLevel(path?: string) {
    let count = 0;
    if (path) {
      for (let i = 0, len = path.length; i < len; i++) {
        if (path[i] === '-') {
          count++;
        }
      }
    }
    return count * 24;
  }

  maxLevelOfCascader = 5;

  updateImmutableDropdownOptions(data: TData[]) {
    this.immutableDropdownOptions.clear();
    this.immutableDropdownOptions = new Set<TDropdown>();
    this.immutableChildrenSumBaseParentPath.clear();
    this.immutableDropdownOptionsBaseOnPath.clear();
    this.hasMultipleLevels = false;

    const fn = (_data: TData[], maximumLevel: number, parentData?: TDropdown) => {
      _data.forEach((d, index) => {
        const immutableDropdown: TDropdown = {
          ...d,
          parentPath: parentData?.path,
          path: parentData?.path ? `${parentData?.path}-${index}` : `${index}`,
        };
        this.allImmutableDropdownOptions.add(immutableDropdown);
  
        if (!d.hideOption) {
          if (maximumLevel <= 0) {
            delete immutableDropdown.children;
          }
          this.immutableDropdownOptions.add(immutableDropdown);
          this.immutableDropdownOptionsBaseOnPath.set(immutableDropdown.path, immutableDropdown);
          if (immutableDropdown.children?.length) {
            this.hasMultipleLevels = true;
            this.immutableChildrenSumBaseParentPath.set(immutableDropdown.path, immutableDropdown.children.length);
            fn(immutableDropdown.children, maximumLevel - 1, immutableDropdown);
          }
        } else if (immutableDropdown.children?.length) {
          // Still process children of hidden parents
          fn(immutableDropdown.children, maximumLevel - 1, immutableDropdown);
        }
      });
    };
    fn(data, this.maxLevelOfCascader - 1);
  }

  handleMenuItemSelect(event: CustomEvent<{ item: SlMenuItem }>) {
    event.stopPropagation();
    event.preventDefault();
    const menuItem = event.detail?.item;
    if (!menuItem) return;

    if (this.isExpandedMenuItem(menuItem)) {
      this.updateExpandedBehaviour(menuItem);
      return;
    }
    this.value = menuItem.value;
    this.searchValue = '';
    this.input.value = this.inputValue;
    if (this.searchField) {
      this.searchField.value = '';
    }
    this.updateVirtualizer();
    this.hide();
    let displayValue = menuItem.value;
    for (const option of this.immutableDropdownOptions) {
      if (`${option.value}` === this.value) {
        displayValue = this.getFinalizeVal(option, this.value) ?? '';
        break;
      }
    }
    this.emit('sc-select', {
      detail: {
        displayValue,
        value: menuItem.value,
      },
    });
  }

  _onKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (key === ' ') {
      e.stopPropagation();
      return key;
    }
    this.onKeydown(e);
  }

  handleClear() {
    this.emit('sc-clear');
    this.removeSelectedWhenClear();
  }

  getCurrentIconSize() {
    if (this.iconSize) {
      return this.iconSize;
    }
    let iconSize;
    switch (this.size) {
      case 'sm':
        iconSize = 'xxs';
        break;
      case 'md':
        iconSize = 'sm';
        break;
      case 'lg':
        iconSize = 'md';
        break;
      default:
        iconSize = 'sm';
        break;
    }
    return iconSize;
  }

  renderInput(hidden?: boolean) {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasPrefixSlot = this.hasSlotController.test('prefix');
    return html`
      <sc-text-input
        icon-size=${this.iconSize}
        ?clearable=${this.clearable}
        @sc-clear=${this.handleClear}
        exportparts=${`input:original-text-input,base:form-group,label:form-group-label,more-icons,
          input-area:form-group-input-area,sc-label-root`}
        label=${this.label}
        ?required=${this.required}
        ?error=${this.error}
        ?success=${this.success}
        ?readonly=${this.readonly}
        ?max-rows=${this.maxRows} 
        readonly-rows=${this.readonlyRows} 
        ?disabled=${this.disabled}
        .placeholder=${this.placeholder}
        .value=${this.inputValue}
        ?truncate=${this.truncate}
        prefix-icon=${this.prefixIcon}
        border-type=${this.borderType}
        help-text=${this.helpText}
        error-message=${this.errorMessage}
        success-message=${this.successMessage}
        tooltip=${this.tooltip}
        tooltip-placement=${this.tooltipPlacement}
        hint=${this.hint}
        hint-placement=${this.hintPlacement}
        label-size=${this.labelSize}
        ?default-slot-not-as-label=${true}
        size=${this.size}
        @click=${(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          this.show();
        }}
        text-align=${this.textAlign}
        @sc-input=${this.handleTextInput}
        @sc-focus=${this.handleFocus}
        @sc-blur=${this.handleInputBlur}
        @input=${(e: InputEvent) =>
    (this.searchValue = (e.target as HTMLInputElement).value)}
        @keydown=${this.onKeyDown}
        style='display: ${hidden ? 'none' : 'block'}'        
      >
        ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
        ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
        ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
        ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
        ${hasPrefixSlot ? html`<slot name='prefix' slot='prefix' ></slot>` : '' }
        <slot name='help' slot='help'>${this.helpText}</slot>
        <slot name='error' slot='error'>${this.errorMessage}</slot>
        <slot name='success' slot='success'>${this.successMessage}</slot>
        <sc-icon slot='suffix' name=${this.arrowIcon} size=${this.getCurrentIconSize()} @click=${this.setDropdownStatus
        }></sc-icon>
      </sc-text-input>
    `;
  }

  renderSearchField() {
    return html`
      <sc-search-field 
        placeholder=${msg('Search', { id: 'sc-search-placeholder' })}
        clearable
        size=md
        @sc-clear=${this.handleClear}
        @sc-input=${this.handleTextInput}
      ></sc-search-field>
    `;
  }

  renderMenu() {
    return html`
      <sl-menu class=${classMap({
          'init-height': this.needInitialHeight,
        })} @keyup=${this.OnMenuKeyup} @keydown=${this.onMenuKeydown} @sl-select=${this.handleMenuItemSelect}>
        <sc-scrollbar selector=".scrollable-content"></sc-scrollbar>
        <div class="scrollable-content">
          ${this.dropdownHeader && !this.loading && !this.shouldDisplayEmptyText ? html`<div 
            part='dropdown-header'
            id='dropdown-header'
            class='dropdown-header'>
            ${this.dropdownHeader}
          </div>` : ''}
          ${this.isVirtual ? this.renderVirtualItems()
        : this.shouldDisplayLoadingText || this.shouldDisplayEmptyText
          ? '' : guard([this.dropdownOptionsWithIndex], () => this.renderNormalItems())}
          <div
            part='loading-container'
            id='loading-container'
            class='loading-container'
            aria-hidden=${this.shouldDisplayLoadingText ? 'false' : 'true'}
            style='${styleMap({
            display: this.shouldDisplayLoadingText ? 'flex' : 'none',
          })}'
          >
            <div
              part='spinner-text-container'
              id='spinner-text-container'
              class='spinner-text-container'>
              <div
                part='spinner'
                id='spinner'
                class='spinner'><sc-spinner size='md'/>
              </div>
              <div 
                part='loading-text'
                id='loading-text'
                class='loading-text'
                >${this.loadingText}
              </div>
            </div>
            <div 
              part='retry-button'
              id='retry-button'
              class='retry-button'>
              ${this.retryButton}
            </div>
          </div>
          <div
            part='empty-text'
            id='empty-text'
            class='empty-text'
            aria-hidden=${this.shouldDisplayEmptyText ? 'false' : 'true'}
            style='${styleMap({
            display: this.shouldDisplayEmptyText ? 'flex' : 'none',
          })}'
          >
            <div class="empty-text-div">
              <slot name='empty-text'>${this.emptyText}</slot>
            </div>
            <div 
              part='retry-button'
              id='retry-button'
              class='retry-button'>
              ${this.retryButton}
            </div>
          </div>
        </div>
        <div
          part='advanced-search'
          id='advanced-search'
          class='advanced-search'
          aria-hidden=${this.advancedSearchText ? 'false' : 'true'}
          style='${styleMap({
            display: this.advancedSearchText ? 'flex' : 'none',
          })}'
          @click=${this.setAdvancedSearch}
        >
          <sc-icon name=${this.advancedSearchIcon} size='xs'></sc-icon>
          <div part='advanced-search-text' class='advanced-search-text'>${this.advancedSearchText}</div>
        </div>
      </sl-menu>`;
  }

  async showBottomSheet() {
    this._open = true;
    this.onDropdownShow();
    this.virtualizer = null;
    await this.updateComplete;
    this.initializeVirtualizer();
  }

  hideBottomSheet() {
    this._open = false;
    this.onDropdownHide();
  }

  renderMobile() {
    const hasTriggerSlot = this.hasSlotController.test('trigger');
    return html`
      ${this.renderInput(hasTriggerSlot)}
      <sc-bottom-sheet 
        ?open=${this._open} 
        @sc-show=${this.showBottomSheet}
        @sc-hide=${this.hideBottomSheet}
        no-close-icon 
        no-header 
        height='65vh'
        style='--sc-bottom-sheet-body-padding: 0.75rem'
      >
        <div class=mobile>
          ${this.renderMenu()}  
          ${this.renderSearchField()}      
        </div>
      </sc-bottom-sheet>
      ${hasTriggerSlot ? html`<slot name='trigger' @click=${this.showBottomSheet}></slot>` : ''}
    `;
  }

  render() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasPrefixSlot = this.hasSlotController.test('prefix');
    return html`
      <style>
        sl-dropdown > sl-menu.init-height {
          height: ${this.immutableDropdownOptions.size * 33 + 28}px!important;
        }
      </style>
      <div 
        @slotchange=${this.onSlotChange} 
        class=${classMap({
          'sc-dropdown-input': true,
          [this.size]: true,
          'no-label': !this.hasLabel,
          [this.borderType]: true,
          'error-message': this.errorMessage,
          'success-message': this.successMessage,
          'help-text': this.helpText,
          'sc-truncate': this.truncate,
          'hide-tick-mark': this.hideTickMark,
        })}
      >
      ${this.readonly ? html`
        <sc-text-input
          icon-size=${this.iconSize}
          label=${this.label}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.error}
          .success=${this.success}
          .readonly=${this.readonly}
          ?max-rows=${this.maxRows} 
          readonly-rows=${this.readonlyRows} 
          .placeholder=${this.placeholder}
          .value=${this.inputValue || this.value}
          ?truncate=${this.truncate}
          prefix-icon=${this.prefixIcon}
          border-type=${this.borderType}
          help-text=${this.helpText}
          error-message=${this.errorMessage}
          success-message=${this.successMessage}
          tooltip=${this.tooltip}
          tooltip-placement=${this.tooltipPlacement}
          hint=${this.hint}
          hint-placement=${this.hintPlacement}
          label-size=${this.labelSize}
          size=${this.size}
          text-align=${this.textAlign}
          ?default-slot-not-as-label=${true}
        >
          ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
          ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
          ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
          ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
          ${hasPrefixSlot ? html`<slot name='prefix' slot='prefix' ></slot>` : '' }
          <slot name='help' slot='help'>${this.helpText}</slot>
          <slot name='error' slot='error'>${this.errorMessage}</slot>
          <slot name='success' slot='success'>${this.successMessage}</slot>
        </sc-text-input>
      ` : this.isMobile ? html`
          ${this.renderMobile()}
          <slot style='display: none'></slot>
      ` : html`
        <sl-dropdown
          distance="5"
          class='sc-dropdown-input ${this.size}' 
          exportparts="trigger:sl-trigger"
          style='width: 100%;'
          ?hoist=${this.hoist}
          placement=${this.getPlacement()}
          .disabled=${this.disabled}
          @sl-show=${async(event: CustomEvent) => {
            this.emit('sc-show');
            this.stopDefaultEvent(event);
            await this.updateComplete;
            this.initializeVirtualizer();
            this.updateStyle();
            this.onDropdownShow();
          }}
          @sl-hide=${(event: CustomEvent) => {
            this.emit('sc-hide');
          this.stopDefaultEvent(event);
          this.onDropdownHide();
        }}
        >
        <slot slot="trigger" name="trigger" @keydown=${this._onKeydown}>
          <div>
            ${this.renderInput()}
          </div>
        </slot>
        ${this.renderMenu()}
          <sc-side-sheet class="sc-side-sheet-content" label=${this.advancedSearchText}>
            <slot name='side-sheet-content'></slot>
          </sc-side-sheet>
        </sl-dropdown>
        `}
        <slot style='display: none'></slot>
      </div>
    `;
  }
}
