import { expect } from '@open-wc/testing';
import { _get } from '../../src/shared/object-chain-operations.js';

describe('Object operations', () => {
  it('_get', () => {
    const data = {
      customer: {
        name: '123',
      },
    };
    expect(_get(data, 'customer.name')).to.equal('123');
  });
});
