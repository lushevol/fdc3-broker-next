import type { Context } from '../Context.js';
import { Base } from './Base.js';
import type { ScTable } from '../../ScTable/ScTable.js';
import { TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { E_OPERATORS, MARKS } from '../constant.js';

type TInsertConf = {
  property: string;
  insertIndex?: number;
  columnStyle?: string;
  header: () => TemplateResult<1>;
  cell: (v: any) => TemplateResult<1>;
};

export class Viewer extends Base {
  constructor(public context: Context) {
    super();
    this.context = context;
  }
  focus() {
    this.context.option.viewer.focus();
  }
  getEditableContent() {
    return this.context.option.viewer.shadowRoot?.querySelector('#content');
  }
  createPlaceholder(id: string) {
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    p.classList.add(id);
    return p;
  }
  isValidContainer(sCmd: string, value?: string) {
    const focusedElement = this.context.option.viewer.focusedElement;
    const isTable =
      focusedElement && focusedElement?.tagName?.toLowerCase() === 'sc-table';
    if (
      sCmd === 'insertHTML' &&
      value?.includes(MARKS.injectedTablePlaceholder) &&
      isTable
    ) {
      return false;
    }
    return true;
  }
  async updateTable({
    elId,
    rowCount,
    colCount,
  }: {
    elId: string;
    rowCount: number;
    colCount: number;
  }) {
    await this.context.option.viewer.updateComplete;
    const colArr = this.context.option.viewer.createArray(colCount);
    const rowArr = this.context.option.viewer.createArray(rowCount);
    let maximumCallTimes = 10;
    const _updateTable = () => {
      const tableEl = this.context.option.viewer.content.querySelector<ScTable>(
        `#${elId}`
      );
      if (tableEl) {
        const table = document.createElement('sc-table');
        table.classList.add(elId);
        table.contenteditable = true;
        table.compact = true;

        const conf = colArr.map((_, index) => ({
          property: `property_${index}`,
          header: () =>
            html`${unsafeHTML(this.context.option.viewer.placeholder)}`,
          cell: () =>
            html`${unsafeHTML(this.context.option.viewer.placeholder)}`,
        }));

        const data = rowArr.map(() =>
          colArr.reduce((res, cur, index) => {
            return { ...res, [`property_${index}`]: `property_${index}` };
          }, {})
        );
        table.conf = conf;
        table.data = data;

        const replacedEls: Element[] = [table];
        if (
          !tableEl.nextElementSibling ||
          tableEl.nextElementSibling.tagName.toLowerCase() === 'sc-table'
        ) {
          replacedEls.push(this.createPlaceholder(elId));
        }
        tableEl.replaceWith(...replacedEls);
        this.finalizeTableMetadata(table);
        // asynchronous invoke on-input
        this.context.option.viewer.onChange();
      } else {
        if (maximumCallTimes > 0) {
          --maximumCallTimes;
          this.context.option.viewer.animationFrame.run(_updateTable);
        }
      }
    };
    this.context.option.viewer.animationFrame.run(_updateTable);
    this.context.invoke('viewer.focus');
  }
  async iterateTable(
    table: ScTable,
    callback: {
      rowCb?: (row: HTMLTableCellElement, rowIndex: number) => void;
      headerRowCb?: (row: HTMLTableCellElement, rowIndex: number) => void;
      headerCellCb?: (
        cell: HTMLTableCellElement,
        colIndex: number,
        rowIndex: number
      ) => void;
      cellCb?: (
        cell: HTMLTableCellElement,
        colIndex: number,
        rowIndex: number
      ) => void;
    }
  ) {
    const {
      rowCb = this.context.option.viewer.noop,
      cellCb = this.context.option.viewer.noop,
      headerRowCb = this.context.option.viewer.noop,
      headerCellCb = this.context.option.viewer.noop,
    } = callback;
    await this.context.option.viewer.isAllUpdateComplete(table);
    const nativeTable = table.shadowRoot?.querySelector('table');
    if (nativeTable) {
      const rows = Array.from(
        nativeTable.querySelectorAll<HTMLTableCellElement>('tbody tr')
      ).filter(row => !table.isExpansiveSlot(row));
      const headers = Array.from(
        nativeTable.querySelectorAll<HTMLTableCellElement>('thead tr')
      );
      // thead
      headers.forEach((rowOfHeader, rowIndex) => {
        headerRowCb(rowOfHeader, rowIndex);
        const cellsPerHeaderRow = Array.from(
          rowOfHeader.querySelectorAll('th')
        ).filter(th => !th.querySelector('.chooser'));
        cellsPerHeaderRow.forEach((cell, colIndex) => {
          headerCellCb(cell, colIndex, rowIndex);
        });
      });
      // tbody
      rows.forEach((row, rowIndex) => {
        rowCb(row, rowIndex);
        const cellsPerRow = Array.from(row.querySelectorAll('td')).filter(
          cell => !cell.querySelector('.chooser')
        );
        cellsPerRow.forEach((cell, colIndex) => {
          cellCb(cell, colIndex, rowIndex);
        });
      });
    }
  }
  finalizeTableMetadata(table: ScTable) {
    this.iterateTable(table, {
      cellCb(cell, colIndex, rowIndex) {
        cell.setAttribute('row-index', String(rowIndex));
        cell.setAttribute('col-index', String(colIndex));
      },
      headerCellCb(cell, colIndex, rowIndex) {
        cell.setAttribute('row-index', String(rowIndex));
        cell.setAttribute('col-index', String(colIndex));
      },
    });
  }
  get activeCell(): HTMLTableCellElement {
    return this.context.option.viewer.activeCell;
  }
  get activeRowIndex() {
    return Number(this.activeCell.getAttribute('row-index') ?? 'none');
  }
  get activeColIndex() {
    return Number(this.activeCell.getAttribute('col-index') ?? 'none');
  }
  async deleteTable(command: E_OPERATORS) {
    // ANA: copy past issue
    // ANA: disable insert icon when cursor inside table
    // ANA: selction issue, like ctrl + a
    // ANA: undo redo issue
    // ANA: customize cell width
    // ANA: support merge split
    // ANA: more ticket check text editor feature tag.
    const sctable = this.context.option.viewer.focusedElement as ScTable;
    const { data, conf } = await this.fetchLatestTableInfo();
    let deleteIndex = -1;

    const deleteRowIndex = this.activeRowIndex;
    const deleteColIndex = this.activeColIndex;

    if (isNaN(deleteRowIndex) || isNaN(deleteColIndex)) {
      return;
    }

    if (command === E_OPERATORS['delete-column']) {
      conf.splice(deleteColIndex, 1);
      deleteIndex = deleteColIndex;
    } else if (command === E_OPERATORS['delete-row']) {
      data.splice(deleteRowIndex, 1);
    }

    this.indexedConf(conf);
    this.deleteData(deleteIndex, conf, data);

    sctable.conf = conf;
    sctable.data = data;
    this.finalizeTableMetadata(sctable);
  }
  async fetchLatestTableInfo() {
    const stripExpressionMarkers =
      this.context.option.viewer.stripExpressionMarkers;
    const sctable = this.context.option.viewer.focusedElement as ScTable;
    const conf: TInsertConf[] = sctable.conf.map(c => ({
      columnStyle: c.columnStyle,
      property: c.property,
      header: c.header,
      cell: c.cell,
    }));
    const data: Record<string, string>[] = [];

    await this.iterateTable(sctable, {
      cellCb(cell, colIndex, rowIndex) {
        const content = cell.innerHTML;
        if (!data[rowIndex]) {
          data[rowIndex] = {};
        }
        data[rowIndex][`property_${colIndex}`] =
          stripExpressionMarkers(content);
      },
      headerCellCb(cell, colIndex) {
        const content = cell.innerHTML;
        if (conf[colIndex]) {
          conf[colIndex].property = `property_${colIndex}`;
          conf[colIndex].header = () => html`${unsafeHTML(content)}`;
          conf[colIndex].cell = v => html`${unsafeHTML(v)}`;
        }
      },
    });
    return {
      data,
      conf,
    };
  }
  async changeCellSize(command: E_OPERATORS) {
    const sctable = this.context.option.viewer.focusedElement as ScTable;
    const { data, conf } = await this.fetchLatestTableInfo();
    let columnStyle = conf[this.activeColIndex].columnStyle ?? '';
    columnStyle = columnStyle.replace(/;?width:\s?\S+;/, '');

    if (command === E_OPERATORS['auto-size']) {
    } else {
      columnStyle += `;width: ${command}%;`;
    }
    conf[this.activeColIndex].columnStyle = columnStyle;
    sctable.conf = conf;
    sctable.data = data;
  }
  async insertToTable(command: E_OPERATORS) {
    let insertIndex = -1;
    const sctable = this.context.option.viewer.focusedElement as ScTable;
    const { data, conf } = await this.fetchLatestTableInfo();
    const rowIndex = this.activeRowIndex;
    const colIndex = this.activeColIndex;
    if (isNaN(rowIndex) || isNaN(colIndex)) {
      return;
    }
    const newData = conf.reduce((res, item) => {
      return {
        ...res,
        [item.property]: this.context.option.viewer.placeholder,
      };
    }, {});

    if (command === E_OPERATORS['insert-row-above']) {
      data.splice(rowIndex, 0, newData);
    }
    if (command === E_OPERATORS['insert-row-below']) {
      data.splice(rowIndex + 1, 0, newData);
    }
    if (command === E_OPERATORS['insert-column-left']) {
      conf.splice(colIndex, 0, {
        property: `property_${colIndex}`,
        insertIndex: colIndex,
        header: () =>
          html`${unsafeHTML(this.context.option.viewer.placeholder)}`,
        cell: v => html`${unsafeHTML(v)}`,
      });
      insertIndex = colIndex;
    }
    if (command === E_OPERATORS['insert-column-right']) {
      conf.splice(colIndex + 1, 0, {
        property: `property_${colIndex + 1}`,
        insertIndex: colIndex + 1,
        header: () =>
          html`${unsafeHTML(this.context.option.viewer.placeholder)}`,
        cell: v => html`${unsafeHTML(v)}`,
      });
      insertIndex = colIndex + 1;
    }

    this.indexedConf(conf);
    this.shiftData(insertIndex, conf, data);

    sctable.conf = conf;
    sctable.data = data;
    this.finalizeTableMetadata(sctable);
  }
  indexedConf(conf: TInsertConf[]) {
    conf.forEach((c, index) => (c.property = `property_${index}`));
  }
  deleteData(
    deleteIndex: number,
    conf: TInsertConf[],
    data: Record<string, string>[]
  ) {
    if (deleteIndex === -1) return;
    const confArr = this.context.option.viewer.createArray(conf.length + 1);

    data.forEach(d => {
      confArr.forEach((_, confItemIndex) => {
        if (confItemIndex > deleteIndex) {
          d[`property_${confItemIndex - 1}`] = d[`property_${confItemIndex}`];
        }
        if (confItemIndex === conf.length) {
          delete d[`property_${confItemIndex}`];
        }
      });
    });
  }

  shiftData(
    insertIndex: number,
    conf: TInsertConf[],
    data: Record<string, string>[]
  ) {
    if (insertIndex === -1) return;
    const confArr = this.context.option.viewer.createArray(conf.length);
    let lastColContent = '';
    data.forEach(d => {
      confArr.forEach((_, confItemIndex) => {
        if (confItemIndex === insertIndex) {
          lastColContent = d[`property_${confItemIndex}`];
          d[`property_${confItemIndex}`] = '<p><br></p>';
        }
        if (confItemIndex > insertIndex) {
          const tem = d[`property_${confItemIndex}`];
          d[`property_${confItemIndex}`] = lastColContent;
          lastColContent = tem;
        }
      });
    });
  }
  updateCount() {
    this.context.option.viewer.updateCount();
  }
  getCount() {
    return this.context.option.viewer.count;
  }
  getRange() {
    return this.context.option.viewer.range;
  }
  getSelection() {
    let selection = document.getSelection() || window.getSelection();
    if (
      this.context.option.viewer.shadowRoot &&
      'getSelection' in this.context.option.viewer.shadowRoot
    ) {
      selection = (
        this.context.option.viewer.shadowRoot.getSelection as any
      )() as Selection;
    }
    return selection;
  }
}
