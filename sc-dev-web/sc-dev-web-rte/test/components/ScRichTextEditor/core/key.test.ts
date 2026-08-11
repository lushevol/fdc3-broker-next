import { expect } from '@open-wc/testing';
import key from '../../../../src/components/ScRichTextEditor/core/key.js';
import { EKEY_MAP } from '../../../../src/components/ScRichTextEditor/constant.js';

describe('key', () => {
  it('should export EKEY_MAP as the code property', () => {
    expect(key.code).to.deep.equal(EKEY_MAP);
  });

  it('should correctly invert EKEY_MAP for the nameFromCode property', () => {
    expect(key.nameFromCode[13]).to.equal('ENTER');
    expect(key.nameFromCode[65]).to.equal('A');
    expect(key.nameFromCode[90]).to.equal('Z');
  });
});
