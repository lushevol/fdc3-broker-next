import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCustomerDetail } from '../../../../src/components/ScCustomer/ScCustomerDetail/ScCustomerDetail.js';
import '../../../../elements/sc-customer.js';

describe('ScCustomerDetail', () => {
  it('renders default employee base', async () => {
    const el = await fixture<ScCustomerDetail>(html`
      <sc-customer-detail reference-id='3560000000600908' country-code='IN'></sc-customer-detail>
    `);
    expect(el.referenceId).to.equal('3560000000600908');
    expect(el.countryCode).to.equal('IN');
  });
  it('renders multiple columns', async () => {
    const el = await fixture<ScCustomerDetail>(html`
      <sc-customer-detail reference-id='3560000000600908' country-code='IN' columns=2></sc-customer-detail>
    `);
    expect(el.columns).to.equal(2);
  });
});