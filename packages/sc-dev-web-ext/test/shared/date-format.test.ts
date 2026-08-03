import { expect } from '@open-wc/testing';
import { dateDefaultFormat } from '../../src/shared/date-format.js';

describe('DateFormat', () => {
  it('dateDefaultFormat', () => {
    expect(dateDefaultFormat).to.equal('DD MMM YYYY');
  });
});
