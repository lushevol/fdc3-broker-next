import { html } from 'lit';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import { ScBreadcrumb } from '../../src/components/ScBreadcrumb/ScBreadcrumb.js';
import '../../elements/sc-breadcrumb.js';
import '../../elements/sc-breadcrumb-item.js';

describe('ScBreadcrumb', () => {
  it('renders alert breadcrumb', async () => {
    const el = await fixture<ScBreadcrumb>(html`
      <sc-breadcrumb><sc-breadcrumb-item>Test</sc-breadcrumb-item></sc-breadcrumb>
    `);
    await fixture<ScBreadcrumb>(html` <sc-breadcrumb>
      <sc-breadcrumb-item>Test1</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test2</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test3</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test4</sc-breadcrumb-item>
    </sc-breadcrumb>`);
    await fixture<ScBreadcrumb>(html` <sc-breadcrumb compressed>
      <sc-breadcrumb-item>Test1</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test2</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test3</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test4</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test5</sc-breadcrumb-item>
    </sc-breadcrumb>`);
    await fixture<ScBreadcrumb>(html` <sc-breadcrumb compressed>
      <sc-breadcrumb-item>Test1</sc-breadcrumb-item>
      <sc-breadcrumb-item>Test2</sc-breadcrumb-item>
    </sc-breadcrumb>`);

    expect(el.compressed).to.equal(false);
  });

  it('fill property should work as expected', async () => {
    // initialized without fill prop
    let el = await fixture<ScBreadcrumb>(html`
      <sc-breadcrumb><sc-breadcrumb-item>Test</sc-breadcrumb-item></sc-breadcrumb>
    `);
    expect(el.fill).to.equal(false);
    expect(el.shadowRoot?.querySelector('.sc-breadcrumb-wrap-fill')).to.equal(null);
    // on fill prop changed
    el.fill = true;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.sc-breadcrumb-wrap-fill')).not.to.equal(null);

    // initialized with fill prop
    el = await fixture<ScBreadcrumb>(html`
      <sc-breadcrumb fill><sc-breadcrumb-item>Test</sc-breadcrumb-item></sc-breadcrumb>
    `);
    expect(el.fill).to.equal(true);
    expect(el.shadowRoot?.querySelector('.sc-breadcrumb-wrap-fill')).not.to.equal(null);
    // on fill prop changed
    el.fill = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.sc-breadcrumb-wrap-fill')).to.equal(null);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBreadcrumb>(
      html`<sc-breadcrumb label="Test"></sc-breadcrumb>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('when breadcrumb item click', async () => {
    const el = await fixture<ScBreadcrumb>(
      html`<sc-breadcrumb label="Test" class="sc-breadcrumb">
        <sc-breadcrumb-item>Test1</sc-breadcrumb-item>
      </sc-breadcrumb>`
    );
    const scBreadcrumb = el.shadowRoot?.querySelector('.sc-breadcrumb');
    scBreadcrumb?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await expect(el).shadowDom.to.be.accessible();
  });

});
