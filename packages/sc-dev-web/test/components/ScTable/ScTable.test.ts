import { html } from 'lit';
import { deepEqual } from 'fast-equals';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { E_SELECT_TRIGGER, ScTable } from '../../../src/components/ScTable/ScTable.js';
import '../../../elements/sc-table.js';

describe('ScTable', () => {
  const data = [
    { fruit: 'apple', color: 'green', weight: '100gr' },
    { fruit: 'banana', color: 'yellow', weight: '140gr' },
  ];
  data.forEach(d => {
    // @ts-ignore
    d.rowId = Math.random().toString(16).slice(2);
  });

  const conf = [
    { property: 'fruit', header: 'Fruit' },
    { property: 'color', header: 'Color' },
    { property: 'weight', header: 'Weight' },
  ];

  it('renders default attributes', async () => {
    const el = await fixture<ScTable>(
      html` <sc-table></sc-table>`
    );
    el.data = data;
    el.conf = conf;
    expect(deepEqual(el.data, data)).to.equal(true);
    expect(deepEqual(el.conf, conf)).to.equal(true);
    expect(el.sort).to.equal('');
    expect(el.stickyHeader).to.equal(false);
    expect(el.pagination).to.equal(false);
    expect(el.quickJumper).to.equal(false);
    expect(el.sizeChanger).to.equal(false);
    expect(el.columnChooser).to.equal(false);
  });
  it('renders contenteditable attributes', async () => {
    const el = await fixture<ScTable>(
      html` <sc-table contenteditable></sc-table>`
    );
    el.data = data;
    el.conf = conf;
    el.focus();
    const tableEl = el.renderRoot.querySelector('table');
    if (tableEl) {
      tableEl.focus();
      tableEl.blur();
      tableEl.click();
    }
    expect(deepEqual(el.data, data)).to.equal(true);
    expect(deepEqual(el.conf, conf)).to.equal(true);
    expect(el.sort).to.equal('');
    expect(el.stickyHeader).to.equal(false);
    expect(el.pagination).to.equal(false);
    expect(el.quickJumper).to.equal(false);
    expect(el.sizeChanger).to.equal(false);
    expect(el.columnChooser).to.equal(false);
  });

  it('renders sortable header', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table' sort='fruit,asc'>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    expect(el.sort).to.equal('fruit,asc');
  });
  it('renders sticky column', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table'>
      </sc-table>
      `
    );
    const conf = [
      {
        property: 'fruit',
        header: 'Fruit',
        columnStyle: 'min-width: 120px;',
        pinned: 'left',
      },
      { property: 'color', header: 'Color' },
      { property: 'weight', header: 'Weight' },
    ];
    el.data = data;
    // @ts-ignore
    el.conf = conf;

    await el.updateComplete;
    await el.updateComplete;
    await el.updateComplete;
    
    const td = el.shadowRoot?.querySelector('table tbody tr td');
    // @ts-ignore
    el.trClick('', '', {
      composedPath() {
        return [td];
      },
    });
    expect(td?.classList.contains('sticky-column')).to.equal(true);
  });

  it('renders pagination', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' sort='fruit,asc' pagination page-size=5>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    el.pageSize = 2;
    expect(el.pagination).to.equal(true);
    expect(el.pageSize).to.equal(2);
  });

  it('renders row checkbox', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' sort='fruit,asc' column-chooser>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    await el.updateComplete;

    expect(el.columnChooser).to.equal(true);
    expect(el.shadowRoot?.querySelectorAll('sc-checkbox').length).to.equal(1);
  });

  it('renders custom html', async () => {
    const conf = [
      { property: 'fruit', 
        header: () => html`<div class=fruit-header>Fruit</div>`, 
        cell: (v: string) => html`<sc-link>${v}</sc-link>` },
      { property: 'color', header: 'Color' },
      { property: 'weight', header: 'Weight' },
    ];
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' sort='fruit,asc' column-chooser>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    await elementUpdated(el);
    await elementUpdated(el);
    const links = el.shadowRoot?.querySelectorAll('sc-link');
    expect(links?.length).to.equal(data.length);
  });
  it('renders nesting table', async () => {
    const conf = [
      { property: 'fruit', 
        header: () => html`<div class=fruit-header>Fruit</div>`, 
        sort: true,
        filter: true,
        filterParams: {
          lookup(keyword?: string) {
            return new Promise<{
              label: string,
              value: string,
            }[]>(res => {
              setTimeout(function () {
                res(data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
                  label: d.fruit,
                  value: d.fruit,
                })));
              }, 1000);
            });
          },
        },
        cell: (v: string) => html`<sc-link>${v}</sc-link>` },
      { property: 'color', header: 'Color' },
      { property: 'weight', header: 'Weight' },
    ];
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' expandable expand-mode="single-only" sort='fruit,asc' column-chooser>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    el.rowExpandable = (rowData: any) => {
      if (rowData.fruit === 'apple') {
        return 0;
      }
      return 1;
    };
    el.rowExpandRender = (rowData: any) => {
      return rowData.fruit;
    };
    const map1 = new Map();
    map1.set('1', []);
    const map2 = new Map();
    map2.set('2', []);
    el.differentiate(map1, map2);
    el.handleHeaderChooser(new CustomEvent('range', {
      detail: {
        checked: true,
      },
    }));
    el.afterSelected(E_SELECT_TRIGGER.header);
    await elementUpdated(el);
    await elementUpdated(el);
    el.columnChooser = !el.columnChooser;

    const links = el.shadowRoot?.querySelectorAll('.expansive-slot-container');
    expect(links?.length).to.equal(1);
  });
  it('renders nesting table - page', async () => {
    const conf = [
      { property: 'fruit', 
        header: () => html`<div class=fruit-header>Fruit</div>`, 
        sort: true,
        filter: true,
        cell: (v: string) => html`<sc-link>${v}</sc-link>` },
      { property: 'color', header: 'Color' },
      { property: 'weight', header: 'Weight' },
    ];
    const el = await fixture<ScTable>(
      html`
      <sc-table
        class='sc-table-custom-html'
        select-scope="page"
        expandable
        expand-mode="single-only"
        sort='fruit,asc'
        column-chooser
      >
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    el.rowExpandable = (rowData: any) => {
      if (rowData.fruit === 'apple') {
        return 0;
      }
      return 1;
    };
    el.rowExpandRender = (rowData: any) => {
      return rowData.fruit;
    };
    const map1 = new Map();
    map1.set('1', []);
    const map2 = new Map();
    map2.set('2', []);
    el.differentiate(map1, map2);
    await elementUpdated(el);
    await elementUpdated(el);
    const links = el.shadowRoot?.querySelectorAll('.expansive-slot-container');
    expect(links?.length).to.equal(1);
  });
  it('renders default select', async () => {
    const conf = [
      { property: 'fruit', 
        header: () => html`<div class=fruit-header>Fruit</div>`, 
        sort: true, 
        cell: (v: string) => html`<sc-link>${v}</sc-link>` },
      { property: 'color', header: 'Color' },
      { property: 'weight', header: 'Weight' },
    ];
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' select-all-rows column-chooser>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    el.selectedRows = (rowData: any) => {
      return rowData.fruit !== 'banana';
    };
    await elementUpdated(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelectorAll('sc-checkbox').length).to.equal(3);
  });
  it('renders default select', async () => {
    const conf = [
      {
        property: 'fruit',
        header: 'fruit',
        hidden: false,
        columnStyle: 'min-width: 260px;',
        sort: true,
        filter: true,
        pinned: 'left',
      },
      {
        header: 'color',
        property: 'color',
        columnStyle: 'min-width: 260px;min-width: 260px;min-width: 220px',
        hidden: false,
        sort: true,
        filter: true,
        pinned: 'left',
      },
      {
        property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight1',
      },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight2' },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight3' },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight4' },
      { property: 'weight', header: 'Weight5' },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight6', pinned: 'right' },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight7' },
      { property: 'weight', columnStyle: 'min-width: 260px', header: 'Weight8', pinned: 'right' },
    ];
    const el = await fixture<ScTable>(
      html`
      <sc-table class='sc-table-custom-html' select-all-rows column-chooser>
      </sc-table>
      `
    );
    el.data = data;
    // @ts-ignore
    el.conf = conf;

    await elementUpdated(el);
    await elementUpdated(el);
    el.log.error('msg');
    el.log.warn('msg');
    expect(el.shadowRoot?.querySelectorAll('sc-checkbox').length).to.equal(3);
  });


  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');

  it('test hidePopupsWhenOverlapped()', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    await el.updateComplete;
    jest.runOnlyPendingTimers();
    const popups = new Set();
    const hide = jest.fn();
    popups.add({
      hide,
    });
    el.popups = popups;

    el.hidePopupsWhenOverlapped();
    expect(hide.mock.calls.length).to.greaterThan(0);
  });

  it('test onTablePopupShow/Hide()', async () => {
    const el = await fixture<ScTable>(
      html`
      <sc-table>
      </sc-table>
      `
    );
    el.data = data;
    el.conf = conf;
    await el.updateComplete;

    const mockedTd = document.createElement('td');
    mockedTd.classList.add('overlap');
    mockedTd.classList.add('sticky-column');
    
    const mockedTdTarget = {
      hide() {},
      tagName: 'SC-TOOLTIP',
    };

    const mockedTh = document.createElement('th');
    mockedTh.classList.add('overlap');
    const mockedThTarget = {
      hide() {},
      tagName: 'SC-TABLE-HEADER-WITH-SORT',
    };


    let mockedEvent = {
      composedPath() { return [
        mockedTd,
      ]; },
      target: mockedTdTarget,
    };

    el.onTablePopupShow(mockedEvent);
    expect(mockedTd.classList.contains('popup-show')).to.eqls(true);
    el.onTablePopupHide(mockedEvent);
    expect(mockedTd.classList.contains('popup-show')).to.eqls(false);

    mockedEvent = {
      composedPath() { return [
        mockedTh,
      ]; },
      target: mockedThTarget,
    };

    el.onTablePopupShow(mockedEvent);
    expect(mockedTh.classList.contains('popup-show')).to.eqls(true);
    el.onTablePopupHide(mockedEvent);
    expect(mockedTh.classList.contains('popup-show')).to.eqls(false);
  });
});