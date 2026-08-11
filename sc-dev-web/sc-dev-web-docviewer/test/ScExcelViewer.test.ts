import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/components/ScExcelViewer.js';
// eslint-disable-next-line no-duplicate-imports
import type { ScExcelViewer } from '../src/components/ScExcelViewer.js';

// mock exceljs
jest.mock('exceljs', () => {
  class MockCell {
    value: any;
    font: any;
    alignment: any;
    fill: any;
    constructor(value: any) {
      this.value = value;
      this.font = undefined;
      this.alignment = undefined;
      this.fill = undefined;
    }
  }
  class MockWorksheet {
    name: string;
    rowCount = 1;
    actualColumnCount = 1;
    _rows = [1];
    _merges = undefined;
    getCell(r: number, c: number) {
      return new MockCell(`R${r}C${c}`);
    }
  }
  class MockWorkbook {
    worksheets: any[];
    constructor() {
      this.worksheets = [new MockWorksheet(), new MockWorksheet()];
      this.worksheets[0].name = 'Sheet1';
      this.worksheets[1].name = 'Sheet2';
    }
    async xlsx() {
      return this;
    }
    async load() {
      return this;
    }
  }
  class ExcelJS {
    static Workbook = MockWorkbook;
    worksheets: any[];
    constructor() {
      this.worksheets = [new MockWorksheet(), new MockWorksheet()];
      this.worksheets[0].name = 'Sheet1';
      this.worksheets[1].name = 'Sheet2';
    }
    async xlsx() {
      return this;
    }
    async load() {
      return this;
    }
  }
  return {
    __esModule: true,
    default: ExcelJS,
    Workbook: MockWorkbook,
  };
});

