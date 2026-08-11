import { expect } from '@open-wc/testing';
import list from '../../../../src/components/ScRichTextEditor/core/list.js';

describe('list', () => {
  it('from', () => {
    expect(list.from([1]).toString()).to.equal('1');
  });
  it('rest', () => {
    expect(list.rest([1, 2, 3]).length).to.equal(2);
  });
  it('contains', () => {
    expect(list.contains([1, 2, 3], 2)).to.equal(true);
  });
});
