import { expect } from '@open-wc/testing';
import { Queries } from '../../../../src/components/ScCustomer/ScCustomerDetail/queries.js';

describe('Queries', () => {
  it('renders default queries', async () => {
    expect(Queries.customer).not.equal(undefined);
    expect(Queries.contact).not.equal(undefined);
    expect(Queries.address).not.equal(undefined);
    expect(Queries.risk).not.equal(undefined);
  });
});