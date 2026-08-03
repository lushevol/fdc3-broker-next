import { html } from 'lit';
import { expect, fixture, nextFrame } from '@open-wc/testing';
import { ScDataGrid } from '../../../../src/components/ScDataGrid/ScDataGrid.js';
import * as dataExportUtils from
  '../../../../src/components/ScDataGrid/mixins/features/data-export/data-export-utils.js';
import '../../../../elements/sc-data-grid.js';
import '../../../../elements/sc-dropdown-input.js';
import '../../../../elements/sc-tooltip.js';
import sinon from 'sinon';
import { fileDownloadHandlerMock } from './fileDownloadHandlerMock.js';
import * as XLSX from 'xlsx-republish';
import { mockAnimation } from '../../../shared/animation.js';

const downloadFileSpy = sinon.spy(dataExportUtils, 'downloadFile');

const timeout = (time = 50) => new Promise(resolve => setTimeout(resolve, time));

HTMLAnchorElement.prototype.click = jest.fn();

const TEST_DATA = [
  {
    uuid: 'row1',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    date: new Date(),
  },
  {
    uuid: 'row2',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    date: new Date(),
  },
];

const CSV_EXPORT_OPTIONS = {
  headers: { fullName: 'Full Name' },
  modifier: 'pre-paginated',
  type: 'csv',
  fileName: 'single-employees',
  dataFilter: (data: any) => data['99'] === 'Single',
  dataMapper: (data: any) => ({ fullName: `${data.firstName} ${data.lastName}` }),
};

const XLSX_EXPORT_OPTIONS = {
  modifier: 'all',
  type: 'xlsx',
  fileName: 'all-employees',
  respectColumnOrder: true,
  respectColumnVisibility: true,
};
const columns = [
  {
    property: 'firstName',
    cell() {
      return 'tandy1212';
    },
    enableResizing: true,
    pinned: 'left',
    sort: 'asc',
    sortable: true,
    colSpanning(table: any, column: any, row: any, cell: any) {
      return cell.renderValue() === 'tandy' ? 2 : 1;
    },
    editable: true,
    header: () => html`<b>firstname-column</b>`,
  },
  {
    editable: true,
    minSize: 60,
    header: () => '22',
    colSpanning(table: any, column: any, row: any, cell: any) {
      const value = cell.renderValue();
      if (value === 'linsley') return 2;
      if (value === 'miller') return 3;
      return 1;
    },
    property: 'lastName',
  },
  {
    editable: true,
    property: 'age',
    id: '33',
    sort: 'desc',
    sortable: true,
    minSize: 40,
    header: () => html`<div>33</div>`,
  },
  {
    editable: true,
    id: '99',
    property: 'status',
    header: () => html`<div>age 99</div>`,
  },
  {
    editable: true,
    id: '44',
    property: 'visits',
    pinned: 'right',
    header: () => html`<div>age 44</div>`,
  },
  {
    editable: true,
    id: '55',
    property: 'status',
    pinned: 'right',
    colSpanning: 2,
    header: () => html`<div>age 55</div>`,
  },
  {
    editable: true,
    cellEditor(props: any, params: any, sendValue: any) {
      sendValue(12);
      return html`123`;
    },
    async cellEditorParams() {
      return { value: ['tag1', 'tag2', 'tag3', 'tag4'] };
    },
    id: '66',
    property: 'status',
    pinned: 'left',
    header: () => html`<div>age 66</div>`,
  },
  {
    editable: () => true,
    id: '77',
    property: 'date',
    header: () => html`<div>date 77</div>`,
  },
  {
    editable: true,
    id: '88',
    property: 'status',
    header: () => html`<div>age 88</div>`,
  },
  {
    id: 'cm-1',
    property: 'status',
    header: () => html`<div>age cm-1</div>`,
    columnManagerLabel: () => '#1 column',
    hide: true,
    lock: true,
  },
  {
    id: 'cm-2',
    property: 'status',
    header: () => html`<div>age cm-2</div>`,
    columnManagerLabel: '#2 column',
    hide: false,
    lock: 'ordering',
  },
  {
    id: 'cm-3',
    property: 'status',
    header: () => html`<div>age cm-3</div>`,
    lock: 'visibility',
  },
];
const validateExport = async (exportButtons: Element[], buttonIndex: number, expectedFileName: string, expectedBody?: string) => {
  (exportButtons?.[buttonIndex] as any)?.click();
  await timeout(300);

  expect(downloadFileSpy).to.have.been.called;

  const [blob, fileName] = downloadFileSpy.lastCall.args;
  expect(fileName).to.equal(expectedFileName);

  if (blob.type.includes('spreadsheetml.sheet')) {
    const workbook = XLSX.read(await blob.arrayBuffer(), { type: 'array' });
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    expect(data).to.not.be.undefined;
  } else if (expectedBody) {
    expect(await blob.text()).to.equal(expectedBody);
  }
};

describe('ScDataGrid Data Export', () => {
  beforeEach(() => mockAnimation());

  it('should export data in different formats', async () => {
    fileDownloadHandlerMock();

    const el = await fixture<ScDataGrid>(html`
      <sc-data-grid .data=${TEST_DATA} .columns=${columns} enable-export>
        <div slot="data-export">
          <sc-button type="primary" state="default" size="xxs" .dataExportOptions=${CSV_EXPORT_OPTIONS}>
            Export adults as CSV
          </sc-button>
          <sc-button .dataExportOptions=${XLSX_EXPORT_OPTIONS} href="#" style="margin-left: 12px; margin-right: 12px">
            Export all data as XLSX
          </sc-button>
        </div>
      </sc-data-grid>
    `);

    await el.updateComplete;

    const actionBar = el.shadowRoot?.querySelector('.sc-data-grid-actions-bar');
    const slots = actionBar?.querySelector('slot')?.assignedElements();
    const dataExportSlot = slots?.find(s => s.slot === 'data-export');
    expect(dataExportSlot).to.exist;

    const exportButtons = Array.from(dataExportSlot?.querySelectorAll('*') ?? [])
      .filter(el => 'dataExportOptions' in el);

    expect(exportButtons).to.exist;
    expect(exportButtons.length).to.equal(2);

    await nextFrame();

    await validateExport(exportButtons, 0, 'single-employees', 'Full Name\ntandy1212 miller\n');
    await validateExport(exportButtons, 1, 'all-employees');
  });

});
