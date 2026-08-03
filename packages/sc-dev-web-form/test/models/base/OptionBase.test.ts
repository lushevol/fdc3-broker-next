import { expect } from '@open-wc/testing';
import { OptionBase } from '../../../src/models/base/OptionBase.js';

describe('OptionBase model', () => {
  it('should create an instance with default values', () => {
    const option = new OptionBase();
    expect(option.value).to.be.undefined;
    expect(option.label).to.be.undefined;
    expect(option.isOtherOptionItem).to.be.undefined;
  });

  it('should create an instance with provided value', () => {
    const option = new OptionBase('testValue');
    expect(option.value).to.equal('testValue');
  });

  it('should validate isValid correctly', () => {
    const option = new OptionBase('testValue');
    expect(option.isValid).to.be.true;

    const invalidOption = new OptionBase('');
    expect(invalidOption.isValid).to.be.false;

    const otherOption = new OptionBase();
    otherOption.isOtherOptionItem = true;
    expect(otherOption.isValid).to.be.true;
  });

  it('should create an instance from an object', () => {
    const obj = { value: 'testValue', label: 'Test Label', isOtherOptionItem: true };
    const option = OptionBase.from(obj);
    expect(option.value).to.equal('testValue');
    expect(option.label).to.equal('Test Label');
    expect(option.isOtherOptionItem).to.be.true;
  });

  it('should duplicate an instance correctly', () => {
    const original = new OptionBase('originalValue');
    original.label = 'Original Label';
    original.isOtherOptionItem = true;

    const duplicate = original.duplicate(OptionBase as any, original);
    expect(duplicate.value).to.equal('originalValue');
    expect(duplicate.label).to.equal('Original Label');
    expect(duplicate.isOtherOptionItem).to.be.true;
  });
});
