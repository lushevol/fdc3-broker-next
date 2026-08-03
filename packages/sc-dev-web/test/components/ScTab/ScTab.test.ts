import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ANIMATE_INDICATOR, INDICATOR, ScTab } from '../../../src/components/ScTab/ScTab.js';
import type { ScTabGroup } from '../../../elements/sc-tab-group.js';
// eslint-disable-next-line no-duplicate-imports
import '../../../elements/sc-tab-group.js';

describe('ScTab', () => {
  it('renders default tab', async () => {
    const el = await fixture<ScTab>(
      html` <sc-tab panel="tab1"> tab1-name </sc-tab> `
    );

    expect(el.panel).to.equal('tab1');
  });

  it('renders active tab', async () => {
    const el = await fixture<ScTab>(
      html` <sc-tab panel="tab1" active> tab1-name </sc-tab> `
    );

    expect(el.active).to.equal(true);
  });

  it('renders disabled tab', async () => {
    const el = await fixture<ScTab>(
      html` <sc-tab panel="tab1" disabled> tab1-name </sc-tab> `
    );

    expect(el.disabled).to.equal(true);
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
        <sc-tab-group class="sc-tabs">
          <sc-tab slot="nav" closable panel="tab1" id="tab1">
            tab1-name
          </sc-tab>
          <sc-tab slot="nav" panel="tab2" id="tab2" active>
            tab2-name
          </sc-tab>
          ${ tab3 }
          <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
          <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
          <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
        </sc-tab-group>
      `
    );
    const tabArr = el.querySelectorAll('sc-tab');
    const tab1 = tabArr[0];
    const closeIcon = tab1.shadowRoot?.querySelector('sc-icon[name="cross"]');
    expect(closeIcon).to.exist;
    closeIcon?.dispatchEvent(new MouseEvent('click'));
    const previousTab = tabArr[1];
    tab3[ANIMATE_INDICATOR](previousTab);
    expect(previousTab).to.exist;
    const mockAnimation = {
      cancel: jest.fn(),
      finish: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      reverse: jest.fn(),
      currentTime: 0,
      playState: 'running',
    };
    (tab3[INDICATOR] as any).getAnimations = jest.fn(() => [mockAnimation]);
    (tab3[INDICATOR] as any).animate = jest.fn(() => ({
      onfinish: jest.fn(),
      cancel: jest.fn(),
      finished: Promise.resolve(),
    }));
    expect((tab3[INDICATOR] as any).getAnimations).to.exist;
    expect((tab3[INDICATOR] as any).animate).to.exist;
    tab3.click();
    aTimeout(50);
    await el.updateComplete;
    expect(tab3.active).to.true;
  });

  it('tab event', async () => {
    const el = await fixture<ScTab>(
      html`
        <sc-tab panel="tab1">
          tab1-name
        </sc-tab>
      `
    );
    el.focus();
    el.blur();
  });

  it('renders tab icon', async () => {
    const el = await fixture<ScTab>(
      html` <sc-tab panel="tab1" icon="alert-circle--fill"> tab1-name </sc-tab> `
    );
    expect(el.icon).to.equal('alert-circle--fill');
  });

  it('renders tab counter', async () => {
    const el = await fixture<ScTab>(
      html` <sc-tab panel="tab1" counter="20"> tab1-name </sc-tab> `
    );
    expect(el.counter).to.equal(20);
  });
});
