import { expect } from '@open-wc/testing';
import range from '../../../../src/components/ScRichTextEditor/core/range.js';

describe('range', () => {
  it('create', () => {
    expect(typeof range.create()).to.equal('object');
  });
  it('createCursorAfter - element', () => {
    const el = document.createElement('div');
    el.innerHTML = 'test for range';
    expect(typeof range.createCursorAfter(el)).to.equal('object');
  });
  it('createCursorAfter - text', () => {
    const el = document.createTextNode('test for range');
    expect(typeof range.createCursorAfter(el)).to.equal('object');
  });
});
