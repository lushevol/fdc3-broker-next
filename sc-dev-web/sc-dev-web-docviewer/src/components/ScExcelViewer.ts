import { html, nothing } from 'lit';
import ScExcelViewerStyle from './ScExcelViewer.style.js';
import { property, state, customElement } from 'lit/decorators.js';
import { watch } from '../utils/watch.js';
import ExcelJS from 'exceljs';
import ScElement from '../utils/ScElement.js';
import { ExcelData } from './ScExcelViewer.type.js';

@customElement('sc-excel-viewer')
export class ScExcelViewer extends ScElement {
  static styles = [ScExcelViewerStyle];
  @property({ type: Object }) file: File;

  @state() excelData: ExcelData | null = null;
  @state() currentSheetIndex = 0;
  @state() isLoading = false;
  @state() loadingProgress = 0;
  @state() errorMessage = '';

  @watch('file')
  async handleFileUpdate() {
    this.isLoading = true;
    this.loadingProgress = 0;
    this.errorMessage = '';
    try {
      const arrayBuffer = await this.readFileInChunks(this.file);
      this.loadingProgress = 100;
      await this.parseExcelBuffer(arrayBuffer);
    } catch (e) {
      this.errorMessage = 'Failed to load Excel file.';
    } finally {
      this.isLoading = false;
      this.loadingProgress = 0;
    }
  }

