import { PropertyValues, TemplateResult, html, nothing, render } from 'lit';
import { html as sHtml, unsafeStatic } from 'lit/static-html.js';
import { state, property, queryAsync } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { guard } from 'lit/directives/guard.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  E_CLASS,
  E_OPERTION,
  ScDropdownInput,
  TData,
  TDropdown,
} from './ScDropdownInput.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-tag.js';
import '../../../elements/sc-side-sheet.js';
import '../../../elements/sc-checkbox.js';
import '../../../elements/sc-text-input.js';
import '../../../elements/sc-scrollbar.js';
import ScDropdownInputStyle from './ScDropdownInput.style.js';
import ScDropdownMultiSelectStyle from './ScDropdownMultiSelect.style.js';
import { ArrowShortcutMultiMixin } from './arrow-shortcut-multi-mixin.js';
import { E_KEYS } from './arrow-shortcut-mixin.js';
import { watch } from '../../shared/watch.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import { msg } from '@lit/localize';
const clearableOffset = 32;
const errorOffset = 10;
const defaultOffset = 54;
const prefixIconOffset = 28;
const truncatedItemsTextOffset = 52;

export class ScDropdownMultiSelect extends ArrowShortcutMultiMixin(
  ScDropdownInput
) {
  static styles = ScTheme.getStyles().concat([
    ScDropdownInputStyle,
    ScDropdownMultiSelectStyle,
  ]);

  @queryAsync('.option-input') $optionInput!: Promise<HTMLInputElement | null>;

  @queryAsync('sc-bottom-sheet .option-input') $mobileOptionInput!: Promise<HTMLInputElement | null>;

  @queryAsync('sl-dropdown') protected $dropdown!: Promise<SlDropdown | null>;
  // @ts-ignore
  @property({ type: Array }) value: string[];

  @property({ type: Boolean, attribute: 'multiple-rows' }) multipleRows = false;

  @property({ type: String, attribute: false }) affixTopPadding = '';

  @property({ type: Number, attribute: false }) inputWidth = 0;

  @property({ type: Number, attribute: false }) optionInputWidth = 0;

  @property({ type: Boolean, attribute: 'keep-input-on-select' }) keepInputOnSelect = false;

  @property({ type: Boolean, attribute: 'select-all' }) selectAll = false;

  @property({ type: Number, attribute: 'min-count' }) minCount?: number;

  @property({ type: Number, attribute: 'max-count' }) maxCount: number;

  @property({ type: String, attribute: 'tag-type' }) tagType = 'grey';

  @property({ type: Boolean, attribute: 'auto-create-tag' }) autoCreateTag = false;

  @state() _renderableItems: { itemsToShow: any[]; remainingItems: number } = {
    itemsToShow: [],
    remainingItems: 0,
  };
  @property({ type: Boolean, attribute: 'hide-checkbox' }) hideCheckbox = false;

  @property({ type: Boolean, attribute: 'hide-tick-mark' }) hideTickMark = false;

  @state() _hover = false;

  @state() _focus = false;

  @state() _value: any[] = [];

  @state() _forceUpdate = false;

  @state() selectedItems: string[] = [];

  @state() closeableItems: any[] = [];

  @state() private isBatchingSelectAll = false;

  @state() private isMinViolatedAttempt = false;

  @state() private _minCountError = false;

  heightChangeObserver?: ResizeObserver;

  get hasTooltip() {
    return this.tooltip || this.hasSlotController.test('label-tooltip');
  }
  get hasHint() {
    return this.hint || this.hasSlotController.test('label-hint');
  }

  get _options() {
    if (this.dataLookup && typeof this.dataLookup === 'function') {
      return this.allImmutableDropdownOptions;
    }
    return this.immutableDropdownOptions;
  }

  getAllChildrenOptions() {
    if (!this.value) {
      return [];
    }

    const valueWithChildren: Record<string, TData[]> = [
      ...this.immutableDropdownOptions,
    ].reduce(
      (res, cur) =>
        cur.children?.length ? { [cur.value]: cur.children, ...res } : res,
      {}
    );
    const relatedChildrenValus = new Set();

    const fn = (val: string) => {
      const children = valueWithChildren[val] ?? [];
      children.forEach(child => {
        relatedChildrenValus.add(child.value);
        fn(child.value);
      });
    };

    this.value.forEach(fn);
    return [...relatedChildrenValus];
  }

  private getAllChildrenOptionsFrom(values: string[]): string[] {
    const valueWithChildren: Record<string, TData[]> = [
      ...this.immutableDropdownOptions,
    ].reduce(
      (res, cur) =>
        cur.children?.length ? { [cur.value]: cur.children, ...res } : res,
      {}
    );

    const relatedChildrenValues = new Set<string>();

    const fn = (val: string) => {
      const children = valueWithChildren[val] ?? [];
      children.forEach(child => {
        relatedChildrenValues.add(child.value);
        fn(child.value);
      });
    };

    values.forEach(fn);
    return [...relatedChildrenValues];
  }

  private countsTowardMax(value: string): boolean {
    const leafOptionValues = new Set<string>();
    const allOptionValues = new Set<string>();

    this._options.forEach(option => {
      allOptionValues.add(option.value);
      if (!option.children?.length) {
        leafOptionValues.add(option.value);
      }
    });

    return leafOptionValues.has(value) || !allOptionValues.has(value);
  }

  private clampValuesByMaxCount(values: string[]): string[] {
    if (!this.maxCount || this.maxCount <= 0) {
      return values;
    }

    const normalizedMax = Math.floor(this.maxCount);
    if (!Number.isFinite(normalizedMax)) {
      return values;
    }

    let selectedCount = 0;
    const result: string[] = [];

    values.forEach(value => {
      const shouldCount = this.countsTowardMax(value);
      if (shouldCount && selectedCount >= normalizedMax) {
        return;
      }
      result.push(value);
      if (shouldCount) {
        selectedCount += 1;
      }
    });

    return result;
  }

  private normalizeExternalValues(): string[] {
    if (!this.value) {
      return [];
    }

    const incomingValues = Array.isArray(this.value)
      ? this.value.map(el => (this.isVirtual ? el : String(el)))
      : [String(this.value)];

    const dedupedIncomingValues = [...new Set(incomingValues)];
    const relatedValues = this.getAllChildrenOptionsFrom(dedupedIncomingValues);
    const mergedValues = [...new Set([...dedupedIncomingValues, ...relatedValues])];

    return this.clampValuesByMaxCount(mergedValues);
  }

  private syncMinCountErrorState() {
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined' || min === 0) {
      this._minCountError = false;
      return;
    }
    this._minCountError = this.isBelowMinCount;
  }
  
  @watch('value')
  async updateValue() {
    await this.updateComplete;

    const valuePaths = [...this.immutableDropdownOptions];
    const parentPaths = new Set<string>();
    this.activeOptionsSizeOfParentPath = new Map();
    if (this.value) {
      this._value = this.normalizeExternalValues();
      this._value.forEach(v => {
        const option = valuePaths.find(option => option.value === v);
        if (option?.parentPath) {
          this.updateActiveOptionsSizeOfPath(option.parentPath, E_OPERTION.add);
          parentPaths.add(option.parentPath);
        }
      });
    } else {
      this._value = [];
    }
    parentPaths.forEach(path => this.toggleParentIfNeed(path));

    this.previousSelectedOptions = [...this._value];
    this.syncMinCountErrorState();
    
    if (!this.isVirtual) {
      this.updateMenuItemsCheckboxState();
    }
    this.updateVirtualizer();
  }
  
  updateMenuItemsCheckboxState() {
    const menuItems = this.renderRoot?.querySelectorAll('.list-item');
    
    if (menuItems) {
      let idx = 0;
      menuItems.forEach(item => {
        const isSelectAllItem = this.selectAll && item.querySelector('#selectAllCheckbox');
        if (!isSelectAllItem) {
          this.updateElement(item as HTMLElement, idx);
          idx++;
        }
      });
    }
  }

  firstUpdated() {
    this.updatePaddingWidth();
  }

  updated() {
    if (this.dropdown?.open) {
      this.initializeVirtualizerState = false;
    }
  }

  @watch(['availableWidth', 'optionInputWidth', '_value', 'selectedItems'])
  async updateCloseableItems() {
    await this.updateComplete;
    if (this.availableWidth > 0) {
      const newItems = this.getCloseableItems();
      const itemsChanged =
        newItems.length !== this.closeableItems.length ||
        newItems.some((item, i) => item.label !== this.closeableItems[i]?.label);
      if (itemsChanged) {
        this.closeableItems = newItems;
      }
    }
  }

  @watch(['_value', '_focus'], { waitUntilFirstUpdate: true })
  updatePaddingWidth(): void {
    this.updateComplete.then(() => {
      this.updateAffixPadding();
      this.updateOptionInputWidth();
    });
    const inputElement = this.shadowRoot?.querySelector(
      '.sc-dropdown-input.multiple .input-cover'
    );
    const optionInputElement = this.shadowRoot?.querySelector(
      '.sc-dropdown-input.multiple .input-cover .option-input'
    );
    if (inputElement && optionInputElement) {
      this.heightChangeObserver = new ResizeObserver(() => {
        this.updateAffixPadding();
        this.updateOptionInputWidth();
      });
      this.heightChangeObserver.observe(inputElement);
    }
  }

  updateAffixPadding() {
    const inputElement = this.shadowRoot?.querySelector(
      '.sc-dropdown-input.multiple .input-cover'
    ) as HTMLElement;
    if (inputElement) {
      this.inputWidth = inputElement.clientWidth;
      if (inputElement.clientHeight <= 32) {
        this.affixTopPadding = '0.5rem';
      } else if (
        inputElement.clientHeight > 32 &&
        inputElement.clientHeight <= 37
      ) {
        this.affixTopPadding = '0.6rem';
      } else {
        const numRows = (inputElement.clientHeight - 37) / 29;
        this.affixTopPadding = `${0.5 + 1 * numRows}rem`;
      }
    }
  }

  private updateOptionInputWidth() {
    requestAnimationFrame(() => {
      const optionInputElement = this.shadowRoot?.querySelector(
        '.sc-dropdown-input.multiple .input-cover .option-input'
      ) as HTMLElement;
  
      if (optionInputElement) {
        this.optionInputWidth = optionInputElement.clientWidth * 0.8;
      }
    });
  }

  async updateSelectedValue() {
    await this.updateComplete;
    const parentPaths = new Set<string>();
    const immutableDropdownOptions = [...this.immutableDropdownOptions];
    this._value.forEach(v => {
      const option = immutableDropdownOptions.find(
        option => v === option.value
      );
      if (option?.parentPath) {
        this.updateActiveOptionsSizeOfPath(option.parentPath, E_OPERTION.add);
        parentPaths.add(option.parentPath);
      }
    });
    parentPaths.forEach(path => {
      this.toggleParentIfNeed(path);
    });
  }

  updateFocus(isFocus: boolean, event: CustomEvent | MouseEvent) {
    this.stopDefaultEvent(event);
    const textInput = this.shadowRoot?.querySelector('sc-text-input');
    if (textInput) {
      if (isFocus) {
        this.emit('sc-focus', {
          detail: {
            value: this._value,
          },
        });
      } else {
        this.emit('sc-blur', {
          detail: {
            value: this._value,
          },
        });
      }
      textInput._focus = isFocus;
      this._focus = isFocus;
    }
  }

  toggleParentIfNeed(_path: string) {
    this.preCheckForIndet(_path, (activedCount: number, count: number) => {
      const parent = this.immutableDropdownOptionsBaseOnPath.get(_path);
      const parentValue = parent?.value as string;
      if (activedCount === count) {
        if (!this._value.includes(parentValue)) {
          this._value = [...this._value, parentValue];
          this.updateActiveOptionsSizeOfPath(
            parent?.parentPath ?? this.nonExistence,
            E_OPERTION.add
          );
        }
      } else {
        const index = this._value?.findIndex((v: string) => v == parentValue); // eslint-disable-line
        if (index > -1) {
          this._value.splice(index, 1);
          this.updateActiveOptionsSizeOfPath(
            parent?.parentPath ?? this.nonExistence,
            E_OPERTION.substract
          );
        }
      }

      if (parent?.parentPath) {
        this.toggleParentIfNeed(parent?.parentPath);
      }
    });
  }

  get isOverflow() {
    if (!this.maxCount) return false;

    return this.getSelectedValueCount() >= this.maxCount;
  }

  private get normalizedMinCount(): number | undefined {
    const min = Number(this.minCount);
    if (!Number.isFinite(min) || min < 0) {
      return undefined;
    }
    return Math.floor(min);
  }

  private getSelectedValueCount(): number {
    const leafOptionValues = new Set<string>();
    const allOptionValues = new Set<string>();

    this._options.forEach(option => {
      allOptionValues.add(option.value);
      if (!option.children?.length) {
        leafOptionValues.add(option.value);
      }
    });

    let count = 0;
    this._value.forEach(value => {
      if (leafOptionValues.has(value) || !allOptionValues.has(value)) {
        count += 1;
      }
    });
    return count;
  }

  private canRemoveSelection(removeCount = 1): boolean {
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined') {
      return true;
    }
    return this.getSelectedValueCount() - removeCount >= min;
  }

  private canClearSelection(): boolean {
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined' || min === 0) {
      return true;
    }
    return this.getSelectedValueCount() === 0;
  }

  private get isBelowMinCount(): boolean {
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined' || min === 0) return false;
    return this.getSelectedValueCount() < min;
  }

  private get defaultMinCountMessage(): string {
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined') return '';
    return `Please select at least ${min} ${min === 1 ? 'option' : 'options'}`;
  }

  private clearMinViolationIfResolved() {
    if (!this._minCountError) return;
    const min = this.normalizedMinCount;
    if (typeof min === 'undefined' || this.getSelectedValueCount() >= min) {
      this._minCountError = false;
    }
  }

  private markMinViolationAttempt() {
    this.isMinViolatedAttempt = true;
    this._minCountError = true;
  }

  @watch(['_value', 'searchValue', 'selectedItems', 'truncate'], { waitUntilFirstUpdate: true })
  async updateSelectedClasses() {
    await this.updateComplete;
    const items = this.shadowRoot?.querySelectorAll('.list-item');

    items?.forEach(item => {
      const checkbox = item.querySelector('sc-checkbox');
      if (checkbox) {
        if (checkbox.checked) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
        checkbox.toggleAttribute('truncate', this.truncate);
      }
    });
  }

  @watch(['disabled'], { waitUntilFirstUpdate: true })
  async closePopupWhenDisabled() {
    if (this.disabled) {
      const dropdown = await this.$dropdown;
      if (dropdown) {
        dropdown.disabled = false;
        dropdown.hide();
        setTimeout(() => {
          dropdown.disabled = true;
        });
      }
    }
  }

  @watch(['readonly'], { waitUntilFirstUpdate: true })
  handleReadonlyChange() {
    if (!this.readonly) {
      this.virtualizer = null;
      this.initializeVirtualizer();
      this.updateVirtualizer();
    }
  }

  override onDataChange(_: any, latestData: any) {
    if (this.selectAll && this.isVirtual) {
      const updatedOptions = [
        { label: 'Select All', value: 'selectAllOptions' },
        ...latestData,
      ];
    this.updateImmutableDropdownOptions(updatedOptions);
    }
    else {
      this.updateImmutableDropdownOptions(latestData);
    }

    this.updateIndexDropdownOptions(this.immutableDropdownOptions);

    this.requestUpdate();

    this.updateComplete.then(async () => {
      this.initializeVirtualizer();
      if (this.virtualizer) {
        this.virtualizer.size = this.dropdownOptionsWithIndex.size;
        this.virtualizer.update();
      }
    });
  }

  override updateExpandedBehaviour(el: HTMLElement) {
    const path = el.dataset.path;
    if (!path) return;
    let dropdownOptions = this.immutableDropdownOptions;
    if (this.searchValue) {
      dropdownOptions = this.getDropdownBaseon(this.searchValue);
    }
    this.updateActivePath(path);
    this.updateIndexDropdownOptions(dropdownOptions);
    this.updateVirtualizer();
    this.updateSelectedClasses();
  }

  async handleSelect(
    event: CustomEvent,
    value: string,
    parentPath: string | typeof this.nonExistence
  ) {
    const checked = event.detail?.checked;
    let hasUpdated = false;
    if (!this.keepInputOnSelect) {
      this.searchValue = '';
      this.inputValue = '';
    }
    if (checked) {
      if (!this._value.includes(value)) {
        this._value = [...this._value, value];
        this.selectedItems.push(value);
        this.updateActiveOptionsSizeOfPath(parentPath, E_OPERTION.add);
        hasUpdated = true;
      }
    } else {
      if (!this.canRemoveSelection()) {
        this.markMinViolationAttempt();
        this.requestUpdate();
        if (this.isVirtual) {
          this.updateVirtualizer();
        } else {
          this.updateMenuItemsCheckboxState();
        }
        return;
      }
      const index = this._value?.findIndex((v: string) => v === value);
      if (index > -1) {
        hasUpdated = true;
        this._value = this._value.filter((v: string) => v !== value);
        this.selectedItems = this.selectedItems.filter(item => item !== value);
        this.updateActiveOptionsSizeOfPath(parentPath, E_OPERTION.substract);
      }
    }
    if (hasUpdated) {
      if (checked) {
        this.clearMinViolationIfResolved();
      }
      this.toggleParentIfNeed(parentPath);
      this.updateVirtualizer();
      if (!this.isBatchingSelectAll) { 
        this.emitScSelect();
      }
      this.focusInput(true);
      await this.updateComplete;

      this.updateSelectedClasses();
      this.requestUpdate();
    }
  }

  async resetInput(emit = true) {
    const optionInput = this.isMobile ? await this.$mobileOptionInput : await this.$optionInput;
    if (optionInput) {
      if (optionInput?.value === this.inputValue) return;
      optionInput.value = '';
      this.inputValue = '';
      if (emit) {
        this.emit('sc-input', {
          detail: {
            value: this.inputValue,
          },
        });
      }
    }
  }

  focusInput = async (updateStyle?: boolean, onMobile?: boolean) => {
    const optionInput = onMobile ? await this.$mobileOptionInput : await this.$optionInput;
    if (optionInput) {
      optionInput.focus();
    }
  };

  removeTag(event: CustomEvent) {
    const value = event.detail.tag;

    if (!this.canRemoveSelection()) {
      this.markMinViolationAttempt();
      this.requestUpdate();
      return;
    }

    let removedOption: TDropdown | undefined;
    for (const option of this._options) {
      if (option.value == value) { // eslint-disable-line
        removedOption = option;
        break;
      }
      else {
        removedOption = value;
        this._value = this._value.filter(v => v !== value);
        this.selectedItems = this.selectedItems.filter(
          item => item !== value
        );
        this.deletedValue = value;
      }
    }
    const checkboxes = this.shadowRoot?.querySelectorAll('sc-checkbox');
    if (checkboxes) {
      checkboxes.forEach(checkbox => {
        if ((checkbox as unknown as HTMLInputElement).value === value) {
          (checkbox as unknown as HTMLInputElement).checked = false;
        }
      });
    }

    this.handleSelectAll(true, removedOption?.path as string);
    if (this.dataLookup && typeof this.dataLookup === 'function') {
      this._value = this._value.filter(v => v !== removedOption?.value);
    } else {
      this.handleSelectAll(true, removedOption?.path as string);
    }
    this.toggleParentIfNeed(removedOption?.parentPath ?? this.nonExistence);
    this.requestUpdate();
    this.updateVirtualizer();
    this.emitScSelect();
    this.unCheckAllSelectedCheckbox();
  }
  getDeletedOptions(current: string[], previous: string[]) {
    const res: string[] = [];
    previous.forEach(option => {
      if (!current.includes(option)) {
        res.push(option);
      }
    });
    return res;
  }
  getAddedValues(current: string[], previous: string[]) {
    const res: string[] = [];
    current.forEach(item => {
      if (!previous.includes(item)) {
        res.push(item);
      }
    });
    return res;
  }

  previousSelectedOptions: string[] = [];
  deletedValue: string | null = null; 
  emitScSelect() {
    const allValues: string[] = Array.from(new Set(this._value.filter(v => v !== undefined && v !== null)));
  
    const values: string[] = [];
    const availablePreviousValues: string[] = [];
    this._options.forEach(option => {
      if (this._value.includes(option.value) && !option.children?.length) {
        values.push(option.value);
      }
      if (
        this.previousSelectedOptions.includes(option.value) &&
        !option.children?.length
      ) {
        availablePreviousValues.push(option.value);
      }
    });
  
    const deletedOptions = this.getDeletedOptions(
      allValues,
      this.previousSelectedOptions
    );
    const addedValues = this.getAddedValues(
      allValues,
      this.previousSelectedOptions
    );

    const min = this.normalizedMinCount;
    const isMinReached = typeof min !== 'undefined' && this.getSelectedValueCount() === min;
  
    this.previousSelectedOptions = [...allValues];
  
    this.emit('sc-select', {
      detail: {
        value: Array.from(new Set(values)),
        allValues,
        deletedValues: Array.from(new Set([...deletedOptions, ...(this.deletedValue ? [this.deletedValue] : [])])),
        addedValues: Array.from(new Set(addedValues)),
        ...(isMinReached ? { isMinReached: true } : {}),
      },
    });
    if (!this.keepInputOnSelect) {
      this.resetInput(false);
    }
    this.deletedValue = null;
  }

  handleTextInput(event: any) {
    const value = event.target?.value;
    this.emit('sc-input', {
      detail: {
        value,
      },
    });
    if (value === '' || value.length >= this.threshold) {
      this.searchValue = value;
    }
    this.updateOptionInputWidth();
  }

  renderPrefix() {
    return html`
      <div class="prefix-of-sl-menu-item" slot="prefix">
        <sc-icon
          class="expand-children-icon"
          name="chevron-right"
        ></sc-icon>
      </div>
    `;
  }

  isParentCheckbox(wraper: HTMLDivElement, isCheckbox: boolean) {
    if (!wraper.classList.contains(E_CLASS.reverse['has-children'])) {
      return false;
    }
    return isCheckbox;
  }

  isCheckbox(elements: HTMLElement[]) {
    return elements.some(el => {
      if (!el.classList) {
        return false;
      }
      return (
        el.classList.contains('checkbox__control') &&
        el.getAttribute('part')?.includes('control')
      );
    });
  }

  handleSelectAll(checked: boolean, path: string | number | undefined, value?: any) {
    this.searchValue = '';
    this.inputValue = '';

    const activeOptions = new Set<TDropdown>();

    this.immutableDropdownOptionsBaseOnPath.forEach((option, p) => {
      if ((path || value) && !option.disabled && !option.hideOption) {
        const pOrderArr = p?.split('-') || [];
        const isPathMatch = path === p || path === pOrderArr.slice(0, path?.toString().split('-').length).join('-');
        const isValueMatch = option.value === value;
  
        if (isPathMatch || isValueMatch) {
          activeOptions.add(option);
        }
      }
    });

    activeOptions.forEach(option => {
      if (checked && !this.canRemoveSelection()) {
        this.markMinViolationAttempt();
        return;
      }
      this.updateActiveOptionsSizeOfPath(
        option?.parentPath ?? this.nonExistence,
        checked ? E_OPERTION.substract : E_OPERTION.add
      );

      if (checked) {
        this._value = this._value.filter(v => v !== option.value);
        this.selectedItems = this.selectedItems.filter(
          item => item !== option.value
        );
      } else {
        if (!this._value.includes(option.value)) {
          this._value = [...this._value, option.value];
          this.selectedItems.push(option.value);
        }
      }
    });
  }

  unCheckAllSelectedCheckbox() {
    const checkboxes = this.shadowRoot?.querySelectorAll('sc-checkbox');

    checkboxes?.forEach(el => {
      if (el.id === 'selectAllCheckbox') {
        el.checked = false;
      }
    });
  }

  private override renderNormalItems() {
    const fragment = document.createDocumentFragment();
    const fragment2 = document.createDocumentFragment();
    const rootEl = this.renderVirtualItems(false);
    render(rootEl, fragment);

    if (this.selectAll) {
      const physicalEl = this.createSelectAllEl();
      fragment.querySelector('.scroll-element')?.appendChild(physicalEl);
    }

    const items: HTMLElement[] = [];
    this.dropdownOptionsWithIndex.forEach((option, index) => {
      if (option.hideOption) return;
      const physicalEl = this.createPhysicalEl({
        disabled: option?.disabled || option?.frozen,
        index,
      });
      this.updateElement(physicalEl, index);
      items.push(physicalEl);
      return physicalEl;
    });
    render(items, fragment2);
    fragment.querySelector('.scroll-element')?.appendChild(fragment2);
    return fragment;
  }

  handleVirtualItemsSelectAllOptions(isChecked: boolean) {
    if (isChecked) {
      const filteredOptions = Array.from(this.dropdownOptionsWithIndex.values()).filter(
        (el: TDropdown) => {
          const labelValue = typeof el.label === 'function' ? el.label() : el.label;
          let labelString = '';
          if (typeof labelValue === 'string') {
            labelString = labelValue;
          } else if (labelValue && typeof labelValue === 'object' && 'strings' in labelValue) {
            labelString = (labelValue as any).strings.join('');
          }

          return !el.hideOption && labelString.toLowerCase().includes((this.searchValue || '').toLowerCase());
        }
      );

      const selectAllRecursive = (option: TDropdown) => {
        if (!this._value.includes(option.value) && option.value !== 'selectAllOptions') {
          this.handleSelectAll(false, undefined, option.value as string);
        }
        if (option.children && Array.isArray(option.children)) {
          (option.children as TDropdown[]).forEach((child: TDropdown) => {
            selectAllRecursive(child);
          });
        }
      };

      filteredOptions.forEach((el: TDropdown) => {
        selectAllRecursive(el);
        let currentPath: string | null = el.parentPath ?? '-1';
        while (currentPath !== '-1') {
          this.updateActiveOptionsSizeOfPath(currentPath, E_OPERTION.add);
          const parentOption = this.dropdownOptionsWithIndex.get(parseInt(currentPath, 10));
          currentPath = parentOption?.parentPath ?? '-1';
        }
      });
    } else {
      this.clear();
      this.unCheckAllSelectedCheckbox();
    }

    this.updateVirtualizer();
    this.requestUpdate();
    this.emitScSelect();
    this.focusInput(true);
    this.searchValue = '';
  }

  @watch(['_value', 'selectedItems'], { waitUntilFirstUpdate: true })
  async updateSelectAllCheckboxState() {
    await this.updateComplete;
    // Try to update via ref first
    if (this.selectAllCheckboxRef && this.data) {
      const { checkbox, div } = this.selectAllCheckboxRef;
      const allOptions = Array.from(this.immutableDropdownOptions)
        .filter(el => !el?.disabled && el.value !== 'selectAllOptions' && !el.hideOption);
      const allSelected = allOptions.every(option => this._value.includes(option.value));
      checkbox.checked = allSelected;
      if (allSelected) {
        div.classList.add('selected');
      } else {
        div.classList.remove('selected');
      }
      return;
    }
    // Fallback: update by querying DOM
    const items = this.shadowRoot?.querySelectorAll('.list-item');
    const allOptions = Array.from(this.immutableDropdownOptions)
      .filter(el => !el?.disabled && el.value !== 'selectAllOptions' && !el.hideOption);
    const allSelected = allOptions.every(option => this._value.includes(option.value));
    items?.forEach(item => {
      const checkbox = item.querySelector('sc-checkbox');
      if (checkbox && checkbox.id === 'selectAllCheckbox') {
        checkbox.checked = allSelected;
        if (allSelected) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      }
    });
  }

  @watch(['selectedItems', '_value', 'maxCount'])
  async updateMaxCount() {
    if (this.maxCount) {
      let needUpdate = false;
      if (this._forceUpdate) {
        this._forceUpdate = false;
        this.requestUpdate();
      }
      await this.updateComplete;
      this.dropdownOptionsWithIndex?.forEach(option => {
        if (this.isOverflow) {
          if (!this._value.includes(option.value)) {
            option.frozen = true;
            needUpdate = true;
          }
        } else {
          if (option.frozen) {
            needUpdate = true;
            option.frozen = false;
          }
        }
      });
      this._forceUpdate = needUpdate;
      this.updateVirtualizer();
      if (!this.isVirtual) {
        this.updateMenuItemsCheckboxState();
      }
    }

  }

  private override renderVirtualItems(isVitrual = true) {
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

  private createSelectAllEl(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('list-item');
    const checkbox = document.createElement('sc-checkbox');

    checkbox.innerText = msg('Select all', { id: 'sc-dropdown-select-all' });
    checkbox.id = 'selectAllCheckbox';
    checkbox.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isSelecting = !checkbox.checked;
      checkbox.checked = isSelecting;

      if (isSelecting) {
        div.classList.add('selected');
        this.handleSelectAllOptions(div, isSelecting);
      } else {
        div.classList.remove('selected');
        this.clear();
      }
    });

    checkbox.style.setProperty('padding-top', '10px');
    if (this.hideCheckbox) {
      checkbox.style.setProperty('--sc-checkbox-inner-display', 'none');
    }
    render(this.renderPrefix(), div);
    div.appendChild(checkbox);
    return div;
  }

  private handleSelectAllOptions(div: HTMLElement, isSelecting: boolean): void {
    this.searchValue = '';
    this.inputValue = '';

    this.isBatchingSelectAll = true;

    setTimeout(() => {
      const checkboxes = this.shadowRoot?.querySelectorAll('sc-checkbox');
      if (checkboxes) {
        checkboxes.forEach(checkbox => {
          if (!checkbox.disabled) {
            (checkbox as unknown as HTMLInputElement).checked = isSelecting;
          }
        });
      }

      this.dropdownOptionsWithIndex.forEach(el => {
        if (!el.disabled) {
          this.handleSelect(
            { detail: { checked: isSelecting } } as any,
            el.value,
            div.dataset.parentPath as string ?? '-1'
          );
        }
      });

      this.updateActiveOptionsSizeOfPath(
        div.dataset.parentPath as string ?? '-1',
        E_OPERTION.add
      );

      this.updateVirtualizer();
      this.isBatchingSelectAll = false; 
      this.emitScSelect();
      this.focusInput(true);
      this.updateSelectedClasses();
      this.requestUpdate();
    }, 0);
  }

  selectAllCheckboxRef: {
    checkbox: any,
    div: HTMLElement
  } | null = null;

  private readonly menuItemHandlers: Map<HTMLElement, (event: Event) => void> = new Map();
  private readonly checkboxHandlers: Map<HTMLElement, (event: Event) => void> = new Map();
  
  private override createPhysicalEl(options?: {
      index?: number,
      disabled?: boolean
  }): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('list-item');
    const checkbox = document.createElement('sc-checkbox');
    
    if (options?.disabled) {
      checkbox.setAttribute('disabled', `${options.disabled}`);
    }
    if (!options?.disabled) {
      const menuItemHandler = () => {
        if (this.isExpandedMenuItem(div)) {
          this.updateExpandedBehaviour(div);
          return;
        }
        const checkbox = div.querySelector('sc-checkbox');
        if (this.isOverflow && !checkbox?.checked) return;

        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          if (checkbox.checked) {
            div.classList.add('selected');
          } else {
            div.classList.remove('selected');
          }
          if (checkbox.value === 'selectAllOptions' && this.selectAll) {
            checkbox.id = 'selectAllOptions';
            this.selectAllCheckboxRef = {
              checkbox,
              div,
            };
            this.handleVirtualItemsSelectAllOptions(checkbox.checked);
          }
          else {
            this.handleSelect(
              { detail: { checked: checkbox.checked } } as any,
              checkbox.value,
              div.dataset.parentPath as string
            );
            this.unCheckAllSelectedCheckbox();
          } 
        }
      };
      const checkboxHandler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        if (
          this.isParentCheckbox(
            div,
            this.isCheckbox(e.composedPath() as HTMLElement[])
          )
        ) {
          this.handleSelectAll(
            Boolean(checkbox.checked),
            div.dataset.path as string
          );
          this.toggleParentIfNeed(div.dataset.parentPath ?? this.nonExistence);
          this.updateVirtualizer();
          this.requestUpdate();
          this.emitScSelect();
          this.focusInput(true);
          if (!this.keepInputOnSelect) {
            this.searchValue = '';
          }
          this.unCheckAllSelectedCheckbox();
        } else {
          div.click();
          if (!this.keepInputOnSelect) {
            this.searchValue = '';
          }
        }
      };
      
      // Store references to the handlers
      this.menuItemHandlers.set(div, menuItemHandler);
      this.checkboxHandlers.set(checkbox, checkboxHandler);
      
      div.addEventListener('click', menuItemHandler);
      checkbox.addEventListener('click', checkboxHandler);
    }
    checkbox.toggleAttribute('error', this.error);
    checkbox.style.setProperty('padding-top', '0.375rem');
    if (this.hideCheckbox) {
      checkbox.style.setProperty('--sc-checkbox-inner-display', 'none');
    }
    render(this.renderPrefix(), div);
    div.appendChild(checkbox);
    if (!this.selectAllCheckboxRef && this.selectAll && options?.index === 0) {
        checkbox.id = 'selectAllOptions';
        this.selectAllCheckboxRef = {
          checkbox,
          div,
        };
    }
    const tick = document.createElement('sc-icon');
    tick.setAttribute('name', 'tick');
    tick.setAttribute('class', 'tick-mark');
    tick.setAttribute('aria-hidden', 'true');
    div.appendChild(tick);
    return div;
  }

  preCheckForIndet(
    path: string,
    callback: (activedCount: number, count: number) => void
  ) {
    const activedChildrenSize =
      this.activeOptionsSizeOfParentPath.get(path) ?? 0;
    const sum =
      this.immutableChildrenSumBaseParentPath.get(path) ?? +this.nonExistence;
    if (sum === +this.nonExistence) return;
    callback(activedChildrenSize, sum);
  }

  indetCheckbox(path: string, isParent: boolean, checkbox: HTMLElement) {
    this.preCheckForIndet(path, (activedCount: number, count: number) => {
      if (isParent) {
        if (activedCount > 0 && activedCount !== count) {
          checkbox.toggleAttribute('indeterminate', true);
        } else {
          checkbox.toggleAttribute('indeterminate', false);
        }
      } else {
        checkbox.toggleAttribute('indeterminate', false);
      }
    });
  }

  override updateElement(menuItem: HTMLElement, index: number) {
    const checkbox = menuItem?.querySelector('sc-checkbox');
    const data = this.dropdownOptionsWithIndex.get(index);

    checkbox?.removeAttribute('disabled');
    menuItem.removeAttribute('disabled');
    
    if ((data?.disabled || data?.frozen) && checkbox && menuItem) {
      checkbox.setAttribute('disabled', `${data.disabled || data.frozen}`);
      menuItem.setAttribute('disabled', `${data.disabled || data.frozen}`);
      
      if (!data?.frozen) {
        const menuItemHandler = this.menuItemHandlers.get(menuItem);
        if (menuItemHandler) {
          menuItem.removeEventListener('click', menuItemHandler);
          this.menuItemHandlers.delete(menuItem);
        }
        const checkboxHandler = this.checkboxHandlers.get(checkbox);
        if (checkboxHandler) {
          checkbox.removeEventListener('click', checkboxHandler);
          this.checkboxHandlers.delete(checkbox);
        }
      }
    }
    checkbox?.toggleAttribute('error', this.error);

    if (checkbox && data) {
      // useful for clean cache
      checkbox.toggleAttribute('indeterminate', false);
      checkbox.value = data.value;
      this.updateChildrenPart(data, menuItem);
      this.indetCheckbox(data.path, this.isParent(data), checkbox);
      if (data.value === 'selectAllOptions' && this.selectAll) {
        checkbox.id = 'selectAllOptions';
        this.selectAllCheckboxRef = {
          checkbox,
          div: menuItem,
        };
        const allOptions = Array.from(this.immutableDropdownOptions).filter(
          el => !el?.disabled && el.value !== 'selectAllOptions'
        );
        const allSelected = allOptions.every(option => this._value.includes(option.value));
        checkbox.checked = allSelected;
      } else {
        if (checkbox.id === 'selectAllOptions') {
          checkbox.removeAttribute('id');
        }
        if (
          this.selectAllCheckboxRef?.checkbox === checkbox ||
          this.selectAllCheckboxRef?.div === menuItem
        ) {
          this.selectAllCheckboxRef = null;
        }
        // eslint-disable-next-line eqeqeq
        checkbox.checked = this._value.findIndex((v:any) => v == data.value) > -1;
      }
      const label =
        typeof data.label === 'function' ? data.label() : data.label;
      if (typeof label === 'string') {
        const highlightedLabel = this.highlightMatch(label, this.searchValue);
        render(highlightedLabel, checkbox);
      } else if (
        label &&
        typeof label === 'object' &&
        '_$litType$' in label &&
        Array.isArray(label.strings) &&
        label.values &&
        label.values.length === 0
      ) {
        const labelText: string = label.strings[0];
        const highlightedLabel = this.highlightMatch(
          labelText,
          this.searchValue
        );
        render(highlightedLabel, checkbox);
      } else {
        render(label, checkbox);
      }
    }
    this.updateSelectedClasses();
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

  getSelectValueForReadonly() {
    const result: string[] = [];
    const _valueBak = [...this._value];

    for (const option of this.immutableDropdownOptions) {
      const index = this._value.findIndex(value => option.value.toString() === value.toString());
      if (index !== -1) {
        _valueBak[index] = undefined;
        result.push(this.getTextContent(option));
      }
    }
    if (result.length === this._value.length) {
      return result.filter(v => v).join(', ');
    } else {
      const remainingOptions = result.concat(_valueBak.filter(v => v));
      return remainingOptions.filter(v => v).join(', ');
    }
    return '';
  }

  getCloseableItems() {
    const result: TData[] = [];
    const allOptions = this.allImmutableDropdownOptions || this._options;
    if (allOptions && allOptions.size > 0) {
      for (const option of this._value) {
        const item = Array.from(allOptions).find(
          o => o.value.toString() === option.toString() && (!o?.children || o.children.length === 0)
        );
        const containsChildern = Array.from(this._options).find(
          o => o.value.toString() === option.toString() && o?.children && o?.children?.length > 0  && !o.hideOption
        );

        if (item) {
          result.push(item);
        } 
        // adding value that doesn't exist
        else if (!containsChildern) {
          result.push({
            displayValue: option,
            label: option,
            value: option,
            children: undefined,
          });
        }
      }
    } else {
      for (const value of this._value) {
        result.push({
          label: value,
          value,
          displayValue: value,
        });
      }
    }
    return result.filter(Boolean) || [];
  }

  calculateItemWidth(item: any): number {
    const tempElement = this.createTempElement();

    if (item instanceof Element) {
      tempElement.textContent = this.getElementValue(item);
    } else {
      tempElement.textContent = this.getItemValue(item);
    }

    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth;
    document.body.removeChild(tempElement);
    return width;
  }

  private createTempElement(): HTMLDivElement {
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.style.padding = '0.125em 1.25em';
    tempElement.style.border = '1px solid transparent';
    tempElement.style.fontSize = '0.76rem';
    return tempElement;
  }

  private getElementValue(item: Element): string | null {
    return this.displayRawValue ? item.getAttribute('value') : item.textContent;
  }

  private getItemValue(item: any): string {
    if (item.displayValue) {
      return item.displayValue;
    }
    const compiledValue = this.replaceTag(this.reCompile(item));
    const labelText = this.getLabelText(item);

    if (this.displayRawValue) {
      return item.value ?? '';
    }

    return item.displayValue ?? labelText ?? item.value ?? (typeof compiledValue === 'string' ? compiledValue : '');
  }

  private getLabelText(item: any): string | null {
    if (item.label && typeof item.label === 'object' && Array.isArray(item.label.strings)) {
      return item.label.strings.join('');
    } else if (typeof item.label === 'string') {
      return item.label;
    }
    return null;
  }

  private get renderableItems() {
    this._renderableItems = this.getItemsToShow(this.closeableItems);
    return this._renderableItems;
  }

  get availableWidth(): number {
    return Math.max(
      0,
      this.inputWidth -
        defaultOffset -
        this.optionInputWidth -
        (this.clearable ? clearableOffset : 0) -
        (this.error ? errorOffset : 0) -
        (this.prefixIcon ? prefixIconOffset : 0)
    );
  }

  private getItemsToShow(closeableItems: any[]): {
    itemsToShow: any[];
    remainingItems: number;
  } {
    if (closeableItems.length === 1) {
      return { itemsToShow: [closeableItems[0]], remainingItems: 0 };
    }

    const computeItems = (availableWidth: number) => {
      const itemWidths: number[] = new Array(closeableItems.length);
      let totalItems = 0;
      let usedWidth = 0;
      const itemsToShow: any[] = [];
  
      for (let i = closeableItems.length - 1; i >= 0; i--) {
        const item = closeableItems[i];
        if (!item || !item.label) continue;

        itemWidths[i] = itemWidths[i] ?? this.calculateItemWidth(item);
        if (usedWidth + itemWidths[i] > availableWidth) {
          break;
        }
  
        usedWidth += itemWidths[i];
        itemsToShow.push(item);
        totalItems++;
      }
  
      return {
        itemsToShow: itemsToShow.reverse(),
        remainingItems: closeableItems.length - totalItems,
      };
    };
  
    let result = computeItems(this.availableWidth);
    if (result.remainingItems > 0) {
      result = computeItems(this.availableWidth - truncatedItemsTextOffset);
    }
  
    return result;
  }  

  clear() {
    if (!this.canClearSelection()) {
      this.markMinViolationAttempt();
      this.requestUpdate();
      return;
    }
    this._value = [];
    this.selectedItems = [];
    this.emit('sc-clear');
    this.emitScSelect();
    this.searchValue = '';
    const checkboxes = this.shadowRoot?.querySelectorAll('sc-checkbox');
    if (checkboxes) {
      checkboxes.forEach(checkbox => {
        (checkbox as unknown as HTMLInputElement).checked = false;
      });
    }
    this.requestUpdate();
  }

  renderSearchField() {
    return html`
      <sc-search-field 
        placeholder=${msg('Search', { id: 'sc-search-placehoder' })}
        clearable
        size=md
        @sc-clear=${this.handleClear}
        @sc-input=${this.handleTextInput}
        @click=${() => this.focusInput(false, true)}
      >
        ${this.renderInputCover(true)}
      </sc-search-field>
    `;
  }

  renderWithSHtml(data: TData) {
    const htmlStr = this.replaceTag(this.reCompile(data));
    return sHtml`${unsafeStatic(htmlStr)}`;
  }

  handleInputMousedown(e: KeyboardEvent) {
    const key = e.key;
    if (key === E_KEYS.enter && !this.hasResults && this.autoCreateTag) {
      this._value = [...this._value, this.searchValue];
      this.emitScSelect();
      this.searchValue = '';
    }
  }
  
  renderInputCover(onMobile?: boolean) {
    const size = this.size === 'sm' ? 'auto' : this.size === 'lg' ? '2.375rem' : '1.89rem';

    return html`
      <div class=${classMap({
        'input-cover': true,
        focus: this._focus,
        [this.borderType]: true,
        clearable: this.clearable,
        mobile: !!onMobile,
      })} slot='form-control'
              style='${styleMap({
        '--sc-dropdown-multiple-height': (this.multipleRows) ? 'auto' : size,
      })}'
              >
              <ul 
                class='${this.multipleRows ? 'multiple-rows' : ''} 
                ${this.prefixIcon ? 'prefix-icon' : ''} 
                ${this.error ? 'error' : ''}'
                @click=${this.isMobile ? this.show : () => {}}
                >
                ${(() => {
        const renderTag = (v: any) => html`
                    <li @click=${(e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (onMobile) {
              this.focusInput(false, true);
              this.updateFocus(true, e);
            }
          }}>
                      <sc-closable-tag
                        @sc-remove=${this.removeTag}
                        type=${this.tagType}
                        value=${v.value}
                        .disabled=${this.disabled}
                        max-width=${this.availableWidth}
                      >
                      ${(v as TData) instanceof Element
            ? this.displayRawValue
              ? v.getAttribute('value')
              : v?.displayValue || v.textContent
            : this.displayRawValue
              ? v.value
              : v?.displayValue || this.renderWithSHtml(v)}
                      </sc-closable-tag>
                    </li>
                  `;
        if (!this.multipleRows && !this._focus) {
          const { itemsToShow, remainingItems } = this.renderableItems;
          return html`
            <div style="
              display: flex; 
              align-items: center; 
              max-width: ${Boolean(this._value?.length) ? `${this.availableWidth}px` : '0px'};
            ">
              ${itemsToShow.length > 0 ? itemsToShow.map(renderTag) : nothing}
              ${remainingItems > 0 ? html`
                <li>
                  <span class='truncated-items-text'>
                    ${itemsToShow.length === 0 ? `${remainingItems} items` : `${remainingItems} more`}
                  </span>
                </li>
              ` : nothing}
            </div>
          `;
        } else if (!this.multipleRows && this._focus) {
          return html`
            <div style="
              display: flex; 
              align-items: center; 
              overflow: hidden;
              white-space: nowrap;
              min-width: 0;
              max-width: ${this.availableWidth}px;
            ">
              <div style="
                display: flex; 
                flex-shrink: 1; 
                overflow: hidden;
                justify-content: flex-end; 
                min-width: 0;
                max-width: ${this.availableWidth}px;
              ">
                ${this.closeableItems.map(renderTag)}
              </div>
            </div>
          `;
        } else {
          return this.closeableItems.map(v => {
            if (!v) {
              return nothing;
            }
            return renderTag(v);
          });
        }
      })()}
                ${html`
                  <li
                    class="input-li"
                    style='
                      width: ${this._value?.length ? 'auto' : '100%'};
                      max-width: ${this._value?.length ? 'calc(100% - 4rem);' : 'calc(100% - .5rem)'};
                      padding-left: 0.25rem;
                    '
                      @click=${(e: Event) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.focusInput(false, onMobile);
                    }}>
                    <input 
                        ?disabled=${this.disabled} 
                        class=${
                          classMap({
                            'option-input': true,
                            'without-placeholder': this._value?.length > 0,
                          })
                        }
                        @input=${this.handleTextInput}
                        @click=${() => {
                          if (onMobile) {
                            this._focus = true;
                            return;
                          }
                          this.show();
                        }}
                        @keydown=${this.handleInputMousedown}
                        placeholder=${this._value?.length > 0 ? '' : this.isMobile ? msg('Search', { id: 'sc-search-placeholder' }) : this.placeholder}
                        style='
                          width: ${this._value?.length && this._focus ? 'auto' : '100%'};
                          field-sizing: ${this._value?.length ? 'content' : 'fixed'};
                        '
                      />
                  </li>
                `}
              </ul>
            </div>
    `;

  }
  renderInput() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasPrefixSlot = this.hasSlotController.test('prefix');
    const size = this.size === 'sm' ? 'auto' : this.size === 'lg' ? '2.375rem' : '1.89rem';
    return html`
      <sc-text-input
        ?clearable=${this.clearable}
        .value=${this._value.join().length}
        label=${this.label}
        .disabled=${this.disabled}
        .required=${this.required}
        .error=${this.error || this._minCountError}
        .success=${this.success}
        help-text=${this.helpText}
        error-message=${this.errorMessage || (this._minCountError ? this.defaultMinCountMessage : '')}
        success-message=${this.successMessage}
        prefix-icon=${this.prefixIcon}
        ?default-slot-not-as-label=${true}
        tooltip=${this.tooltip}
        tooltip-placement=${this.tooltipPlacement}
        hint=${this.hint}
        hint-placement=${this.hintPlacement}
        label-size=${this.labelSize}
        size=${this.size}
        border-type=${this.borderType}
        @sc-clear=${this.clear}
        style='${styleMap({
          '--sc-form-input-prefix-padding-top': this.affixTopPadding,
          '--sc-form-input-suffix-padding-top': this.affixTopPadding,
        })}'
      >
        ${this.renderInputCover()}
        ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
        ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
        ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
        ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
        ${hasPrefixSlot ? html`<slot name='prefix' slot='prefix' ></slot>` : '' }
        <slot name='help' slot='help'>${this.helpText}</slot>
        <slot name='error' slot='error'>${this.errorMessage || (this._minCountError ? this.defaultMinCountMessage : '')}</slot>
        <slot name='success' slot='success'>${this.successMessage}</slot>
        <sc-icon slot='suffix' name=${this.arrowIcon} size="sm" @click=${this.setDropdownStatus}></sc-icon>
      </sc-text-input>
    `;
  }

  renderMenu() {
    return html`
    <sl-menu class=${classMap({
      'init-height': this.needInitialHeight,
      'dropdown-menu': true,
    })} @keyup=${this.OnMenuKeyup} @keydown=${this.onMenuKeydown} class='dropdown-menu' part='menu'>
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
        ? '' : guard([this.dropdownOptionsWithIndex, this._forceUpdate], () => this.renderNormalItems())}
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
          <div>
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
        <div>
          <sc-icon name=${this.advancedSearchIcon} size='xs'></sc-icon>
        </div>
        <div part='advanced-search-text' class='advanced-search-text'>${this.advancedSearchText}</div>
      </div>
    </sl-menu>`;
  }
  
  render() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasPrefixSlot = this.hasSlotController.test('prefix');
    if (this.isMobile) {
      return html`
        <div 
          @slotchange=${this.onSlotChange} 
          class='sc-dropdown-input multiple ${this.hasLabel ? '' : 'no-label'} 
          ${this.disabled ? 'disabled' : ''} 
          ${this.borderType} 
          ${this.error ? 'error' : this.success ? 'success' : ''}'
          >
            ${this.renderMobile()}
            <slot style='display: none'></slot>
        </div>
      `;
    }

    return html`
      <style>
        sl-dropdown > sl-menu.init-height {
          height: ${this.immutableDropdownOptions.size * 33 + 28}px!important;
        }
      </style>
      <div 
        @slotchange=${this.onSlotChange} 
        class='sc-dropdown-input multiple ${this.hasLabel ? '' : 'no-label'} 
        ${this.disabled ? 'disabled' : ''} 
        ${this.borderType} 
        ${(this.error || this._minCountError) ? 'error' : this.success ? 'success' : ''}
        ${this.hideTickMark ? 'hide-tick-mark' : ''}'
        >
        ${this.readonly ? html`
          <sc-text-input
            label=${this.label}
            .readonly=${this.readonly}
            ?max-rows=${this.maxRows} 
            readonly-rows=${this.readonlyRows} 
            .disabled=${this.disabled}
            .required=${this.required}
            .error=${this.error || this._minCountError || this.isBelowMinCount}
            .success=${this.success}
            .value=${this.getSelectValueForReadonly()}
            help-text=${this.helpText}
            error-message=${this.errorMessage || ((this._minCountError || this.isBelowMinCount) ? this.defaultMinCountMessage : '')}
            success-message=${this.successMessage}
            prefix-icon=${this.prefixIcon}
            ?default-slot-not-as-label=${true}
            tooltip=${this.tooltip}
            tooltip-placement=${this.tooltipPlacement}
            hint=${this.hint}
            hint-placement=${this.hintPlacement}
            label-size=${this.labelSize}
            border-type=${this.borderType}
            size=${this.size}
          >
              ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
              ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
              ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
              ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
              ${hasPrefixSlot ? html`<slot name='prefix-icon' slot='prefix' ></slot>` : '' }
              <slot name='help' slot='help'>${this.helpText}</slot>
              <slot name='error' slot='error'>${this.errorMessage || ((this._minCountError || this.isBelowMinCount) ? this.defaultMinCountMessage : '')}</slot>
              <slot name='success' slot='success'>${this.successMessage}</slot>
            </sc-text-input>
          ` : html`
        <sl-dropdown 
          distance="5"
          class='sc-dropdown-input multiple ${this.borderType} ${this.size}'
          style='width: 100%'
          .disabled=${this.disabled}
          ?hoist=${this.hoist}
          @sl-show=${async(event: CustomEvent) => {
            this.emit('sc-show');
            this.stopDefaultEvent(event);
            await this.updateComplete;
            this.initializeVirtualizer();
            this.updateVirtualizer();
            this.updateFocus(true, event);
            this.focusInput(true);
            this.onDropdownShow();
            this.updateSelectAllCheckboxState();
          }}
          @sl-hide=${(event: CustomEvent) => {
            this.emit('sc-hide');
          this.updateFocus(false, event);
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
