import { expect } from '@open-wc/testing';
import { Fields } from '../../../../src/components/ScCustomer/ScCustomerDetail/fields.js';

describe('Fields', () => {
  it('renders default fields', async () => {
    expect(Fields.length).to.equal(3);
  });
});