import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScMenuBar } from '../../../src/components/ScMenuBar/ScMenuBar.js';
import { mockMatchMedia } from '../../shared/mediaQuery.js';
import '../../../elements/sc-menu-bar.js';
import { mockAnimation } from '../../shared/animation.js';

const data = [
  {
    title: 'Call activity',
    width: 'calc(100vw - 120px)',
    leftPosition: '100px',
    menuItems: [
      { title: 'Menu item 1', description: 'Find your colleagues', category: 'Title1', prefixIcon: 'home--line' },
      { title: 'Menu item 2', description: 'Find your colleagues', category: 'Title1' },
      { title: 'Menu item 3', description: 'Find your colleagues', category: 'Title1' },
      { title: 'Menu item 4', description: 'Find your colleagues', category: 'Title1' },
      { title: 'Menu item 5', description: 'Find your colleagues', category: 'Title1' },
      { title: 'Menu item 1', description: 'Find your colleagues', category: 'Title2' },
      { title: 'Menu item 1', description: 'Find your colleagues', category: 'Title3' },
      { title: 'Menu item 2', description: 'Find your colleagues', category: 'Title3' },
      { title: 'Menu item 3', description: 'Find your colleagues', category: 'Title3' },
      { title: 'Menu item 1', description: 'Find your colleagues', category: 'Title4' },
      { title: 'Menu item 2', description: 'Find your colleagues', category: 'Title4' },
    ],
  },
  {
    title: 'My customers',
    selected: true,
    menuItems: [
      { title: 'Menu item 1', prefixIcon: 'home--line',  href: '#', selected: true },
      { title: 'Menu item 2' },
      { title: 'Menu item 3' },
      { title: 'Menu item 4' },
      { title: 'Menu item 5' },
      { title: 'Menu item 6' },
    ],
  },
  {
    title: 'My dashboard',
    href: '#',
    selected: true,
  },
  {
    title: 'My service',
    href: '#',
  },
];

describe('ScMenuBar', () => {
  beforeEach(() => mockAnimation());
  it('renders MenuBar', async () => {
    const el = await fixture<ScMenuBar>(html`
      <sc-menu-bar
        .data=${data} 
      >
      </sc-menu-bar>
    `);
    el.handleMenuClick(new Event('click'), {
      href: '#',
    });
    el.onScMenuItemClick(new Event('click'), {});
    await fixture<ScMenuBar>(html`
      <sc-menu-bar
        max-row=4
        menu-distance=20
        .data=${data} 
      >
      </sc-menu-bar>
    `);

    expect(el.menuDistance).to.equal(10);
  });
  
  it('renders in mobile', async () => {
    mockMatchMedia();
    const el = await fixture<ScMenuBar>(html`<sc-menu-bar .data=${data}></sc-menu-bar>`);
    mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
    el.requestUpdate();
    await el.updateComplete;
    expect(el.isMobile).to.equal(true);
    const icon: HTMLElement | null | undefined = el.shadowRoot?.querySelector('sc-icon[name=menu]');
    expect(icon).to.exist;
    icon?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('sc-side-sheet')).to.exist;
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScMenuBar>(
      html`<sc-menu-bar></sc-menu-bar>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('closes opened dropdowns when clicking a top-level link', async () => {
    const el = await fixture<ScMenuBar>(html`
      <sc-menu-bar .data=${data}></sc-menu-bar>
    `);

    let hideCalled = false;
    const mockDropdown = {
      hide: () => {
        hideCalled = true;
      },
    };
    (el.renderRoot as any).querySelectorAll = () => [mockDropdown];

    // Avoid jsdom's not-implemented window.open while still testing click handling.
    el.preventDefaultLink = true;
    el.handleMenuClick(new Event('click'), { href: '/demo/home' });

    expect(hideCalled).to.equal(true);
  });
});
