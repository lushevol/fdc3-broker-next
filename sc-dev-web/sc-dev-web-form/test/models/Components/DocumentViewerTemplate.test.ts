import { expect } from '@open-wc/testing';
import { DocumentViewerTemplate } from '../../../src/models/Components/DocumentViewerTemplate.js';

describe('DocumentViewerTemplate model', () => {
  it('should have default properties when created with from()', () => {
    const documentViewerTemplate = DocumentViewerTemplate.from();
    expect(documentViewerTemplate.label).to.equal('Document Viewer');
    expect(documentViewerTemplate.labelSize).to.equal('md');
    expect(documentViewerTemplate.isValid).to.be.false;
  });

  it('should clone properties from object', () => {
    const obj = { labelSize: 'lg', value: 'test' };
    const instance = DocumentViewerTemplate.from(obj);
    expect(instance.label).to.equal('Document Viewer');
    expect(instance.labelSize).to.equal('lg');
    expect(instance.value).to.equal('test');
    expect(instance.isValid).to.be.true;
  });

  it('should duplicate instance correctly', () => {
    const obj = { labelSize: 'sm', value: 'abc' };
    const duplicate = DocumentViewerTemplate.duplicate(obj);
    expect(duplicate.label).to.equal('Document Viewer');
    expect(duplicate.labelSize).to.equal('sm');
    expect(duplicate.value).to.equal('abc');
    expect(duplicate.isValid).to.be.true;
  });

  it('isValid should be true if value is truthy', () => {
    const instance = DocumentViewerTemplate.from({ value: 123 });
    expect(instance.isValid).to.be.true;
  });

  it('isValid should be false if value is falsy', () => {
    const instance = DocumentViewerTemplate.from({ value: '' });
    expect(instance.isValid).to.be.false;
  });
});