describe('ScExcelViewer', () => {
  it('renders and handles file input, loading, error, and sheet switching', async () => {
    // Construct a simple Excel file Blob
    const data = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const file = new File([data], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer .file=${file}></sc-excel-viewer>`
    );
    await el.updateComplete;
    // Simulate handleFileUpdate
    await el.handleFileUpdate();
    // Check loading state
    el.isLoading = true;
    el.loadingProgress = 50;
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.contain('Loading...');
    // Error handling
    el.isLoading = false;
    el.errorMessage = 'error';
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.contain('error');
    // Mock excelData
    el.excelData = {
      sheetNames: ['Sheet1', 'Sheet2'],
      sheets: [
        {
          name: 'Sheet1',
          rows: [{ cells: [{ value: 'A1', style: {}, col: 1, row: 1 }] }],
          maxRow: 1,
          maxCol: 1,
          worksheet: {},
        },
        {
          name: 'Sheet2',
          rows: [{ cells: [{ value: 'B1', style: {}, col: 1, row: 1 }] }],
          maxRow: 1,
          maxCol: 1,
          worksheet: {},
        },
      ],
      workbook: {},
    };
    el.currentSheetIndex = 0;
    await el.updateComplete;
    // switch sheet
    el.currentSheetIndex = 1;
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.contain('Sheet2');
    // check rendered content includes column headers and row numbers
    el.currentSheetIndex = 0;
    await el.updateComplete;
    const htmlContent = el.shadowRoot?.innerHTML || '';
    expect(htmlContent).to.contain('A');
    expect(htmlContent).to.contain('1');
    // styleToString
    expect(el.styleToString({ fontWeight: 'bold', color: '#fff' })).to.contain(
      'font-weight:bold;color:#fff'
    );
    expect(
      el.excelModelStyleToCss({
        font: { bold: true, color: { argb: 'FF0000' } },
      })
    ).to.have.property('fontWeight');
  });

  it('renders merged cells correctly', async () => {
    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer></sc-excel-viewer>`
    );
    // Mock merged cells in worksheet
    el.excelData = {
      sheetNames: ['Sheet1'],
      sheets: [
        {
          name: 'Sheet1',
          rows: [
            {
              cells: [
                { value: 'A1', style: {}, col: 1, row: 1 },
                { value: 'B1', style: {}, col: 2, row: 1 },
              ],
            },
            {
              cells: [
                { value: 'A2', style: {}, col: 1, row: 2 },
                { value: 'B2', style: {}, col: 2, row: 2 },
              ],
            },
          ],
          maxRow: 2,
          maxCol: 2,
          worksheet: {
            name: 'Sheet1',
            _merges: new Map([
              ['A1:B1', { model: { top: 1, left: 1, bottom: 1, right: 2 } }],
            ]),
          },
        },
      ],
      workbook: {},
    };
    el.currentSheetIndex = 0;
    await el.updateComplete;
    const htmlContent = el.shadowRoot?.innerHTML || '';
    expect(htmlContent).to.contain('A1');
    expect(htmlContent).to.contain('rowspan');
    expect(htmlContent).to.contain('colspan');
  });

  it('renders hyperlink and richText cells', async () => {
    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer></sc-excel-viewer>`
    );
    el.excelData = {
      sheetNames: ['Sheet1'],
      sheets: [
        {
          name: 'Sheet1',
          rows: [
            {
              cells: [
                {
                  value: { hyperlink: 'http://test', text: 'Link' },
                  style: {},
                  col: 1,
                  row: 1,
                },
                {
                  value: { richText: [{ text: 'Rich' }, { text: 'Text' }] },
                  style: {},
                  col: 2,
                  row: 1,
                },
              ],
            },
          ],
          maxRow: 1,
          maxCol: 2,
          worksheet: {},
        },
      ],
      workbook: {},
    };
    el.currentSheetIndex = 0;
    await el.updateComplete;
    const htmlContent = el.shadowRoot?.innerHTML || '';
    expect(htmlContent).to.contain('href="http://test"');
    expect(htmlContent).to.contain('Link');
    expect(htmlContent).to.contain('RichText');
  });

  it('renders model style and fill color', async () => {
    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer></sc-excel-viewer>`
    );
    el.excelData = {
      sheetNames: ['Sheet1'],
      sheets: [
        {
          name: 'Sheet1',
          rows: [
            {
              cells: [
                {
                  value: {
                    model: {
                      value: 'Styled',
                      style: {
                        font: {
                          bold: true,
                          size: 12,
                          color: { argb: 'FF00FF' },
                        },
                        fill: { fgColor: { argb: '00FF00' } },
                        alignment: { horizontal: 'center', vertical: 'middle' },
                      },
                    },
                  },
                  style: {},
                  col: 1,
                  row: 1,
                },
              ],
            },
          ],
          maxRow: 1,
          maxCol: 1,
          worksheet: {},
        },
      ],
      workbook: {},
    };
    el.currentSheetIndex = 0;
    await el.updateComplete;
    const htmlContent = el.shadowRoot?.innerHTML || '';
    expect(htmlContent).to.contain('Styled');
    expect(htmlContent).to.contain('font-weight:bold');
    expect(htmlContent).to.contain('color:#');
    expect(htmlContent).to.contain('background:#');
    expect(htmlContent).to.contain('text-align:center');
    expect(htmlContent).to.contain('vertical-align:middle');
  });

  it('renders empty sheet and edge cases', async () => {
    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer></sc-excel-viewer>`
    );
    el.excelData = {
      sheetNames: ['Empty'],
      sheets: [
        { name: 'Empty', rows: [], maxRow: 0, maxCol: 0, worksheet: {} },
      ],
      workbook: {},
    };
    el.currentSheetIndex = 0;
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.not.contain('<td');
    // styleToString with empty/null
    expect(el.styleToString(null)).to.equal('');
    expect(el.styleToString(undefined)).to.equal('');
    // excelModelStyleToCss with empty/null
    expect(el.excelModelStyleToCss(null)).to.deep.equal({});
    expect(el.excelModelStyleToCss(undefined)).to.deep.equal({});
  });

  it('shows error and loading states', async () => {
    const el = await fixture<ScExcelViewer>(
      html`<sc-excel-viewer></sc-excel-viewer>`
    );
    el.isLoading = true;
    el.loadingProgress = 77;
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.contain('Loading...');
    el.isLoading = false;
    el.errorMessage = 'Test error!';
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.contain('Test error!');
  });
});
