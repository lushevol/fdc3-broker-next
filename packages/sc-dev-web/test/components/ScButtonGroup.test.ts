import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScButtonGroup } from '../../src/components/ScButtonGroup/ScButtonGroup.js';
import '../../elements/sc-button-group.js';
import { mockMatchMedia } from '../shared/mediaQuery.js';

describe('ScButtonGroup', () => {
  function getOptions() {
    return html`
      <sc-button-group-item value='a'>Option A</sc-button-group-item>
      <sc-button-group-item value='b'>Option B</sc-button-group-item>
      <sc-button-group-item value='c' disabled>Option C</sc-button-group-item>`;
  }

  it('renders button group', async () => {
    const el = await fixture<ScButtonGroup>(
      html`<sc-button-group value='[\"a\"]' disabled>
        ${getOptions()}
      </sc-button-group>`
    );
    el.disabled = false;
    await el.updateComplete;

    const btns = el.querySelectorAll<HTMLElement>('sc-button-group-item');
    btns?.forEach(btn =>
      btn.shadowRoot?.querySelector<HTMLElement>('sc-button')?.click()
    );

    el.enableDeselect = true;
    el.value = '["a"]';
    await el.updateComplete;
    btns?.forEach(btn =>
      btn.shadowRoot?.querySelector<HTMLElement>('sc-button')?.click()
    );

    expect(el.disabled).to.equal(false);
    expect(el.enableDeselect).to.equal(true);
  });
  
  it('renders multiple', async () => {
    const el = await fixture<ScButtonGroup>(
      html`<sc-button-group value='a'>
        ${getOptions()}
      </sc-button-group>`
    );
    await el.updateComplete;

    const items = el.querySelectorAll<HTMLElement>('sc-button-group-item');
    items?.forEach(item => {
      const btn = item.shadowRoot?.querySelector<HTMLElement>('sc-button');
      btn?.click();
      btn?.click();
    });

    expect(el.singleSelect).to.equal(false);
  });
  
  it('renders single', async () => {
    const el = await fixture<ScButtonGroup>(
      html`<sc-button-group value='a' single-select>
        ${getOptions()}
      </sc-button-group>`
    );
    await el.updateComplete;

    const items = el.querySelectorAll<HTMLElement>('sc-button-group-item');
    items?.forEach(item => {
      const btn = item.shadowRoot?.querySelector<HTMLElement>('sc-button');
      btn?.click();
      btn?.click();
    });

    expect(el.singleSelect).to.equal(true);
  });
  
  it('renders button group sm', async () => {
    const el = await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='b'
            size='sm'
        >${getOptions()}</sc-button-group>
      `
    );
    await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='a'
            size='sm'
            readonly
        >${getOptions()}</sc-button-group>
      `
    );

    expect(el.readonly).to.equal(false);
  });
  
  it('renders button group md', async () => {
    const el = await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='b'
            size='md'
        >${getOptions()}</sc-button-group>
      `
    );
    await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='b'
            size='md'
            readonly
        >${getOptions()}</sc-button-group>
      `
    );

    expect(el.readonly).to.equal(false);
  });
  
  it('renders button group lg', async () => {
    const el = await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='b'
            size='lg'
        >${getOptions()}</sc-button-group>
      `
    );
    await fixture<ScButtonGroup>(
      html`
        <sc-button-group
            value='["1"]'
            size='lg'
            readonly
        >
            <sc-button-group-item value='1'>Option A</sc-button-group-item>
            <sc-button-group-item value='2'>Option B</sc-button-group-item>
            <sc-button-group-item value='3'>Option C</sc-button-group-item>
        </sc-button-group>
      `
    );

    expect(el.readonly).to.equal(false);
  });

  describe('mobile responsive', () => {
    beforeAll(() => mockMatchMedia());
    afterAll(() => mockMatchMedia.stopMocking());

    it('renders in mobile', async () => {
      const el = await fixture<ScButtonGroup>(
        html`<sc-button-group>
          <sc-button-group-item value="1">Option A</sc-button-group-item>
          <sc-button-group-item value="2">Option B</sc-button-group-item>
          <sc-button-group-item value="3">Option C</sc-button-group-item>
        </sc-button-group>`
      );
      await el.updateComplete;

      expect(el.isMobile).to.equal(false);
      expect(el.isTablet).to.equal(false);
      expect(el.isDesktop).to.equal(false);

      mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
      await el.updateComplete;

      expect(el.isMobile).to.equal(true);
      expect(el.isTablet).to.equal(false);
      expect(el.isDesktop).to.equal(false);

      mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
      await el.updateComplete; 
      expect(el.isMobile).to.equal(false);

      // disconnect coverage
      el.remove();
    });

  });

});
