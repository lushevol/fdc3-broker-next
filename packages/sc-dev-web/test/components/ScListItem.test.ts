import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScListItem } from '../../src/components/ScList/ScListItem.js';
import '../../elements/sc-list-item.js';

describe('ScListItem', () => {
  it('renders list item', async () => {
    const el = await fixture<ScListItem>(html`
      <sc-list-item title='test' help='help'></sc-list-item>
    `);

    expect(el.title).to.equal('test');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScListItem>(
      html`<sc-list-item></sc-list-item>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
