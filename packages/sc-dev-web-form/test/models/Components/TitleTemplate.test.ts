import { expect } from '@open-wc/testing';
import { TitleTemplate } from '../../../src/models/Components/TitleTemplate.js';

describe('TitleTemplate model', () => {
  it('should create an instance with default values', () => {
    const titleTemplate = new TitleTemplate();
    expect(titleTemplate.label).to.equal('Title');
    expect(titleTemplate.level).to.equal('2');
    expect(titleTemplate.ellipsis).to.be.false;
    expect(titleTemplate.hero).to.be.false;
    expect(titleTemplate.rows).to.equal(1);
  });

  it('should create an instance from an object', () => {
    const obj = { label: 'Custom Title', level: '1', ellipsis: true, hero: true, rows: 2 };
    const titleTemplate = TitleTemplate.from(obj);
    expect(titleTemplate.label).to.equal('Custom Title');
    expect(titleTemplate.level).to.equal('1');
    expect(titleTemplate.ellipsis).to.be.true;
    expect(titleTemplate.hero).to.be.true;
    expect(titleTemplate.rows).to.equal(2);
  });

  it('should duplicate an instance correctly', () => {
    const obj = { label: 'Duplicated Title', level: '3', ellipsis: false, hero: true, rows: 3 };
    const duplicated = TitleTemplate.duplicate(obj);
    expect(duplicated.label).to.equal('Duplicated Title');
    expect(duplicated.level).to.equal('3');
    expect(duplicated.ellipsis).to.be.false;
    expect(duplicated.hero).to.be.true;
    expect(duplicated.rows).to.equal(3);
  });
});
