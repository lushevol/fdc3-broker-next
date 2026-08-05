import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScMenu } from '../../../src/components/ScMenu/ScMenu.js';
import '../../../elements/sc-menu.js';

describe('ScMenu', () => {
  it('renders menu', async () => {
    const el = await fixture<ScMenu>(html`
      <sc-menu>
          <sc-menu-label>Option</sc-menu-label>
          <sc-menu-item type=checkbox>Option 1</sc-menu-item>
          <sc-menu-item>Option 2</sc-menu-item>
          <sc-menu-item>Option 3</sc-menu-item>
          <sc-menu-item type="checkbox" checked>Checkbox</sc-menu-item>
          <sc-menu-item disabled>Disabled</sc-menu-item>
          <sc-menu-item>
              Prefix Icon
              <sl-icon slot="prefix" name="home--line"></sl-icon>
          </sc-menu-item>
          <sc-menu-item>
              Suffix Icon
              <sc-icon slot="suffix" name="shield-off--line"></sc-icon>
          </sc-menu-item>
      </sc-menu>
    `);

    const slot = el.shadowRoot?.querySelector('slot');
    slot?.setAttribute('role', 'menuitem');
    slot?.click();
    expect(el.width).to.equal('auto');
  });

  it('renders menu', async () => {
    const el = await fixture<ScMenu>(html`
        <sc-menu>
          <sc-menu-label>Option</sc-menu-label>
          <sc-menu-item>Option 1</sc-menu-item>
          <sc-menu-item>Option 2
            <sc-menu slot=submenu>
              <sc-menu-item>Option 1</sc-menu-item>
            </sc-menu>
          </sc-menu-item>
        </sc-menu>
    `);

    const menu1 = el.querySelectorAll('sc-menu-item')?.[1];
    menu1?.dispatchEvent(new KeyboardEvent('mousemove', { bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('mouseover', { bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('click', { bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('focusout', { bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, ctrlKey: true }));
    menu1?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, ctrlKey: true }));

    await el.updateComplete;
    const popup = menu1.shadowRoot?.querySelector('sl-popup');
    expect(popup).to.exist;
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScMenu>(
      html`<sc-menu><sc-menu-item>Option 1</sc-menu-item></sc-menu>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
