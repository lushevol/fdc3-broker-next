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

  it('first returns the first element', () => {
    expect(list.first([10, 20, 30])).to.equal(10);
    expect(list.first([])).to.be.undefined;
  });

  it('last returns the last element', () => {
    expect(list.last([10, 20, 30])).to.equal(30);
    expect(list.last([])).to.be.undefined;
  });

  it('contains works with a DOMTokenList', () => {
    const div = document.createElement('div');
    div.className = 'foo bar';
    expect(list.contains(div.classList, 'foo')).to.be.true;
    expect(list.contains(div.classList, 'baz')).to.be.false;
  });

  it('contains returns false for invalid inputs', () => {
    expect(list.contains(null as any, 'item')).to.be.false;
    expect(list.contains([], 'item')).to.be.false;
    expect(list.contains(['a', 'b'], null)).to.be.false;
  });
});
