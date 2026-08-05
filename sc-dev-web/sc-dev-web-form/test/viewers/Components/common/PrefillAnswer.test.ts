import { expect } from '@open-wc/testing';
import { PrefillAnswer } from '../../../../src/viewers/Components/common/PrefillAnswer.js';
import { FormDefinition } from '../../../../src/models/FormDefinition.js';
import { Component } from '../../../../src/models/Component.js';
import { Rule } from '../../../../src/models/Rule.js';

describe('PrefillAnswer', () => {
  it('keeps a dataflow rule visible when other fields still reference it', () => {
    const component = new Component('text-field');
    component.id = 'component-a';
    component.template.label = 'Field A';
    component.template.populateType = 'dataFlow';
    component.template.populateRule = 'rule-1';

    const rule = new Rule();
    rule.id = 'rule-1';
    rule.name = 'Rule 1';
    rule.dataSource = 'data-source-1';
    rule.fields = {
      firstName: 'component-a',
      lastName: 'component-b',
    };
    rule.hiddenInRuleTab = false;

    const formDefinition = new FormDefinition();
    formDefinition.rules = [rule];
    formDefinition.getDataSource = () => ({ id: 'data-source-1' } as any);
    formDefinition.getRule = id => formDefinition.rules.find(item => item.id === id);

    const prefillAnswer = new PrefillAnswer();
    prefillAnswer.component = component;
    prefillAnswer.formDefinition = formDefinition;
    prefillAnswer['clearComponentMappingFromRule']('rule-1');

    const updatedRule = formDefinition.getRule('rule-1');
    expect(updatedRule?.hiddenInRuleTab).to.equal(false);
    expect(updatedRule?.fields).to.deep.equal({
      lastName: 'component-b',
    });
  });

  it('removes only the current component mapping when switching dataflow bindings', () => {
    const component = new Component('text-field');
    component.id = 'component-a';
    component.template.label = 'Field A';

    const rule = new Rule();
    rule.id = 'rule-1';
    rule.name = 'Rule 1';
    rule.dataSource = 'data-source-1';
    rule.fields = {
      firstName: 'component-a',
      lastName: 'component-b',
    };

    const formDefinition = new FormDefinition();
    formDefinition.rules = [rule];
    formDefinition.getDataSource = () => ({ id: 'data-source-1' } as any);
    formDefinition.getRule = id => formDefinition.rules.find(item => item.id === id);

    const prefillAnswer = new PrefillAnswer();
    prefillAnswer.component = component;
    prefillAnswer.formDefinition = formDefinition;
    prefillAnswer['clearComponentMappingFromRule']('rule-1');

    const updatedRule = formDefinition.getRule('rule-1');
    expect(updatedRule?.fields).to.deep.equal({
      lastName: 'component-b',
    });
  });

  it('emits form-updated after clearing a dataflow component mapping', () => {
    const component = new Component('text-field');
    component.id = 'component-a';

    const rule = new Rule();
    rule.id = 'rule-1';
    rule.dataSource = 'data-source-1';
    rule.fields = {
      firstName: 'component-a',
    };

    const formDefinition = new FormDefinition();
    formDefinition.rules = [rule];
    formDefinition.getRule = id => formDefinition.rules.find(item => item.id === id);

    const prefillAnswer = new PrefillAnswer();
    prefillAnswer.component = component;
    prefillAnswer.formDefinition = formDefinition;

    const emitCalls: any[] = [];
    const originalEmit = prefillAnswer.emit;
    prefillAnswer.emit = ((...args: any[]) => {
      emitCalls.push(args);
      return originalEmit.apply(prefillAnswer, args as any);
    }) as any;
    prefillAnswer['clearComponentMappingFromRule']('rule-1');

    expect(emitCalls.some(args => args[0] === 'form-updated')).to.equal(true);
  });

  it('reads process fields from processApiFieldsContext cache', () => {
    const prefillAnswer = new PrefillAnswer();
    let getCachedFieldsCalls = 0;
    let getOrLoadFieldsCalls = 0;
    const getCachedFields = () => {
      getCachedFieldsCalls += 1;
      return ['customerId', 'customerName'];
    };
    const getOrLoadFields = async () => {
      getOrLoadFieldsCalls += 1;
      return ['customerId', 'customerName'];
    };

    prefillAnswer.processApiFieldsContext = {
      getCachedFields,
      getOrLoadFields,
      primeByDefinition: async () => {},
      invalidateByDataSourceId: () => {},
    } as any;
    prefillAnswer['_selectedDataSource'] = {
      id: 'process-ds',
      type: 'api',
      apiType: 'process',
      apiFields: [],
    } as any;

    const fields = prefillAnswer['_selectedDataSourceFields'];
    expect(fields).to.deep.equal(['customerId', 'customerName']);
    expect(getCachedFieldsCalls).to.equal(1);
    expect(getOrLoadFieldsCalls).to.equal(0);
  });

  it('triggers lazy load when process fields cache is empty', async () => {
    const prefillAnswer = new PrefillAnswer();
    let getOrLoadFieldsCalls = 0;
    let requestUpdateCalls = 0;
    const getCachedFields = () => [];
    const getOrLoadFields = async () => {
      getOrLoadFieldsCalls += 1;
      return ['loadedField'];
    };
    prefillAnswer.requestUpdate = (() => {
      requestUpdateCalls += 1;
    }) as any;

    prefillAnswer.processApiFieldsContext = {
      getCachedFields,
      getOrLoadFields,
      primeByDefinition: async () => {},
      invalidateByDataSourceId: () => {},
    } as any;
    prefillAnswer['_selectedDataSource'] = {
      id: 'process-ds',
      type: 'api-process',
      apiFields: [],
    } as any;

    const fields = prefillAnswer['_selectedDataSourceFields'];
    expect(fields).to.deep.equal([]);
    expect(getOrLoadFieldsCalls).to.equal(1);

    await Promise.resolve();
    expect(requestUpdateCalls >= 1).to.equal(true);
  });
});