  readFileInChunks(file: File): Promise<ArrayBuffer> {
    const chunkSize = 1024 * 1024;
    const chunks: Uint8Array[] = [];
    let offset = 0;
    return new Promise((res, rej) => {
      const reader = new FileReader();
      const readNext = () => {
        if (offset >= file.size) {
          const totalLength = chunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0
          );
          const result = new Uint8Array(totalLength);
          let position = 0;
          for (const chunk of chunks) {
            result.set(chunk, position);
            position += chunk.length;
          }
          res(result.buffer);
          return;
        }
        const chunk = file.slice(offset, offset + chunkSize);
        reader.onload = e => {
          if (e.target?.result instanceof ArrayBuffer) {
            chunks.push(new Uint8Array(e.target.result));
            offset += chunkSize;
            this.loadingProgress = Math.min(
              99,
              Math.floor((offset / file.size) * 100)
            );
            readNext();
          }
        };
        reader.onerror = () => rej(reader.error);
        reader.readAsArrayBuffer(chunk);
      };
      readNext();
    });
  }

  async parseExcelBuffer(arrayBuffer: ArrayBuffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const sheetNames = workbook.worksheets.map((ws: any) => ws.name);
    const sheets = workbook.worksheets.map((ws: any) => {
      // Prefer ws.rowCount (physical row count), otherwise use _rows.length
      let maxRow =
        ws.rowCount || (ws._rows ? ws._rows.length : ws.actualRowCount);
      let maxCol = ws.actualColumnCount;
      const extraRows = 20;
      const extraCols = 20;
      const rows = [];
      for (let r = 1; r <= maxRow; r++) {
        const rowCells = [];
        for (let c = 1; c <= maxCol; c++) {
          const cell = ws.getCell(r, c);
          let value = cell.value ?? '';
          const style: any = {};
          if (cell.font) {
            if (cell.font.bold) style.fontWeight = 'bold';
            if (cell.font.italic) style.fontStyle = 'italic';
            if (cell.font.underline) style.textDecoration = 'underline';
            if (cell.font.size)
              style.fontSize = `${(cell.font.size || 10) * 1.6}px`;
            if (cell.font.color && cell.font.color.argb)
              style.color = `#${cell.font.color.argb.slice(2)}`;
          }
          if (cell.alignment) {
            style.textAlign = cell.alignment.horizontal;
            style.verticalAlign = cell.alignment.horizontal;
          }
          if (cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb) {
            style.background = `#${cell.fill.fgColor.argb.slice(2)}`;
          }
          //  model
          if (value && typeof value === 'object' && value.model) {
            const { model } = value;
            value = model.value ?? model.address ?? '';
            if (model.style) {
              Object.assign(style, this.excelModelStyleToCss(model.style));
            }
          }
          // Add col and row properties to match CellValue type
          rowCells.push({ value, style, col: c, row: r });
        }
        // Add extra empty columns
        for (let c = maxCol + 1; c <= maxCol + extraCols; c++) {
          rowCells.push({ value: '', style: {}, col: c, row: r });
        }
        rows.push({ cells: rowCells });
      }
      // Add extra empty rows
      for (let r = maxRow + 1; r <= maxRow + extraRows; r++) {
        const rowCells = [];
        for (let c = 1; c <= maxCol + extraCols; c++) {
          rowCells.push({ value: '', style: {}, col: c, row: r });
        }
        rows.push({ cells: rowCells });
      }
      // Update max row and column
      maxRow = maxRow + extraRows;
      maxCol = maxCol + extraCols;
      return {
        name: ws.name,
        rows,
        maxRow,
        maxCol,
        worksheet: ws,
      };
    });
    this.excelData = { sheetNames, sheets, workbook };
    this.currentSheetIndex = 0;
  }
  renderSheet(sheet: any) {
    if (!sheet || !sheet.rows || sheet.rows.length === 0) return html``;
    // Do not filter empty rows, render all sheet.rows to ensure all content is displayed
    const allRows = sheet.rows;
    const maxCol = Math.max(...allRows.map((row: any) => row.cells.length));
    // Generate Excel column header letters
    const colToLetter = (n: number) => {
      let s = '';
      while (n >= 0) {
        s = String.fromCharCode((n % 26) + 65) + s;
        // eslint-disable-next-line no-param-reassign
        n = Math.floor(n / 26) - 1;
      }
      return s;
    };
    // Build merged cell mapping (rowIdx-colIdx => {rowspan, colspan})
    const mergeMap = new Map();
    if (
      this.excelData &&
      this.excelData?.sheets &&
      this.currentSheetIndex !== null
    ) {
      const ws = this.excelData.sheets[this.currentSheetIndex].worksheet;
      // Compatible with exceljs 4.x/5.x merges structure
      if (ws && ws._merges) {
        // _merges maybe Map，or object
        let mergesArr: any[] = [];
        if (typeof ws._merges[Symbol.iterator] === 'function') {
          // Map (exceljs 4.x)
          mergesArr = Array.from(ws._merges);
        } else if (typeof ws._merges === 'object') {
          // Object (exceljs 5.x)
          mergesArr = Object.entries(ws._merges);
        }
        for (const [, merge] of mergesArr) {
          if (!merge || !merge.model) continue;
          const { top, left, bottom, right } = merge.model;
          mergeMap.set(`${top - 1}-${left - 1}`, {
            rowspan: bottom - top + 1,
            colspan: right - left + 1,
            top,
            left,
            bottom,
            right,
          });
        }
      }
    }
    // Mark already rendered merged regions
    const skipCell = (rowIdx: number, colIdx: number) => {
      for (const { top, left, bottom, right } of mergeMap.values()) {
        if (
          rowIdx >= top - 1 &&
          rowIdx <= bottom - 1 &&
          colIdx >= left - 1 &&
          colIdx <= right - 1
        ) {
          if (!(rowIdx === top - 1 && colIdx === left - 1)) return true;
        }
      }
      return false;
    };
    // Wrap table with div, set overflow-x: auto, table fixed layout, min-width: max-content
    return html`
      <table class="excel-table excel-table-fixed excel-table-bordered" >
        <thead>
          <tr>
            <th class="excel-row-header excel-cell-bordered"></th>
            ${Array.from({ length: maxCol }).map(
              (_, colIdx) =>
                html`<th class="excel-col-header excel-cell-bordered">
                  ${colToLetter(colIdx)}
                </th>`
            )}
          </tr>
        </thead>
        <tbody>
          ${allRows.map(
            (row: any, rowIdx: number) => html`<tr>
              <th class="excel-row-header excel-cell-bordered">
                ${rowIdx + 1}
              </th>
              ${Array.from({ length: maxCol }).map((_, colIdx) => {
                if (skipCell(rowIdx, colIdx)) return null;
                const cell = row.cells[colIdx] || { value: '', style: {} };
                let display = '';
                let styleObj = cell.style || {};
                let isLink = false;
                let linkUrl = '';
                if (cell.value && typeof cell.value === 'object') {
                  if ('hyperlink' in cell.value && 'text' in cell.value) {
                    isLink = true;
                    display = cell.value.text;
                    linkUrl = cell.value.hyperlink;
                  } else if (cell.value.model) {
                    const { model } = cell.value;
                    display = model.value ?? model.address ?? '';
                    if (model.style) {
                      styleObj = {
                        ...styleObj,
                        ...this.excelModelStyleToCss(model.style),
                      };
                    }
                  } else {
                    display = cell.value.richText
                      ? cell.value.richText.map((t: any) => t.text).join('')
                      : String(cell.value);
                  }
                } else {
                  display = cell.value ?? '';
                }
                const merge = mergeMap.get(`${rowIdx}-${colIdx}`);
                // Use property bindings for rowspan/colspan only
                return html`<td
                  class="excel-cell excel-cell-bordered"
                  style="${this.styleToString(styleObj)}"
                  rowspan=${merge && merge.rowspan > 1
                    ? merge.rowspan
                    : undefined}
                  colspan=${merge && merge.colspan > 1
                    ? merge.colspan
                    : undefined}
                >
                  ${isLink
                    ? html`<a href="${linkUrl}" target="_blank">${display}</a>`
                    : display}
                </td>`;
              })}
            </tr>`
          )}
        </tbody>
      </table>
    </div>`;
  }

  // Convert excel model.style to css style object
  excelModelStyleToCss(modelStyle: any) {
    const css: any = {};
    if (!modelStyle) return css;
    if (modelStyle.font) {
      if (modelStyle.font.bold) css.fontWeight = 'bold';
      if (modelStyle.font.italic) css.fontStyle = 'italic';
      if (modelStyle.font.underline) css.textDecoration = 'underline';
      if (modelStyle.font.size)
        css.fontSize = `${(modelStyle.font.size || 10) * 1.6}px`;
      if (modelStyle.font.color && modelStyle.font.color.argb)
        css.color = `#${modelStyle.font.color.argb.slice(2)}`;
    }
    if (
      modelStyle.fill &&
      modelStyle.fill.fgColor &&
      modelStyle.fill.fgColor.argb
    ) {
      css.background = `#${modelStyle.fill.fgColor.argb.slice(2)}`;
    }
    if (modelStyle.alignment) {
      if (modelStyle.alignment.horizontal)
        css.textAlign = modelStyle.alignment.horizontal;
      if (modelStyle.alignment.vertical)
        css.verticalAlign = modelStyle.alignment.vertical;
    }
    return css;
  }

  styleToString(style: any) {
    if (!style) return '';
    return Object.entries(style)
      .map(
        ([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${v}`
      )
      .join(';');
  }

  render() {
    return html` <div class="excel-viewer-container">
      ${this.isLoading
        ? html`<div class="loading-indicator">
            <div
              class="loading-bar"
              style="width: ${this.loadingProgress}%;"
            ></div>
            <div class="loading-text">Loading... ${this.loadingProgress}%</div>
          </div>`
        : nothing}
      ${!this.isLoading && this.errorMessage
        ? html`<div class="error-message">${this.errorMessage}</div>`
        : nothing}
      ${!this.isLoading && this.excelData
        ? html`<div class="sheet-tabs">
              <sc-tab-group @sc-tab-select=${(e: CustomEvent) => {
                  this.currentSheetIndex = e.detail.name;
              }}>
                ${this.excelData.sheetNames.map(
                  (name, idx) => html`
                    <sc-tab
                      slot="nav"
                      ?active=${this.currentSheetIndex === idx}
                      .panel=${idx}
                    >
                      ${name}
                    </sc-tab>
                  `
                )}
              </sc-tab-group>
            </div>
            <div class="sheet-content">
              ${this.renderSheet(this.excelData.sheets[this.currentSheetIndex])}
            </div>`
        : nothing}
    </div>`;
  }
}
