import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScNavbarItem } from '../../src/components/ScNavbar/ScNavbarItem.js';
import '../../elements/sc-navbar-item.js';

describe('ScNavbarItem', () => {
  it('renders navbar item', async () => {
    const el = await fixture<ScNavbarItem>(html`
      <sc-navbar-item name="home" label="Home" icon="home--line" active-icon="home--fill" active>
      </sc-navbar-item>
    `);
    expect(el.active).to.equal(true);
  });
  it('renders navbar item badge', async () => {
    const el = await fixture<ScNavbarItem>(html`
      <sc-navbar-item name="home" label="Home" icon="home--line" active-icon="home--fill" active badge>
      </sc-navbar-item>
    `);
    expect(el.badge).to.equal('');
  });
  it('passes the a11y audit', async () => {
    const el = await fixture<ScNavbarItem>(
      html`<sc-navbar-item></sc-navbar-item >`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
