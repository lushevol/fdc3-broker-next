import { expect } from '@open-wc/testing';
import { Component } from '../../src/models/Component.js';

describe('Component model', () => {
  it('render the properties', () => {
    const newComponent = new Component('box');
    expect(newComponent.id).not.equal(undefined);
    expect(newComponent.template).not.equal(undefined);
  });

  it('component from', () => {
    const component = Component.from({
      id: 'test id',
      type: 'box',
    } as Component);
    expect(component.id).to.equal('test id');
    expect(component.type).to.equal('box');
  });

  it('component others', () => {
    const component = Component.from({
      id: 'test id',
      type: 'box',
    } as Component);
    const instance = Component.createNewInstance(component);
    expect(instance.id).to.equal('test id');
    const dc = Component.duplicate(component);
    expect(dc.id).to.equal('Box');
    component.addComponent('text');
    expect(component.components?.length).to.equal(1);
    component.updateId('new id');
    component.updateAlignment('center');
    component.updateTemplate('key', 'value');
    component.updateComponents([]);
    component.updateReferrers('ref1');
    component.updatePopulators('pop1');
    component.updateRules('rule1');
    component.isContainer();
    component.createNewRow();
  });
});
