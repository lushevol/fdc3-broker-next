import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTabPanel } from '../../../src/components/ScTab/ScTabPanel.js';
import '../../../elements/sc-tab-group.js';

describe('ScTabPanel', () => {
  it('renders default tab panel', async () => {
    const el = await fixture<ScTabPanel>(
      html`
        <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
      `
    );

    expect(el.name).to.equal('tab1');
  });

  it('renders active tab panel', async () => {
    const el = await fixture<ScTabPanel>(
      html`
        <sc-tab-panel name="tab1" active>Tab1 content</sc-tab-panel>
      `
    );

    expect(el.active).to.equal(true);
  });
});