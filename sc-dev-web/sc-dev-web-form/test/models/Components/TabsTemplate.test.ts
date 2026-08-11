import { expect } from '@open-wc/testing';
import { TabsTemplate } from '../../../src/models/Components/TabsTemplate.js';

describe('TabsTemplate model', () => {
  it('render the properties', () => {
    const tabsTemplate = TabsTemplate.from();
    expect(tabsTemplate.label).to.equal('Tabs');
  });
});