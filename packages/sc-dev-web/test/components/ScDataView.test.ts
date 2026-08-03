import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDataView } from '../../src/components/ScDataView/ScDataView.js';
import '../../elements/sc-data-view.js';

const data = [
  { 
    field: {
      value: 'Request ID',
    }, 
    value: {
      value: 'REQ1237',
    }, 
  },
  { 
    field: {
      value: 'Effective Date',
    }, 
    value: {
      value: '22 Feb 2022',
    }, 
  },
  { 
    field: {
      value: 'Effective Date-1',
    }, 
    value: {
      value: '22 Feb 2023',
    }, 
  },
  { 
    field: {
      value: 'Effective Date-2',
    }, 
    value: {
      value: '22 Feb 2024',
    }, 
  },
  { 
    field: {
      value: 'Effective Date-3',
    }, 
    value: {
      value: '22 Feb 2024',
    }, 
  },
];
describe('ScDataView', () => {
  it('should pass accessibility tests', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data}></sc-data-view>`);
    expect(el).to.be.accessible();
  });

  it('renders default table mode', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data}></sc-data-view>`);
    expect(el.mode).to.equal('table');
  });

  it('renders view mode', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data} mode=view></sc-data-view>`);
    expect(el.mode).to.equal('view');
  });

  it('renders columns', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data} columns=2></sc-data-view>`);
    expect(el.columns).to.equal(2);
  });

  it('renders horizontal alignment', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data} horizontal-align="right"></sc-data-view>`);
    expect(el.horizontalAlign).to.equal('right');
  });

  it('renders vertical alignment', async () => {
    const el = await fixture<ScDataView>(html`<sc-data-view .data=${data} vertical-align="middle"></sc-data-view>`);
    expect(el.verticalAlign).to.equal('middle');
  });
});
