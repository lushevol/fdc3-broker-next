import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScListNavigation, findParents } from '../../src/components/ScListNavigation/ScListNavigation.js';
import '../../elements/sc-list-navigation.js';

const items = [
  {
    key: '1',
    title: 'Menu 1',
    body: 'Menu body 1',
  }, {
    key: '2',
    title: 'Menu 2',
    body: 'Menu body 2',
    open: true,
    children: [
      {
        key: '2-1',
        title: 'Menu 2-1',
        body: 'Menu body 2-1',
        selected: true,
      }, 
      {
        key: '2-2',
        title: 'Menu 2-2',
        body: 'Menu body 2-2',
        children: [
          {
            key: '2-2-1',
            title: 'Menu 2-2-1',
            body: 'Menu body 2-2-1',
          },  
        ],
      }, 
    ],
  }, {
    key: '3',
    title: 'Menu 3',
    body: 'Menu body 3',
    disabled: true,
  }, 
];

describe('ScListNavigation', () => {
  it('renders list navigation', async () => {
    const el = await fixture<ScListNavigation>(html`
      <sc-list-navigation
        ><sc-list-navigation-item>Test</sc-list-navigation-item></sc-list-navigation
      >
    `);
    await fixture<ScListNavigation>(html` <sc-list-navigation>
      <sc-list-navigation-item selected title='title' body='subTitle'>Test1</sc-list-navigation-item>
      <sc-list-navigation-item title='title'>Test2</sc-list-navigation-item>
      <sc-list-navigation-item prefixIcon='api' title='title' disabled="true">Test3</sc-list-navigation-item>
    </sc-list-navigation>`);

    fixture<ScListNavigation>(html` <sc-list-navigation space-size='sm' box>
      <sc-list-navigation-item title='title' body='subTitle'>Test1</sc-list-navigation-item>
      <sc-list-navigation-item title='title'><div slot='body'>body</div>Test2</sc-list-navigation-item>
      <sc-list-navigation-item prefixIcon='api' title='title'>Test3</sc-list-navigation-item>
    </sc-list-navigation>`);

    fixture<ScListNavigation>(html` <sc-list-navigation space-size='sm' box>
      <sc-list-navigation-item title='title' body='subTitle' prefix='info-circle--line' 
        suffix='' title-size='sm'
      >Test1</sc-list-navigation-item>
      <sc-list-navigation-item title='title' title-line='3' body-line='2' href=''>Test2</sc-list-navigation-item>
      <sc-list-navigation-item prefixIcon='api' title='title'>Test3</sc-list-navigation-item>
    </sc-list-navigation>`);

    expect(el.box).to.equal(false);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation></sc-list-navigation>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('renders by items', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items}></sc-list-navigation>`
    );

    await expect(el.items.length).to.equal(items.length);
  });

  it('show right arrow', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items} show-right-arrow></sc-list-navigation>`
    );

    await expect(el.showRightArrow).to.equal(true);
  });

  it('renders search field', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items} searchable></sc-list-navigation>`
    );

    await expect(el.searchable).to.equal(true);
  });

  it('find parents', async () => {
    const parents = findParents(items[1], '2-2-1', []);
    expect(parents.length).to.equal(2);
  });

  it('onItemClick', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items} searchable></sc-list-navigation>`
    );
    // @ts-ignore
    const downwardIcons = el.shadowRoot?.querySelectorAll('sc-list-navigation-item sc-icon[name="arrow-ios-downward"]');
    expect(downwardIcons && Array.from(downwardIcons).length).to.equal(1);
    await el.onItemClick(items[1]);
    await el.updateComplete;
    // @ts-ignore
    const downwardIcons2 = 
      el.shadowRoot?.querySelectorAll('sc-list-navigation-item sc-icon[name="arrow-ios-downward"]');
    expect(downwardIcons2 && Array.from(downwardIcons2).length).to.equal(0);
  });

  it('onSearchInputChange', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items} searchable></sc-list-navigation>`
    );
    await el.onSearchInputChange(new CustomEvent('sc-input', {
      detail: {
        value: 'Menu',
      },
    }));
    const searchField = el.shadowRoot?.querySelector('sc-search-field');
    const menu = searchField?.shadowRoot?.querySelector('sl-dropdown')?.querySelector('sl-menu');
    expect(menu).to.not.equal(null);
  });

  it('onSearch', async () => {
    const el = await fixture<ScListNavigation>(
      html`<sc-list-navigation .items=${items} searchable></sc-list-navigation>`
    );
    await el.onSearch(new CustomEvent('sc-input', {
      detail: {
        value: 'Menu 2-1',
      },
    }));
    const searchField = el.shadowRoot?.querySelector('sc-search-field');
    expect(searchField?.value).to.equal('');
  });
});
