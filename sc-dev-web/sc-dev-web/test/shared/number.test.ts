import { expect } from '@open-wc/testing';
import { isNumber, validNumber } from '../../src/shared/number.js';

describe('isNumber', () => {
  it('from actual number', () => {
    expect(isNumber(123)).to.equal(true);
  });
  it('from number string', () => {
    expect(isNumber('123')).to.equal(true);
  });
  it('from float string', () => {
    expect(isNumber('123.1234')).to.equal(true);
  });
  it('not from alpha string', () => {
    expect(isNumber('alpha')).to.equal(false);
  });
  it('not from empty string', () => {
    expect(isNumber('')).to.equal(false);
  });
  it('not from array', () => {
    expect(isNumber('')).to.equal(false);
  });
});

describe('validNumber', () => {
  it('validate actual number', () => {
    expect(validNumber(123)).to.equal(123);
  });
  it('validate number string', () => {
    expect(validNumber('123')).to.equal(123);
  });
  it('validate float string', () => {
    expect(validNumber('123.1234')).to.equal(123.1234);
  });
  it('not from alpha string', () => {
    expect(() => validNumber('alpha')).to.throw();
  });
  it('not from multiple decimal point', () => {
    expect(() => validNumber('0.3.5.6')).to.throw();
  });
  it('not from empty string', () => {
    expect(() => validNumber('')).to.throw();
  });
  it('not from array', () => {
    expect(() => validNumber([1, 2, 3])).to.throw();
  });
});
