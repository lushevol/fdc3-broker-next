import {
  html, nothing, PropertyValues, render,
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import { throttle } from '../../shared/util.js';
import ScTheme from '../../styles/ScTheme.js';

import ScTableStyle from './ScTable.style.js';
import '../../../elements/sc-pagination.js';
import type { ScCheckbox } from '../../../elements/sc-checkbox.js';
import '../../../elements/sc-icon.js';
import { TDirection } from './TableHeaders/ScTableHeaderWithSort.js';
import { classMap } from 'lit/directives/class-map.js';
import { cellPlaceholder } from './ScTable.template.js';
import { Log } from '../../controllers/log.js';
import { watch } from '../../shared/watch.js';
import { ToolMixin } from '../../mixins/tool-mixin.js';
import type { TLookup } from './ScTableFilter.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';
import { LayerHierarchyMixin, layerStyle } from '../../mixins/layer-hierarchy-mixin.js';
import { guard } from 'lit/directives/guard.js';
import { styleMap } from 'lit/directives/style-map.js';
import { msg } from '@lit/localize';

enum E_ATTACH_OUTPUT {
  noWidth = 'no-width',
  noFixed = 'no-fixed'
}

const fixedMannersMap = {
  left: 'left',
  right: 'right',
} as const;
const fixedManners = Object.values(fixedMannersMap);

interface IMetadata {
  left?: number;
  right?: number;
  fixedStyle?: boolean;
  [key: string]: any
}

export interface Conf {
  header: any;
  cell?: any;
  property: string;
  hidden?: boolean;
  columnStyle?: string;
  sort?: boolean;
  filter?: boolean;
  pinned?: typeof fixedManners[number];
  metadata?: IMetadata;
  filterParams?: {
    lookup?: TLookup;
  }
}

interface EventOfTr {
  type: string;
  event: (item: any) => void;
}

interface TableElement {
  element: HTMLTableRowElement;
  expandedEl: HTMLElement | null;
  columns: Array<HTMLTableCellElement>;
  events: Array<EventOfTr>;
}

const CHOOSER_PROPERTY = '$chooser';
const EXPAND_KEY = '$expand';
const NON_EXPAND_KEY = '$non-expand';
const E_S_C = 'expansive-slot-container';
const E_S_C_SHOW = `${E_S_C}-show`;

const CELL_ICON = 'cell-icon';
const CELL_ICON_EXPANDED = `${CELL_ICON}-expanded`;
const SLOT_WRAPPER = 'slot-wrapper';

const KEY = '$key';

export enum E_EXPAND_TYPE {
  inactive = 0,
  active = 1,
  activated = 2,
}
enum E_EXPAND_MODO {
  singleOnly = 'single-only',
  multiple = 'multiple'
}

enum E_SELECT_SCOPE {
  page = 'page',
  all = 'all'
}

export enum E_SELECT_TRIGGER {
  row,
  header,
  nestedTable
}
export class ScTable extends LayerHierarchyMixin(ToolMixin(ScElement)) {
  static styles = ScTheme.getStyles().concat([ScTableStyle, layerStyle]);

  log = new Log(this, this.tagName.toLowerCase());

  private showData: Array<unknown> = [];

  private selectedPage = 1;

  private selectAll = false;

  private hasOperationOnChooser = false;

  @state() selectedData: Array<unknown> = [];
  @state() selectedSubTableData = new Map<string | number, Array<unknown>>();
  private previousSelectedSubTableData = new Map<string | number, Array<unknown>>();
  private expansiveSlotTrCatch = new Map<string | number, HTMLTableRowElement>();
  
  /**
   * data row index, not show data index
   */
  private expandedRowsIndex = new Set<number>();

  private hasExpandedManually = false;

  @property({ type: Array }) data: Array<unknown> = [];

  @property({ type: Array }) conf: Array<Conf> = [];

  @property({ type: Array }) table: Array<TableElement> = [];

  @property({ type: String }) sort = '';

  @property({ type: Array }) headers: Array<HTMLTableHeaderCellElement> = [];

  @property({ type: Boolean, attribute: 'sticky-header' }) stickyHeader = false;

  @property({ type: Number }) lastConfSize = 0;

  @property({ type: Boolean }) pagination = false;

  /**
   * Highest priority
   * If set, data will used for current page only.
   */
  @property({ type: Number }) total?: number;
  @state() totalDataLength = 0;

  @property({ type: Number, attribute: 'page-size' }) pageSize = 10;

  @property({ type: Boolean, attribute: 'quick-jumper' }) quickJumper = false;

  @property({ type: Boolean, attribute: 'size-changer' }) sizeChanger = false;

  @property({ type: Boolean, attribute: 'column-chooser', reflect: true }) columnChooser = false;

  @property({ type: Boolean, attribute: 'select-all-rows' }) selectAllRowsDefault: boolean;

  @property({ type: Boolean, attribute: 'hide-header', reflect: true }) hideHeader = false;

  @property({ type: Boolean }) expandable = false;

  @property({ type: String, attribute: 'select-scope' }) selectScope: keyof typeof E_SELECT_SCOPE = E_SELECT_SCOPE.all;

  @property({ type: String, attribute: 'expand-mode' }) expandMode: E_EXPAND_MODO = E_EXPAND_MODO.multiple;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @property({ type: Object }) rowExpandable: (_: any) => E_EXPAND_TYPE = (_: any) => E_EXPAND_TYPE.active;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @property({ type: Object }) selectedRows: (_: any) => boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @property({ type: Object }) rowExpandRender = (_: any) =>
    html`<div>Placeholder. pls custom <b>rowExpandRender</b> method.</div>`;

  @property({ type: Boolean }) compact = false;

  /**
    * The property's name that is a unique key for each element in "data"
    * (e.g. "productId" or "id")
    *
   */
  @property({ type: String }) key?:string;

  @property({ type: Boolean }) contenteditable = false;

  @query('#table tbody') tbody: HTMLTableSectionElement | null;
  @query('sc-pagination') paginationEl: HTMLElement | null;

  connectedCallback() {
    super.connectedCallback();
    const root = this.renderRoot as any;
    
    // for fixing table overlap issue by listening sl-show, sl-after-hide event 
    // and change z-index of sticky element accordingly
    if (root) {
      root.onTablePopupShow = this.onTablePopupShow.bind(this);
      root.onTablePopupHide = this.onTablePopupHide.bind(this);
      root.addEventListener('sl-show', root.onTablePopupShow, { capture: true });
      root.addEventListener('sl-after-hide', root.onTablePopupHide, { capture: true });

      root.hidePopupsWhenOverlapped = throttle(this.hidePopupsWhenOverlapped, this, 50);

      // hanlde hide overlapped popups when scrolling and resizing
      this.shadowRoot?.host.addEventListener('scroll',  root.hidePopupsWhenOverlapped);
      window.addEventListener('resize',  root.hidePopupsWhenOverlapped);
    }

    try {
      // send the analytics request
      this._analytics?.publishEvent('sc-webkit-comp-load',{ name: 'sc-table' });
    } catch (error) {
      
    }
  }

  hidePopupsWhenOverlapped() {
    this?.popups?.forEach(popup => {
      if (
        popup?.hide && 
        (popup?.cell?.classList.contains('overlap') || !popup?.cell)
      ) {
        popup.hide();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const root = this.renderRoot as any;
    if (root) {
      root.removeEventListener('sl-show', root.onTablePopupShow);
      root.removeEventListener('sl-after-hide', root.onTablePopupHide);
    }
    this.shadowRoot?.host.removeEventListener('scroll', root.hidePopupsWhenOverlapped);
    window.removeEventListener('resize', root.hidePopupsWhenOverlapped);
  }

  yIntersectionObserver: IntersectionObserver;

  xIntersectionObserver: IntersectionObserver;

  // observe if sticky tds are overlapped in y-axis
  obeserveYOverlap() {
    if (this.yIntersectionObserver) {
      this.yIntersectionObserver.disconnect();
    }
    const theadHeight: number = this.shadowRoot?.querySelector('thead')?.clientHeight ?? 0;
    if (theadHeight) {
      this.yIntersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target?.classList.remove('overlap');
          } else {
            entry.target?.classList.add('overlap');
          }
        });
      },
      {
        root: this,
        threshold: 1,
        rootMargin: `-${theadHeight}px 0px 0px 0px`,
      });
      const tds = this.shadowRoot?.querySelectorAll('td.sticky-column') ?? [];
  
      for (let i = 0; i < tds.length; i++) {
        const td = tds[i];
        this.yIntersectionObserver.observe(td);
      }
    }
  }

  // observe if sticky tds and ths are overlapped in x-axis
  obeserveXOverlap() {
    if (this.xIntersectionObserver) {
      this.xIntersectionObserver.disconnect();
    }
    let rootMarginLeft = 0;
    let rootMarginRight = 0;
    const leftThs = this.shadowRoot?.querySelectorAll('th.sticky-left');
    const rightThs = this.shadowRoot?.querySelectorAll('th.sticky-right');

    leftThs?.forEach(th => rootMarginLeft += th.clientWidth);
    rightThs?.forEach(th => rootMarginRight += th.clientWidth);
    if (rootMarginLeft !== 0 || rootMarginRight !== 0) {
      this.xIntersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target?.classList.remove('overlap');
          } else {
            entry.target?.classList.add('overlap');
          }
        });
      },
      {
        root: this,
        threshold: 0.8,
        rootMargin: `0px -${rootMarginRight}px 0px -${rootMarginLeft}px`,
      });
      const tds = this.shadowRoot?.querySelectorAll('td:not(.sticky-column),th:not(.sticky-column)') ?? [];
  
      for (let i = 0; i < tds.length; i++) {
        const td = tds[i];
        this.xIntersectionObserver.observe(td);
      }
    }
  }

  obeserveOverlap() {
    this.obeserveYOverlap();
    this.obeserveXOverlap();
  }
  get tData() {
    const tRows = this.renderRoot.querySelectorAll(`#table tbody tr:not(.${E_S_C})`);
    const res = this.data as any;
    if (tRows.length) {
      Array.from(tRows).forEach((row, rowIndex) => {
        const tds = Array.from(row.querySelectorAll('td'));
        tds.forEach((td, colIndex) => {
          res[rowIndex][this.conf[colIndex].property] = this.stripExpressionMarkers(td.innerHTML);
        });
      });
    }
    return this.data;
  }
  get tConf() {
    const thead = this.renderRoot.querySelector<HTMLTableRowElement>('#table thead tr');
    const res = this.conf;
    if (thead) {
      const ths = thead.querySelectorAll<HTMLTableCellElement >('th');
      ths.forEach((th, index) => {
        res[index].header = eval(`() => html\`${this.stripExpressionMarkers(th.innerHTML)}\``);
        res[index].cell = eval('(value) => html`${value}`');
      });
    }
    return this.conf;
  }

  debounceGenerate = 0;

  get rowChoosers(): Array<ScCheckbox> {
    return Array.from(this.shadowRoot!.querySelectorAll('table tbody tr .chooser')) as Array<ScCheckbox>; // eslint-disable-line
  }

  get headerChooser(): ScCheckbox {
    return this.shadowRoot?.querySelector('table thead tr .chooser') as ScCheckbox;
  }
  focus() {
    const table = this.renderRoot.querySelector<HTMLTableElement>('#table');
    if (table) {
      table.focus();
    }
  }

  onTableFocus(e: Event) {
    this.internalEmit(INTERNAL_EVENTS['sc-table-focus'], {
      composed: false,
      bubbles: true,
      detail: {
        target: e.target,
      },
    });
  }
  onTableBlur(e: Event) {
    this.internalEmit(INTERNAL_EVENTS['sc-table-blur'], {
      composed: false,
      bubbles: true,
      detail: {
        target: e.target,
      },
    });
  }
  onTableClick(e: MouseEvent) {
    this.internalEmit(INTERNAL_EVENTS['sc-table-click'], {
      composed: false,
      bubbles: true,
      detail: {
        clientX: e.clientX,
        clientY: e.clientY,
        cell: this.seekParentElement(e.target as Element, ['th', 'td']),
      },
    });
    // used for open table operators
    e.stopPropagation();
  }

  popups = new Set<any>();

  onTablePopupShow(e: any) {
    for (const el of e.composedPath()) {
      if (el instanceof Element) {
        if (el.tagName === 'TD') {
          el.classList.add('popup-show');
          if (e.target?.hide) {
            e.target.cell = el;
            this.popups.add(e.target);
          }

          if (e.target?.tagName === 'SC-TOOLTIP' && el.classList.contains('sticky-column')) {
            el.classList.add('tooltip');
          }

          // when td is covered by th cell try to show popup at bottom
          if (el.classList.contains('overlap')) {
            e.target._placement = e.target.placement;
            e.target.placement = 'bottom';
          }
          break;
        }
        if (el.tagName === 'TH') {
          el.classList.add('popup-show');
          if (e.target?.tagName === 'SC-TABLE-HEADER-WITH-SORT' && el.classList.contains('overlap')) {
            el.classList.add('covered');
          }
          if (
            e.target?.tagName === 'SC-TABLE-FILTER' ||
            e.target?.tagName === 'SC-TABLE-HEADER-WITH-SORT'
          ) {
            const popup = e.target?.renderRoot?.querySelector('sl-dropdown');
            if (popup) {
              popup.cell = el;
              this.popups.add(popup);
            }
          }
          break;
        }
      }
    }
  }

  onTablePopupHide(e: any) {
    for (const el of e.composedPath()) {
      if (el instanceof Element) {
        if (el.tagName === 'TD') {
          el.classList.remove('popup-show'); 
          el.classList.remove('tooltip'); 
          if (e.target) {
            this.popups.delete(e.target);
            // revert placement
            if (e.target._placement) {
              e.target.placement = e.target._placement;
            }
          }
          break;
        }
        if (el.tagName === 'TH') {
          el.classList.remove('popup-show');
          el.classList.remove('covered');
          if (
            e.target?.tagName === 'SC-TABLE-FILTER' ||
              e.target?.tagName === 'SC-TABLE-HEADER-WITH-SORT'
          ) {
            const popup = e.target?.renderRoot?.querySelector('sl-dropdown');
            this.popups.delete(popup);
          }
          break;
        }
      }
    }
  }
  get finalizedTotal() {
    const parsedNum = Number.parseInt(this.total as any);
    return isNaN(parsedNum) ? 0 : parsedNum;
  }
  get datalength() {
    if (this.enablePagination && this.finalizedTotal) {
      return this.finalizedTotal;
    }
    return this.totalDataLength;
  }

  get hasRecords() {
    let hasRecords = false;
    if (this.data && this.data.length > 0) {
      hasRecords = true;
    }
    return hasRecords;
  }
  
  render() {
    const supporterHeight = this.hasRecords ? { flex: 1 } : {};
    const emptyHeight = this.hasRecords ? { } : { flex: 1 };
    return html`
      <table
      @focus=${this.onTableFocus}
      @blur=${this.onTableBlur}
      @click=${this.onTableClick}
      ?contenteditable=${this.contenteditable}
      id="table"
      class=${classMap({
    compact: this.compact,
  })}>
        <thead class=${classMap({ 'hide-header': this.hideHeader })}></thead>
        <tbody></tbody>
      </table>
      
      <div
        class="empty-content"
        style=${styleMap({
    display: this.hasRecords ? 'none' : 'block',
    position: 'sticky',
    left: 0,
    ...emptyHeight,
  })}
      >
        ${this.hasRecords ? nothing : html` <slot name="empty">
          <div style=${styleMap({
    display: 'grid',
    'place-content': 'center',
    height: '100%',
  })}>${msg('No available data', { id: 'sc-table-no-available-data' })}</div>
        </slot> `}
      </div>
      <div class="height-supporter" style=${styleMap(supporterHeight)}></div>
      
      <div class="sc-table-pagination-part">
        ${this.pagination && this.hasRecords
    ? html`<sc-pagination
              ?quick-jumper=${this.quickJumper}
              ?size-changer=${this.sizeChanger}
              total=${this.datalength}
              page-size=${this.pageSize}
              @sc-change=${this.pageChange}
              .currentPage=${this.selectedPage}
            ></sc-pagination>`
    : ''}
      </div>
    `;
  }

  async pageChange(event: CustomEvent) {
    const { page, pageSize } = event.detail;
    if (event.detail.pageSize !== this.pageSize) {
      this.pageSize = event.detail.pageSize;
    }
    this.selectedPage = page;
    this.generateData();
    await this.updateComplete;
    this.updateselectedSubTableData(true);
    this.updateChooser();
    this.updateChildTableSelectState();

    this.emit('sc-page-change', {
      detail: {
        page,
        pageSize,
      },
    });
  }

  updateSelectBaseSelectAll() {
    if (!this.columnChooser) {
      return;
    }
    if (typeof this.selectAllRowsDefault !== 'boolean') {
      return;
    }
    if (this.selectAllRowsDefault && !this.hasOperationOnChooser) {
      this.selectedData = [];
      this.data = this.data.map((d: any, index) => ({
        ...d,
        [KEY]: index,
      }));
      this.data.forEach((d: any) => {
        if (!this.selectedData.find((_: any) => _.index === d[KEY])) {
          this.selectedData.push({ index: d[KEY], data: d });
        }
      });
      this.selectedData = [...this.selectedData];
    }
    if (!this.selectAllRowsDefault && !this.hasOperationOnChooser) {
      this.selectedData = [];
    }
    this.updateselectedSubTableData();
  }
  updateBaseDefaultSelect() {
    if (this.columnChooser && this.selectedRows) {
      const _selectedData: Array<unknown> = [];
      this.data.forEach((d: any, index) => {
        if (this.selectedRows({ ...d, [KEY]: index })) {
          _selectedData.push({ index: d[KEY], data: d });
        }
      });
      this.selectedData = _selectedData;
      this.updateselectedSubTableData();
    }
  }
  differentiate(source: Map<string | number, Array<unknown>>, target: Map<string | number, Array<unknown>>) {
    const res = new Map<string | number, Array<unknown>>();
    for (const [rowId, tableData] of source) {
      // new add
      if (!target.has(rowId)) {
        res.set(rowId, tableData);
      }
    }
    return res;
  }

  updateChildTableSelectState() {
    if (!this.tbody) return;
    const removed = this.differentiate(this.previousSelectedSubTableData, this.selectedSubTableData);

    const expandedTr = Array.from(this.tbody.querySelectorAll<HTMLTableRowElement>(`.${E_S_C_SHOW}`));
    expandedTr.forEach(tr => {
      if (tr.dataset.rowId) {
        const newTableData = this.selectedSubTableData.get(tr.dataset.rowId);
        const tables = Array.from(tr.querySelectorAll('sc-table'));
        if (newTableData) {
          tables.forEach(table => {
            table.selectedRows = (rowData: any) => {
              return newTableData.some((_: any) => {
                return _.rowId === rowData.rowId;
              });
            };
          });
        }
        const deleteTableData = removed.get(tr.dataset.rowId);
        if (deleteTableData) {
          tables.forEach(table => {
            table.selectedRows = (rowData: any) => {
              return !deleteTableData.some((_: any) => {
                return _.rowId === rowData.rowId;
              });
            };
          });
        }

      }
    });
  }

  resetPhysicalTableItems () {
    this.table.forEach((line: TableElement) => {
      this.cleanEventsOfTr(line);
      if (line?.element?.parentNode) {
        line.element.parentNode.removeChild(line.element);
      }
    });
  }
  toggleColumnChooser() {
    if (this.headerChooser && this.rowChoosers.length) {
      const choosers = [this.headerChooser].concat(this.rowChoosers);
      choosers.forEach(chooser => {
        const cell = chooser.parentElement;
        if (cell) {
          cell.style.display = cell.style.display === 'none' ? 'table-cell' : 'none';
        }
      });
      const newConf = this.finalizeConf(this.conf, {
        isExpandable: this.expandable
          ? E_EXPAND_TYPE.active
          : E_EXPAND_TYPE.inactive,
        trigger: 'updateHeaders',
      });
      const visibleHeaders = this.headers.filter(header => header.style.display !== 'none');
      const visibleTable = this.table.map(t => t.columns.filter(header => header.style.display !== 'none'));
      newConf.filter(conf => {
        if (conf.property === CHOOSER_PROPERTY) {
          return visibleHeaders.length ===  newConf.length;
        }
        return true;
      }).forEach((conf, index) => {
        this.setColumnSticky(visibleHeaders[index], conf, true);
        visibleTable.forEach(t => {
          this.setColumnSticky(t[index], conf);
        });
        
      });
    }
  }

  updated(properties: PropertyValues<this>) {
    if (properties.has('columnChooser')) {
      this.toggleColumnChooser();
      this.updateSelectBaseSelectAll();
    }
    if (properties.has('pageSize')) {
      this.resetPhysicalTableItems();
    }
    if (properties.has('conf')
     || properties.has('stickyHeader')
     || properties.has('sort')
     || properties.has('compact')) {
      const confs = [...this.conf].filter(c => !c.hidden);
      this.updateHeaders(confs);
    }

    // Data or conf change we have to generate the table
    if ((properties.has('data') && JSON.stringify(properties.get('data')) !== JSON.stringify(this.data))
      || (properties.has('conf') && JSON.stringify(properties.get('conf')) !== JSON.stringify(this.conf))
      || properties.has('selectedRows')
      || properties.has('total')
      || properties.has('pageSize')
      || properties.has('selectAllRowsDefault')
    ) {
      this.updateBaseDefaultSelect();
      this.generateData();
      this.updateSelectBaseSelectAll();
    }

    if (properties.has('selectedSubTableData')) {
      this.updateChildTableSelectState();
    }

    setTimeout(()=>{
      this.obeserveOverlap();
    },0);
  }

  updateChooser() {
    if (this.isSelectAllScope) {
      this.selectAll = this.isAllRowsSelected;
    }
    if (this.isSelectPageScope) {
      this.selectAll = this.showData.length > 0 && this.showData.every((d: any) => {
        return !!this.selectedData.find((_: any) => _.index === d[KEY]);
      });
    }
    
    if (this.headerChooser) {
      this.headerChooser.checked = this.selectAll;
    }
    if (this.rowChoosers?.length) {
      this.rowChoosers.forEach(choose => {
        choose.checked = !!this.selectedData.find((_: any) => {
          const chooseIndex = choose.getAttribute('index');
          return chooseIndex ? _.index === +chooseIndex : false;
        });
      });
    }
  }
  
  // ANA: useful for contenteditable
  cleanLitPart(td: HTMLTableCellElement) {
    if (!this.contenteditable) return;
    const litPart = (td as any)['_$litPart$'];
    if (litPart && litPart._$clear) {
      litPart._$clear();
      this.removeAllNodes(td);
    }
    (td as any)['_$litPart$'] = undefined;
  }

  renderCell(
    item: any, 
    td: HTMLTableCellElement, 
    conf: Conf, 
    event?: Event, 
    listIndex?: number
  ) {
    const confProperty = conf.property;
    const cellConf = conf.cell;
    if (cellConf && typeof cellConf === 'function') {
      this.cleanLitPart(td);
      render(cellConf(
        this.extractData(item, confProperty), item
      ), td);
    } else if (confProperty === CHOOSER_PROPERTY) {
      if (listIndex !== undefined) {
        const chooser = this.renderRowChooser(listIndex, item);
        const checkboxEle = td.querySelector('sc-checkbox');
        if (checkboxEle) {
          td.removeChild(checkboxEle);
        }
        td.style.paddingTop = '13px';
        if (!this.columnChooser) {
          td.style.display = 'none';
        }
        td.appendChild(chooser);
      }
    } else if (confProperty === NON_EXPAND_KEY) {
      this.setPlaceholderFor(td);
    } else if (confProperty === EXPAND_KEY) {
      this.setIconFor(td, item);
    } else if (confProperty) {
      render(this.extractData(item, confProperty), td);
    }
  }

  renderHtml(
    conf: Conf, 
    lineIndex: number, 
    item: any, 
    td: HTMLTableCellElement, 
    tr: HTMLTableRowElement, 
    listIndex: number
  ) {
    this.renderCell(item, td, conf, undefined, listIndex);
    this.setColumnSticky(td, conf);
    tr.appendChild(td);
  }

  cleanEventsOfTr(item: any) {
    item.events.forEach((event: EventOfTr) => item.element.removeEventListener(event.type, event.event));
  }

  createEventsOfTr(tr: HTMLTableRowElement, item: any): Array<EventOfTr> {
    const trOverEvent = this.trHover.bind(this, item);
    const trOutEvent = this.trOut.bind(this, item);
    const trClickEvent = this.trClick.bind(this, item, tr);
    tr.addEventListener('mouseover', trOverEvent);
    tr.addEventListener('mouseout', trOutEvent);
    tr.addEventListener('click', trClickEvent);
    return [
      { type: 'mouseover', event: trOverEvent }, 
      { type: 'mouseout', event: trOutEvent }, 
      { type: 'click', event: trOutEvent }, 
    ];
  }

  cleanTrElements() {
    const splices = this.table.splice(this.showData.length);

    splices.forEach((line: TableElement) => {
      this.cleanEventsOfTr(line);
      if (line?.element?.parentNode) {
        line.element.parentNode.removeChild(line.element);
      }
    });
  }

  cleanTdElements(confs: Array<Conf>) {
    [...this.table].forEach(line => {
      const splicedColumns = line.columns.splice(confs.length);

      splicedColumns.forEach(column => {
        line.element.removeChild(column);
      });
    });
  }

  renderHeaderChooser() {
    const checked = this.selectAll;
    const ele = document.createElement('sc-checkbox');
    ele.classList.add('chooser');
    ele.compact = true;
    ele.checked = checked;
    // @ts-ignore
    ele.addEventListener('sc-change', this.handleHeaderChooser.bind(this));
    return ele;
  }

  private get isSelectAllScope() {
    return this.selectScope === E_SELECT_SCOPE.all;
  }
  private get isSelectPageScope() {
    return this.selectScope === E_SELECT_SCOPE.page;
  }
  private get isAllRowsSelected() {
    if (this.datalength > 0) {
      return this.data.slice(0, this.datalength).every((d: any) => {
        return this.selectedData.find((_d: any) => _d.index === d[KEY]);
      });
    }
    return false;
  }

  handleHeaderChooser(event: CustomEvent) {
    const { checked } = event.detail;
    this.selectAll = checked;
    this.hasOperationOnChooser = true;

    if (checked) {
      if (this.isSelectAllScope) {
        this.selectedData = this.data.map((d: any) => ({ index: d[KEY], data: d }));
      }
      if (this.isSelectPageScope) {
        this.showData.forEach((d: any) => {
          if (!this.selectedData.find((_: any) => _.index === d[KEY])) {
            this.selectedData.push({ index: d[KEY], data: d });
          }
        });
        this.selectedData = [...this.selectedData];
      }
      
    } else {
      if (this.isSelectAllScope) {
        this.selectedData = [];
      }
      if (this.isSelectPageScope) {
        this.selectedData = this.selectedData.filter((d: any) => {
          return !this.showData.find((_: any) => _[KEY] === d.index);
        });
      }
    }
    this.updateselectedSubTableData();
    this.afterSelected(E_SELECT_TRIGGER.header);
  }

  renderRowChooser(index: number, data: any) {
    const checked = !!this.selectedData.find((d: any) => d.index === index);
    const ele = document.createElement('sc-checkbox');
    ele.classList.add('chooser');
    ele.compact = true;
    ele.checked = checked;
    ele.setAttribute('index', `${index}`);
    // @ts-ignore
    ele.addEventListener('sc-change', (event: CustomEvent) => this.handleRowChooser(event, index, data));
    return ele;
  }

  handleRowChooser(event: CustomEvent, index: number, data: any) {
    const { checked } = event.detail;
    this.hasOperationOnChooser = true;
    const _index = this.selectedData.findIndex((d: any) => d.index === index);
    if (checked) {
      if (_index === -1) {
        this.selectedData.push({ index: data[KEY], data });
      }
    } else {
      if (_index > -1) {
        this.selectedData.splice(_index, 1);
      }
    }
    this.selectedData = [...this.selectedData];
    this.updateselectedSubTableData();
    this.afterSelected(E_SELECT_TRIGGER.row, data, checked);
  }

  updateselectedSubTableData(doNotClear?: boolean) {
    if (!this.expandable) {
      return;
    }
    this.previousSelectedSubTableData = new Map(this.selectedSubTableData);
    if (!doNotClear) {
      this.selectedSubTableData.clear();
    }
    this.selectedData.forEach((data: any) => {
      const curData = data.data;
      const accordingTr = this.expansiveSlotTrCatch.get(curData.rowId);
      if (accordingTr) {
        const subTables = accordingTr?.querySelectorAll('sc-table');
        
        const dataOfTable: unknown[] = [];
        subTables.forEach(table => {
          dataOfTable.push(...table.data);
        });
        this.selectedSubTableData.set(curData.rowId, dataOfTable);
      }
    });
    this.selectedSubTableData = new Map(this.selectedSubTableData);
  }
  @watch('selectedData')
  onSelectedDataChange() {
    this.updateChooser();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterSelected(trigger: E_SELECT_TRIGGER, data?: any, checked?: boolean) {
    // ANA: can not return all data in select all mode
    // ANA: cause there is no way to get data untill switch page
    let subTableMeta = {};
    const filteredMap = new Map(Array.from(this.selectedSubTableData).filter(d => d[1].length > 0));
    if (filteredMap.size) {
      subTableMeta = {
        selectedSubTableData: filteredMap,
      };
    }
    
    this.emit('sc-select', {
      detail: {
        selectAll: this.isAllRowsSelected,
        selectedData: this.selectedData,
        currentData: data,
        checked,
        ...subTableMeta,
      },
    });
  }
  get fixedLeftStartPos() {
    let pos = 0;
    if (this.expandable) pos += 45;
    if (this.columnChooser) pos += 45;
    return pos;
  }
  get fixedRightStartPos() {
    return 0;
  }

  getColumnWidth(conf: Conf) {
    if (!conf.columnStyle || typeof conf.columnStyle !== 'string') {
      return null;
    }
    const relatedWidths = conf.columnStyle.match(/(min-)?width:\s*(\S+?)px/g) || [];
    const widthStyle = relatedWidths.slice(-1)[0];
    const width = widthStyle?.match(/\d+/g);
    return width ? +width[0] : null;
  }

  attachFixPos(conf: Conf, fixedManner: typeof fixedManners[number], lastPos: number) {
    if (fixedManner === conf.pinned) {
      const width = this.getColumnWidth(conf);
      if (width) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        conf.metadata![fixedManner] = lastPos;
      } else {
        return E_ATTACH_OUTPUT.noWidth;
      }
      return lastPos + width;
    }
    return E_ATTACH_OUTPUT.noFixed;
  }
  
  mutateForFixed(confs: Array<Conf>) {
    let leftStartPos = this.fixedLeftStartPos;
    let rightStartPos = this.fixedRightStartPos;
    let isEnableFixed = false;
    confs.some(conf => {
      if (conf.pinned && fixedManners.includes(conf.pinned)) {
        isEnableFixed = true;
        return true;
      }
    });
    if (!isEnableFixed) {
      return;
    }
    const len = confs.length;

    const errorsOfLeft = [];
    const errorsOfRight = [];
    let lastLeftPinnedIdx = -1;
    let lastRightPinnedIdx = -1;
    for (let i = 0; i < len; ++i) {
      const conf = confs[i];
      const latestPos = this.attachFixPos(conf, fixedMannersMap.left, leftStartPos);
      if (latestPos === E_ATTACH_OUTPUT.noWidth) {
        errorsOfLeft.push(i);
      } else if (latestPos !== E_ATTACH_OUTPUT.noFixed) {
        leftStartPos = latestPos;
        lastLeftPinnedIdx = i;
      }
    }
    for (let i = len - 1; i >= 0; --i) {
      const conf = confs[i];
      const latestPos = this.attachFixPos(conf, fixedMannersMap.right, rightStartPos);
      
      if (latestPos === E_ATTACH_OUTPUT.noWidth) {
        errorsOfRight.push(i);
      } else if (latestPos !== E_ATTACH_OUTPUT.noFixed) {
        lastRightPinnedIdx = i;
        rightStartPos = latestPos;
      }
    }
    if (lastLeftPinnedIdx !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      confs[lastLeftPinnedIdx].metadata!.fixedStyle = true;
    }
    if (lastRightPinnedIdx !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      confs[lastRightPinnedIdx].metadata!.fixedStyle = true;
    }
    [...errorsOfLeft, ...errorsOfRight].forEach(index => {
      this.log.warn(
        `Please set pinned and add columnStyle(width) on the column ${index + 1} 
        at the same time if you want to make it fixed`
      );
    });
  }

  finalizeConf(confs: Array<Conf>, {
    isExpandable,
    trigger,
  }: {
    isExpandable: E_EXPAND_TYPE,
    trigger?: string
  }): Array<Conf> {
    confs.forEach(conf => conf.metadata = conf.metadata || {});
    if (trigger === 'updateHeaders') {
      this.mutateForFixed(confs);
    }
    const hasLeftFixed = confs.some(conf => typeof conf.metadata?.left === 'number');
    const prefix = [];
    this.expandable && prefix.push({
      property: isExpandable !== E_EXPAND_TYPE.inactive ? EXPAND_KEY : NON_EXPAND_KEY,
      header: '',
      metadata: hasLeftFixed ? { left: 0 } : {},
    });
    prefix.push({
      property: CHOOSER_PROPERTY,
      header: '',
      metadata: hasLeftFixed ? { left: this.expandable ? 45 : 0 } : {},
    });
    return ([] as any[]).concat(prefix, confs);
  }

  setPlaceholderFor(cell: HTMLTableCellElement) {
    render(cellPlaceholder, cell);
  }
  
  createIcon(name: string, item: any) {
    return html`
      <div class=${CELL_ICON} data-id="${CELL_ICON}-${item[KEY]}">
          <sc-icon data-id="${CELL_ICON}-${item[KEY]}" @click=${() => {
  this.handleExpand(item);
}} .name=${name}></sc-icon>
      </div>
    `;
  }
  setIconFor(cell: HTMLTableCellElement, item: any) {
    render(this.createIcon('arrow-ios-downward', item), cell);
  }

  updateHeaders(confs: Array<Conf>) {
    if (this.shadowRoot) {
      let tr = this.shadowRoot.querySelector<HTMLTableRowElement>('table thead tr');
      if (!tr) {
        tr = document.createElement('tr');
      }
      if (this.lastConfSize > confs.length) {
        [...this.headers].forEach((header, i) => {
          if (i <= (this.lastConfSize)) {
            if (tr) {
              tr.removeChild(header);
            }
            this.headers.splice(i, 1);
          }
        });
      }
      const columns = this.finalizeConf(confs, { 
        isExpandable: E_EXPAND_TYPE.inactive,
        trigger: 'updateHeaders',
      });
      columns.forEach((conf: Conf, i: number) => {
        const p = conf.property;
        let th: HTMLTableHeaderCellElement;
        if (this.headers[i]) {
          th = this.headers[i];
        } else {
          th = document.createElement('th');
          this.headers.push(th);
        }
        th.classList.toggle('sticky', this.stickyHeader);
        th.classList.add(this.layer['low-ground']);
        th.setAttribute('style', conf.columnStyle || '');
        if (p === NON_EXPAND_KEY) {
          this.setPlaceholderFor(th);
        } else if (p === CHOOSER_PROPERTY) {
          const chooser = this.renderHeaderChooser();
          const checkboxEle = th.querySelector('sc-checkbox');
          if (checkboxEle) {
            th.removeChild(checkboxEle);
          }
          th.style.paddingTop = '10px';
          if (!this.columnChooser) {
            th.style.display = 'none';
          }
          th.appendChild(chooser);
        } else {
          let header = typeof conf.header === 'function' ? conf.header() : conf.header;
          if (conf.sort) {
            header = html`
              <sc-table-header-with-sort
                data-property="${p}"
                @sc-direction-changed="${this.handleSortDirectionChanged.bind(this, p)}"
                .direction="${this.getSortDirection(conf.sort, p)}">
                ${header}
              </sc-table-header-with-sort>
            `;
          }
          if (conf.filter) {
            header = html`
              ${header}
              ${guard([this.compact, this.stickyHeader, this.conf], () => {
    return html`
                <sc-table-filter
                .compact=${this.compact}
                @sc-filter=${(e: CustomEvent) => {
    this.expandedRowsIndex.clear();
    this.emit('sc-filter', {
      detail: { value: e.detail.value, property: p },
    });
  }}
                .lookup=${conf.filterParams?.lookup}
                .options=${[...new Set(this.data
    .map((d: any) => d[p]).filter(Boolean))]
    .map(_ => ({ label: _, value: _ }))}
              ></sc-table-filter>`;
  })}
            `;
            
          }
          
          const space = this.compact ? '4px' : '14px';
          th.style.paddingTop = space;
          th.style.paddingBottom = space;
          th.classList.add('normal-th');
          
          render(header, th);
        }
        if (tr) {
          this.setColumnSticky(th, conf, true);
          tr.appendChild(th);
        }
      });
      if (this.shadowRoot) {
        const thead = this.shadowRoot.querySelector('thead');
        if (thead) {
          thead.appendChild(tr);
        }
      }
    }
  }

  setColumnSticky(el?: HTMLElement, conf?: Conf, isHeader?: boolean) {
    if (!el || !conf) {
      return;
    }
    if (el && el.classList) {
      el.classList.remove('fixed-line-right');
      el.classList.remove('fixed-line-left');
    }
    let layer = this.layer['medium-ground'];
    if (isHeader) {
      // ANA: no way to make popup correct for now. 
      // ANA: have to refactor dropdown or others component with popup
      if (this.stickyHeader) {
        layer = this.layer['medium-sky'];
      }
    }
    if (typeof conf.metadata?.left === 'number') {
      if (conf.metadata.fixedStyle) {
        el.classList.add('fixed-line-right');
      }
      el.classList.add('sticky-column');
      el.classList.add('sticky-left');
      
      el.classList.add(layer);
      el.style.position = 'sticky';
      el.style.left = `${conf.metadata?.left}px`;
    }
    if (typeof conf.metadata?.right === 'number') {
      if (conf.metadata.fixedStyle) {
        el.classList.add('fixed-line-left');
      }
      el.classList.add('sticky-column');
      el.classList.add('sticky-right');
      el.classList.add(layer);
      el.style.position = 'sticky';
      el.style.right = `${conf.metadata?.right}px`;
    }
  }

  dispatchCustomEvent(key: string, { detail }: CustomEvent): any {
    this.dispatchEvent(new CustomEvent(key, { detail }));
  }

  trCreated(tr: HTMLTableRowElement, lineIndex: number, item: any) {
    this.emit('sc-tr-create', {
      detail: { tr, lineIndex, item },
    });
  }

  previousLiftedLayer: Element;
  trClick(item: any, rowEl: HTMLTableRowElement, e: Event) {
    this.emit('sc-tr-tap', {
      detail: {
        value: item,
        element: rowEl,
      },
    });
  }
  trHover(item: any) {
    this.emit('sc-tr-mouseover', {
      detail: item,
    });
  }

  trOut(item: any) {
    this.emit('sc-tr-mouseout', {
      detail: item,
    });
  }

  private get enablePagination() {
    return this.pagination;
  }

  rowsIndexChange(operator: 'add' | 'delete', index: number) {
    if (this.expandMode === E_EXPAND_MODO.singleOnly) {
      this.expandedRowsIndex.clear();
    }
    this.expandedRowsIndex[operator](index);
  }

  handleExpand(item: any) {
    this.hasExpandedManually = true;
    let showDataIndex = item[KEY];
    if (this.enablePagination) {
      showDataIndex = item[KEY] % this.pageSize;
    }
    const expandedEl = this.table[showDataIndex]?.expandedEl as HTMLElement;
    if (expandedEl) {
      const expandedElIndex = expandedEl.dataset.trSlot as string;
      // !store order index, not show data index.
      if (expandedEl.classList.toggle(E_S_C_SHOW)) {
        this.rowsIndexChange('add', +expandedElIndex);
      } else {
        this.rowsIndexChange('delete', +expandedElIndex);
      }
      this.activateExpandedSlot();
    }
    this.emit('sc-tr-expanded', {
      detail: { value: item },
    });
  }

  private genMapByDataset(key: string, elements: NodeListOf<HTMLElement>) {
    const map = new Map<number, HTMLElement>();
    elements.forEach(el => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map.set(+el.dataset[key]!, el);
    });
    return map;
  }

  activateExpandedSlot() {
    if (!this.expandable) return;
    if (!this.tbody) return;
    const trs = this.tbody?.querySelectorAll<HTMLTableCellElement>('tr[data-list-index]');
    const expandTrs = this.tbody.querySelectorAll<HTMLTableCellElement>('tr[data-tr-slot]');
    const trMap = this.genMapByDataset('listIndex', trs);
    const expandTrMap = this.genMapByDataset('trSlot', expandTrs);
    
    trs.forEach(tr => {
      const icon = tr.querySelector(`.${CELL_ICON}`);
      icon?.classList.remove(CELL_ICON_EXPANDED);
    });
    expandTrs.forEach(tr => {
      tr.classList.remove(E_S_C_SHOW);
    });
    this.expandedRowsIndex.forEach(index => {
      this.activateExpandedIcon(trMap.get(index));
      this.activateExpandedRow(expandTrMap.get(index));
    });
    this.updateChildTableSelectState();
  }
  activateExpandedIcon(row: HTMLElement | undefined) {
    if (!row) return;
    const icon = row.querySelector(`.${CELL_ICON}`);
    if (!icon) return;
    icon.classList.add(CELL_ICON_EXPANDED);
  }
  activateExpandedRow(row: HTMLElement | undefined) {
    if (!row) return;
    const slotWrapper = row.querySelector<HTMLElement>(`.${SLOT_WRAPPER}`);
    if (!slotWrapper) return;
    row.classList.add(E_S_C_SHOW);
  }

  createTr(lineIndex: number, item: any, listIndex: number, isExpandable: E_EXPAND_TYPE) {
    const tr = this.setKeyToTr(document.createElement('tr'), item);
    if (!this.table[lineIndex]) {
      this.table[lineIndex] = {
        element: tr,
        columns: [],
        events: this.createEventsOfTr(tr, item),
        expandedEl: isExpandable !== E_EXPAND_TYPE.inactive ? this.makeSlotTr(listIndex, item.rowId) : null,
      };
    }
    return tr;
  }

  createTd(lineIndex: number) {
    const td = document.createElement('td') as HTMLTableCellElement;
    this.table[lineIndex].columns.push(td);
    return td;
  }

  setKeyToTr(tr: HTMLTableRowElement, item: any) {
    if (this.key && Object.prototype.hasOwnProperty.call(item, this.key)) {
      const data = this.extractData(item, this.key);
      tr.classList.add(`key-${data}`);
    }
    return tr;
  }

  updateBody(confs: Array<Conf>) {
    if (this.data !== undefined) {

      if (this.lastConfSize > confs.length) {
        this.cleanTdElements(confs);
      }
      this.cleanTrElements();
      let tbody: HTMLTableSectionElement | null;
      if (this.shadowRoot) {
        tbody = this.shadowRoot.querySelector('tbody');
        this.removeSlot(tbody);
      }
      this.showData.forEach((item: any, lineIndex: number) => {
        let tr: HTMLTableRowElement;
        const listIndex = this.data.findIndex((d: any) => d[KEY] === item[KEY]);
        const isExpandable = this.rowExpandable(item);
        if (this.table[lineIndex]) {
          this.cleanEventsOfTr(this.table[lineIndex]);
          tr = this.table[lineIndex].element;
          tr.className = '';
          tr = this.setKeyToTr(tr, item);
          this.table[lineIndex].events = this.createEventsOfTr(tr, item);
          this.table[lineIndex].expandedEl = isExpandable ? this.makeSlotTr(listIndex, item.rowId) : null;
        } else {
          tr = this.createTr(lineIndex, item, listIndex, isExpandable);
        }
        tr.setAttribute('data-list-index', String(listIndex));

        this.trCreated(tr, lineIndex, item);

        const columns = this.finalizeConf(confs, { isExpandable });
        columns.forEach((conf, columnIndex) => {
          let td;
          const existedTd = this.table[lineIndex].columns[columnIndex];
          if (existedTd) {
            td = existedTd;
          } else {
            td = this.createTd(lineIndex);
          }

          td.setAttribute('style', conf.columnStyle || '');
          this.renderHtml(conf, lineIndex, item, td, tr, listIndex);
        });

        
        if (tbody) {
          tbody.appendChild(tr);
          if (this.table[lineIndex].expandedEl !== null) {
            tbody.appendChild(this.table[lineIndex].expandedEl as HTMLElement);
          }
        }
      });
    }
  }
  makeSlotTr(listIndex: number, rowId: string) {
    const cacheId = rowId || listIndex;
    const cachedTr = this.expansiveSlotTrCatch.get(cacheId);
    if (cachedTr) {
      return cachedTr;
    }
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const slotWrapper = document.createElement('div');
    slotWrapper.classList.add(SLOT_WRAPPER);
    td.setAttribute('colspan', '999');
    td.appendChild(slotWrapper);
    tr.appendChild(td);
    
    
    tr.classList.add(E_S_C);
    tr.dataset.trSlot = `${listIndex}`;
    tr.dataset.rowId = (this.data[listIndex] as any).rowId;
    this.expansiveSlotTrCatch.set(cacheId, tr);

    
    render(this.rowExpandRender({
      ...(this.data[listIndex] as any),
      [KEY]: listIndex,
    }), slotWrapper);
    const tables = Array.from(slotWrapper.querySelectorAll('sc-table'));
    tables.forEach(table => {
      table.addEventListener('sc-select', (e: any) => {
        const selectAll = e.detail.selectAll;
        const rowData = this.data[listIndex] as any;
        if (selectAll) {
          if (!this.selectedData.find((_: any) => _.data.rowId === rowData.rowId)) {
            this.selectedData = [...this.selectedData, { index: rowData[KEY], data: rowData }];
          }
        } else {
          this.selectedData = this.selectedData.filter((_: any) => {
            return _.data.rowId !== rowData.rowId;
          });
        }

        this.previousSelectedSubTableData = new Map(this.selectedSubTableData);
          
        this.selectedSubTableData.set(rowData.rowId, e.detail.selectedData.map((_: any) => _.data));

        this.selectedSubTableData = new Map(this.selectedSubTableData);
        
        
        this.afterSelected(E_SELECT_TRIGGER.nestedTable);
        
      });
    });

    return tr;
  }
  isExpansiveSlot(cell: HTMLTableCellElement) {
    return cell.classList.contains(E_S_C);
  }
  removeSlot(table: HTMLTableSectionElement | null) {
    if (!table) return;
    const trSlots = table.querySelectorAll(`.${E_S_C}`);
    trSlots.forEach(slot => slot.parentElement?.removeChild(slot));
  }


  setLoading(loading: boolean) {
    this.emit('sc-loading', {
      detail: { value: loading },
    });
  }

  async generateData() {
    this.setLoading(true);
    await this.updateComplete;
    const confs = [...this.conf].filter(c => !c.hidden);
    this.data = this.data.map((d: any, index) => ({
      ...d,
      [KEY]: index,
    }));
    if (!this.hasExpandedManually && this.expandable) {
      this.data.forEach((item: any) => {
        const expandType = this.rowExpandable(item);
        if (expandType === E_EXPAND_TYPE.activated) {
          this.rowsIndexChange('add', item[KEY]);
        }
      });
    }
    if (this.enablePagination) {
      // Use all data for current page only, control by user
      // when has total and total bigger than data.length
      if (this.finalizedTotal && this.finalizedTotal > this.totalDataLength) {
        this.showData = this.data.slice(0, this.pageSize);
      } else {
        this.showData = this.data.slice(
          (this.selectedPage - 1) * this.pageSize,
          Math.min(this.selectedPage * this.pageSize, this.datalength)
        );
      }
    } else {
      this.showData = [...this.data];
    }
    this.updateBody(confs);
    this.activateExpandedSlot();
    if (this.data !== undefined) {
      this.lastConfSize = confs.length;
      this.totalDataLength = this.data.length;
    }
    if (this.enablePagination) {
      this.selectedPage = Math.max(Math.min(this.selectedPage, Math.ceil(this.datalength / this.pageSize)), 1);
    }
    this.setLoading(false);
  }

  extractData(item: any, columnProperty: string) {
    if (columnProperty) {
      const splittedProperties = columnProperty.split('.');
      if (splittedProperties.length > 1) {
        return splittedProperties.reduce((prevRow: any, p: string) => {
          if (typeof prevRow === 'string' && item[prevRow] !== undefined && item[prevRow][p] !== undefined) {
            return item[prevRow][p];
          }

          return prevRow[p] || '';
        });
      }
      return item[columnProperty];
    }
    return null;
  }

  getSortDirection(sort: boolean, p: string): TDirection {
    if (sort) {
      const splittedSort = this.sort.split(',');
      if (splittedSort) {
        if (splittedSort[0] === p) {
          return splittedSort[1] as TDirection;
        }
      }
    }
    return TDirection.none;
  }

  handleSortDirectionChanged(p: string, { detail }: CustomEvent<{value: string}>) {
    const splittedSort = this.sort.split(',');
    if (detail.value) {
      this.sort = `${p},${detail.value}`;
      this.emit('sc-sort', {
        detail: { value: this.sort }, 
      });
    } else if (splittedSort && splittedSort[0] === p) {
      this.sort = '';
      this.emit('sc-sort', {
        detail: { value: this.sort }, 
      });
    }
  }
}
