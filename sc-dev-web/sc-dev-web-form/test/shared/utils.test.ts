import { expect } from '@open-wc/testing';
import { isTableInvalid, isValidFormat } from '../../src/shared/utils.js';

describe('shared utils - isTableInvalid', () => {
  it('returns false when required is false', () => {
    const template = { conf: [], required: false };
    expect(isTableInvalid(template, [])).to.equal(false);
    expect(isTableInvalid(template, undefined)).to.equal(false);
  });

  it('returns true when required with empty rows and no required columns', () => {
    const template = { conf: [], required: true };
    const value = [{ col1: '', col2: null }, {}];
    expect(isTableInvalid(template, value)).to.equal(true);
  });

  it('returns false when required with at least one non-empty cell', () => {
    const template = { conf: [], required: true };
    const value = [{ col1: '', col2: 'x' }];
    expect(isTableInvalid(template, value)).to.equal(false);
  });

  it('checks required columns when configured', () => {
    const template = {
      conf: [
        { property: 'col1', config: { required: true } },
        { property: 'col2', config: { required: false } },
      ],
      required: true,
    };
    const value = [{ col1: '', col2: 'x' }];
    expect(isTableInvalid(template, value)).to.equal(true);
  });

  it('returns false when required columns have values', () => {
    const template = {
      conf: [
        { property: 'col1', config: { required: true } },
        { property: 'col2', config: { required: false } },
      ],
      required: true,
    };
    const value = [{ col1: 'a', col2: '' }];
    expect(isTableInvalid(template, value)).to.equal(false);
  });
});

describe('shared utils - isValidFormat', () => {
  it('returns true when value matches the regex format', () => {
    expect(isValidFormat('abc123', '^[A-Za-z0-9]+$')).to.equal(true);
  });
  it('returns false when value does not match the regex format', () => {
    expect(isValidFormat('abc-123', '^[A-Za-z0-9]+$')).to.equal(false);
  });
  it('supports empty strings when the pattern allows them', () => {
    expect(isValidFormat('', '^[A-Za-z0-9]*$')).to.equal(true);
  });
});
