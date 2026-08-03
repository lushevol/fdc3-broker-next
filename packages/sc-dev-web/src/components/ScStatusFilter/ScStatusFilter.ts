import { html, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScStatusFilterStyle from './ScStatusFilter.style.js';
import { ScStatusFilterItem, StatusFilterSize } from './ScStatusFilterItem.js';

/**
 * Status Filter Component
 *
 * A container that manages selection of status filter items.
 * Responsive grid that adapts based on available container space.
 *
 * @element sc-status-filter
 * @slot - Default slot for sc-status-filter-item elements
 * @fires sc-select - Fired when selection changes
 */
export class ScStatusFilter extends ScElement {
  static styles = ScTheme.getStyles().concat([ScStatusFilterStyle]);

  /** Enable multiple selection mode */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Currently selected value (single mode) or values (multiple mode) */
  @property({ type: String }) value = '';

  /** Disabled state for entire filter group */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Size variant for all items in the group */
  @property({ type: String, reflect: true }) size: StatusFilterSize = 'md';

  /** Maximum columns per row (default: 6, max: 6) */
  @property({ type: Number, attribute: 'row-max-columns', reflect: true })
  rowMaxColumns = 6;

  @query('slot') private _defaultSlot!: HTMLSlotElement;
  @query('.filter-group') private _filterGroup!: HTMLElement;

  /** @internal Gets all slotted filter items */
  private get _items(): ScStatusFilterItem[] {
    if (!this._defaultSlot) return [];
    return [...this._defaultSlot.assignedElements({ flatten: true })].filter(
      (el): el is ScStatusFilterItem =>
        el.tagName.toLowerCase() === 'sc-status-filter-item' &&
        !el.hasAttribute('inert')
    );
  }

  private _selectedValues: Set<string> = new Set();
  private _resizeObserver: ResizeObserver | null = null;
  private _currentColumns = 6;

  // Minimum item width in rem (8.75rem = 140px)
  private readonly MIN_ITEM_WIDTH_REM = 8.75;

  // Enforce max of 6 columns
  private get COLUMNS() {
    return Math.min(Math.max(1, this.rowMaxColumns), 6);
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupResizeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupResizeObserver();
  }

  private _setupResizeObserver() {
    this._resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this._handleResize(entry.contentRect.width);
      }
    });
  }

  private _cleanupResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  private _handleResize(containerWidth: number) {
    const columns = this._calculateColumns(containerWidth);
    if (columns !== this._currentColumns) {
      this._currentColumns = columns;
      this._updateItemPositions();
      this.requestUpdate();
    }
  }

  private _calculateColumns(containerWidth: number): number {
    if (containerWidth <= 0) return this.COLUMNS;

    // Convert rem to px (1rem = 16px)
    const remToPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const minItemWidthPx = this.MIN_ITEM_WIDTH_REM * remToPx;

    // Calculate how many items can fit
    const maxBySpace = Math.floor(containerWidth / minItemWidthPx);

    // Clamp between 1 and row-max-columns
    return Math.max(1, Math.min(maxBySpace, this.COLUMNS));
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled') || changedProperties.has('size')) {
      this._syncChildrenProps();
    }

    if (changedProperties.has('rowMaxColumns')) {
      this._handleResize(this._filterGroup?.offsetWidth || 0);
    }

    if (changedProperties.has('value')) {
      const oldValue = changedProperties.get('value');
      if (oldValue !== undefined && oldValue !== this.value) {
        this._syncValueToSelection();
      }
    }
  }

  firstUpdated() {
    // Start observing the filter group
    if (this._resizeObserver && this._filterGroup) {
      this._resizeObserver.observe(this._filterGroup);
    }

    this._updateItemPositions();
    this._syncInitialSelection();
    this._syncChildrenProps();
    this._bindItemEvents();
  }

  private _syncChildrenProps() {
    if (this._items) {
      this._items.forEach(item => {
        item.disabled = this.disabled;
        item.size = this.size;
      });
    }
  }

  private _bindItemEvents() {
    this._items.forEach(item => {
      item.removeEventListener(
        'sc-select',
        this._handleItemClick as EventListener
      );
      item.addEventListener(
        'sc-select',
        this._handleItemClick as EventListener
      );
    });
  }

  private _syncValueToSelection() {
    const newValues = new Set(
      this.value
        ? this.value.split(',').map(v => v.trim()).filter(Boolean)
        : []
    );

    if (this._areSetsEqual(this._selectedValues, newValues)) return;

    this._selectedValues = newValues;
    this._updateItemsSelection();
  }

  private _areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false;
    for (const val of setA) {
      if (!setB.has(val)) return false;
    }
    return true;
  }

  private _syncInitialSelection() {
    this._items.forEach((item, index) => {
      item.index = index;
      if (item.selected) {
        const itemValue = item.value || item.label;
        this._selectedValues.add(itemValue);
      }
    });

    if (!this.multiple && this._selectedValues.size > 1) {
      const firstValue = Array.from(this._selectedValues)[0];
      this._selectedValues.clear();
      this._selectedValues.add(firstValue);
      this._updateItemsSelection();
    }
  }

  private _handleItemClick = (e: CustomEvent) => {
    if (this.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    const item = e.detail.target as ScStatusFilterItem;
    const itemValue = e.detail.value;
    const isSelected = e.detail.selected;

    if (this.multiple) {
      if (isSelected) this._selectedValues.add(itemValue);
      else this._selectedValues.delete(itemValue);
    } else {
      if (isSelected) {
        this._selectedValues.clear();
        this._selectedValues.add(itemValue);
        this._updateItemsSelection(item);
      } else {
        this._selectedValues.delete(itemValue);
      }
    }
    this._fireSelectEvent();
  };

  private _updateItemsSelection(exceptItem?: ScStatusFilterItem) {
    this._items.forEach(item => {
      if (item !== exceptItem) {
        const itemValue = item.value || item.label;
        item.selected = this._selectedValues.has(itemValue);
      }
    });
  }

  private _fireSelectEvent() {
    const selectedArray = Array.from(this._selectedValues);
    this.emit('sc-select', {
      detail: {
        value: this.multiple ? selectedArray : selectedArray[0] || '',
        values: selectedArray,
      },
    });
  }

  private _updateItemPositions() {
    const items = this._items;
    const count = items.length;
    if (count === 0) return;

    const columns = this._currentColumns;
    const totalRows = Math.ceil(count / columns);

    items.forEach((item, index) => {
      item.index = index;

      // Clear old attributes
      item.removeAttribute('data-tl');
      item.removeAttribute('data-tr');
      item.removeAttribute('data-bl');
      item.removeAttribute('data-br');
      item.removeAttribute('data-first-col');
      item.removeAttribute('data-first-row');

      const row = Math.floor(index / columns);
      const col = index % columns;

      const isLastItem = index === count - 1;
      const isLastInRow = col === columns - 1 || isLastItem;
      const isLastRow = row === totalRows - 1;

      // First column: no left margin
      if (col === 0) item.setAttribute('data-first-col', '');

      // First row: no top margin
      if (row === 0) item.setAttribute('data-first-row', '');

      // Top Left: Always index 0
      if (index === 0) item.setAttribute('data-tl', '');

      // Top Right: The last item of the FIRST row
      if (row === 0 && isLastInRow) item.setAttribute('data-tr', '');

      // Bottom Left: The first item of the LAST row
      if (isLastRow && col === 0) item.setAttribute('data-bl', '');

      // Bottom Right: The very last item
      if (isLastItem) item.setAttribute('data-br', '');
    });
  }

  private _handleSlotChange() {
    this._updateItemPositions();
    this._syncInitialSelection();
    this._syncChildrenProps();
    this._bindItemEvents();
  }

  render() {
    const styles = { '--_columns': String(this._currentColumns) };
    return html`
      <div
        class="filter-group"
        part="base"
        role="group"
        style=${styleMap(styles)}
      >
        <slot @slotchange="${this._handleSlotChange}"></slot>
      </div>
    `;
  }
}
