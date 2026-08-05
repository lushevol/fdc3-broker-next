import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import type { ScTabGroup } from '../../../src/components/ScTab/ScTabGroup.js';
import type { ScTab } from '../../../src/components/ScTab/ScTab.js';
import '../../../elements/sc-tab-group.js';

class IntersectionObserver {
  observe() {}
  unobserve() {}
}

class ResizeObserver {
  observe() {}
  unobserve() {}
}
describe('ScTabGroup', () => {
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
  // @ts-ignore
  global.IntersectionObserver = IntersectionObserver;
  it('renders default tab group', async () => {
    const el = await fixture<ScTabGroup>(
      html`
        <sc-tab-group class="sc-tabs">
          <sc-tab slot="nav" panel="tab1"> tab1-name </sc-tab>
          <sc-tab slot="nav" panel="tab2" active> tab2-name </sc-tab>
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
        </sc-tab-group>
      `
    );

    expect(el.querySelectorAll('sc-tab').length).to.equal(2);
    expect(el.querySelectorAll('sc-tab-panel').length).to.equal(2);
  });
  it('remove tab', async () => {
    const el = await fixture<ScTabGroup>(
      html`
        <sc-tab-group class="sc-tabs">
          <sc-tab slot="nav" closable panel="tab1"> tab1-name </sc-tab>
          <sc-tab slot="nav" closable panel="tab2" active> tab2-name </sc-tab>
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
        </sc-tab-group>
      `
    );
    const tabs = el.querySelectorAll('sc-tab');
    const closeIcon = tabs[0].shadowRoot?.querySelector('sc-icon');
    closeIcon?.click();

    expect(el.querySelectorAll('sc-tab').length).to.equal(1);
    expect(el.querySelectorAll('sc-tab-panel').length).to.equal(1);
  });
  it('tab animation', async () => {
    const tab3 = await fixture<ScTab>(
      html`
      <sc-tab slot="nav" panel="tab3" id="tab3">
        tab3-name
      </sc-tab>
      `
    );
    const el = await fixture<ScTabGroup>(
      html`
        <sc-tab-group class="sc-tabs" >
          <sc-tab slot="nav" closable panel="tab1" id="tab1">
            tab1-name
          </sc-tab>
          <sc-tab slot="nav" closable panel="tab2" id="tab2" active>
            tab2-name
          </sc-tab>
          ${tab3}
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
          <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
        </sc-tab-group>
      `
    );
    await el.connectedCallback();
    aTimeout(50);
    expect(el.nav).to.exist;
    el.nav.style.width = '1000px';
    el.nav.style.height = '200px';
    aTimeout(50);
    await el.updateComplete;
    const tabArr = el.querySelectorAll('sc-tab');
    const panels:any = el.querySelectorAll('sc-tab-panel');
    expect(tabArr?.length).to.equal(3);
    expect(panels?.length).to.equal(3);
    function setAriaLabels() {
      tabArr.forEach((tab,i) => {
        const panel = panels[i];
        if (panel) {
          tab.setAttribute('aria-controls', panel.getAttribute('name')!); // eslint-disable-line
          panel.setAttribute('aria-labelledby', tab.getAttribute('id')!); // eslint-disable-line
        }
      });
    }
    const tab:any = tabArr[0];
    tab.disabled = true;
    expect(tab.disabled).to.true;
    setAriaLabels();
    aTimeout(50);
    await el.updateComplete;
    expect(tab.getAttribute('aria-controls')).to.equal('tab1');
    el.tabGroup.click();
    aTimeout(50);
    await el.updateComplete;
  });
  it('tab event', async () => {
    const tab3 = await fixture<ScTab>(
      html`
      <sc-tab slot="nav" panel="tab3" id="tab3">
        tab3-name
      </sc-tab>
      `
    );
    const el = await fixture<ScTabGroup>(
      html`
        <sc-tab-group class="sc-tabs" >
          <sc-tab slot="nav" closable panel="tab1" id="tab1">
            tab1-name
          </sc-tab>
          <sc-tab slot="nav" closable panel="tab2" id="tab2" active>
            tab2-name
          </sc-tab>
          ${tab3}
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
          <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
        </sc-tab-group>
      `
    );
    const tabArr = el.querySelectorAll('sc-tab');
    const tab1:any = tabArr[0];
    let event:any = new MouseEvent('click', { bubbles: true });
    tab1.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    tab3.dispatchEvent(event);
    tab1.focus();
    event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    tab3.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
    tab3.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
    tab3.dispatchEvent(event);
    for (let i = 0;i < 4;i++) {
      event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      tab3.dispatchEvent(event);
    }
    for (let i = 0;i < 4;i++) {
      event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      tab3.dispatchEvent(event);
    }
    await el.updateComplete;
    const tabgroupNav = el.shadowRoot?.querySelector('.tab-group__nav');
    expect(tabgroupNav).to.exist;
    tabgroupNav?.dispatchEvent(new CustomEvent('scroll'));
    el.renderStartScroll();
    el.renderEndScroll();
    aTimeout(50);
    await el.updateComplete;
    el.nav.scrollLeft = 3;
    Object.defineProperty(el.nav,'scrollWidth',{
      value: 7,
      configurable: true,
    });
    Object.defineProperty(el.nav,'clientWidth',{
      value: 1,
      configurable: true,
    });
    expect(el.nav.scrollLeft - 2).to.equal(1);
    expect(el.nav.scrollWidth - el.nav.clientWidth).to.equal(6);
    tabgroupNav?.dispatchEvent(new CustomEvent('scroll'));
    aTimeout(50);
    await el.updateComplete;
    const scrollButtonStart = el.shadowRoot?.querySelector('.tab-group__scroll-button--start');
    expect(scrollButtonStart).to.exist;
    const scrollButtonEnd = el.shadowRoot?.querySelector('.tab-group__scroll-button--end');
    expect(scrollButtonEnd).to.exist;
    el.nav.scroll = jest.fn();
    scrollButtonStart?.dispatchEvent(new MouseEvent('click'));
    scrollButtonEnd?.dispatchEvent(new MouseEvent('click'));
    el.noScrollControls = true;
    expect(el.noScrollControls).to.true;
    el.show('tab1');
    expect(tab1.active).to.true;
    tab1.dispatchEvent(new CustomEvent('sc-close',{
      bubbles: true,
      detail: {
        tab: tab1,
      },
    }));
  });
  it('renders filled tab group', async () => {
    const el = await fixture<ScTabGroup>(
      html`
        <sc-tab-group class="sc-tabs" type='filled'>
          <sc-tab slot="nav" closable panel="tab1"> tab1-name </sc-tab>
          <sc-tab slot="nav" closable panel="tab2" active> tab2-name </sc-tab>
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
        </sc-tab-group>
      `
    );
    expect(el.type).to.equal('filled');
  });
});
