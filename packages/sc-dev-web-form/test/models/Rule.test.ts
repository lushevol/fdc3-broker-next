import { expect } from '@open-wc/testing';
import { Rule } from '../../src/models/Rule.js';

describe('Rule model', () => {
  it('should create a Rule instance with default values', () => {
    const rule = new Rule();
    expect(rule.id).not.to.equal('');
  });

  it('should create a Rule instance with provided values', () => {
    const ruleData = {
      id: 'rule1',
      name: 'Test Rule',
    };
    const rule = new Rule('test',ruleData.name);
    expect(rule.type).to.equal('test');
    expect(rule.name).to.equal(ruleData.name);
  });
  it('Rule from', () => {
      const component = Rule.from({
        id: 'test id',
        type: 'box',
      } as Rule);
      expect(component.id).to.equal('test id');
      expect(component.type).to.equal('box');
    });
});
