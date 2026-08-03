import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBottomNavbar } from '../../src/components/ScNavbar/ScBottomNavbar.js';
import '../../elements/sc-bottom-navbar.js';

describe('ScBottomNavbar', () => {
  it('renders bottom navbar', async () => {
    const el = await fixture<ScBottomNavbar>(html`
      <sc-bottom-navbar>
        <sc-navbar-item name="home" label="Home" icon="home--line" active-icon="home--fill" active></sc-navbar-item>
        <sc-navbar-item 
          name="pay" 
          label="Pay & transfer" 
          icon="creditcard--line" 
          active-icon="creditcard--fill"
        >
        </sc-navbar-item>
        <sc-navbar-item name="invest" label="Invest" icon="trending-up"></sc-navbar-item>
      </sc-bottom-navbar>
    `);
    expect(el.items).to.have.length(3);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBottomNavbar>(
      html`<sc-bottom-navbar></sc-bottom-navbar>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
