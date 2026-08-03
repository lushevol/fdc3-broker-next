import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTableHeaderWithSort } from '../../../../src/components/ScTable//TableHeaders/ScTableHeaderWithSort.js';
import '../../../../elements/sc-table.js';

describe('ScTableHeaderWithSort', () => {
  it('renders default attributes', async () => {
    const el = await fixture<ScTableHeaderWithSort>(
      html` <sc-table-header-with-sort></sc-table-header-with-sort>`
    );
    expect(el.direction).to.equal('');
  });

  it('renders direction', async () => {
    const el = await fixture<ScTableHeaderWithSort>(
      html` <sc-table-header-with-sort direction='desc'></sc-table-header-with-sort>`
    );
    expect(el.direction).to.equal('desc');
  });

  // it('handleSort', async () => {
  //   const el = await fixture<ScTableHeaderWithSort>(
  //     html` <sc-table-header-with-sort direction='desc'></sc-table-header-with-sort>`
  //   );
  //   el.handleSort();
  //   expect(el.direction).to.equal('asc');
  // });

});