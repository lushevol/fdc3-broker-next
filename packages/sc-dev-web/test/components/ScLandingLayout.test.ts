import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScLandingLayout } from '../../src/components/ScLayout/ScLandingLayout.js';
import '../../elements/sc-landing-layout.js';
import '../../elements/sc-button.js';
import '../../elements/sc-dropdown-input.js';

describe('ScLandingLayout', () => {
  it('renders landing layout', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout banner-title='test'>
        <div slot='banner-body'>Banner body</div>
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);
    await fixture<ScLandingLayout>(html`
      <sc-landing-layout banner-body='test'
      >
        <div slot='banner-title'>title</div>
        <div slot='content'>Test</div>
      </sc-landing-layout>
    `);
    await fixture<ScLandingLayout>(html`
      <sc-landing-layout>
        <div slot='content'>Test</div>
      </sc-landing-layout>
    `);

    el.renderOnMobile();
    await el.updateComplete;

    expect(el.height).to.equal('auto');
  });

  it('renders header action slot when no action properties are provided', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout banner-title='test'>
        <div slot='header-action-slot' id='header-slot-content'>slot action</div>
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    const slot = el.querySelector('[slot="header-action-slot"]');
    expect(slot).to.exist;
    const headerActions = el.shadowRoot?.querySelector('.landing-header-actions');
    expect(headerActions).to.not.exist;
  });

  it('prefers property-based header actions over header action slot', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout
        banner-title='test'
        .headerPrimaryActions=${[{ label: 'Primary', value: 'p1' }]}
      >
        <div slot='header-action-slot'>slot action</div>
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    const actionContainer = el.shadowRoot?.querySelector('.landing-header-actions');
    expect(actionContainer).to.exist;
  });

  it('passes title-full-width to banner when header actions exist', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout
        banner-title='test'
        .headerPrimaryActions=${[{ label: 'Primary', value: 'p1' }]}
      >
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    const banner = el.shadowRoot?.querySelector('sc-banner');
    expect(banner).to.have.attribute('title-full-width');
  });

  it('emits sc-action with actionType and value for primary action selection', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout
        banner-title='test'
        .headerPrimaryActions=${[
          { label: 'Approve', value: 'approve' },
          { label: 'Reject', value: 'reject' },
        ]}
      >
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    let emittedDetail: any;
    el.addEventListener('sc-action', (event: any) => {
      emittedDetail = event.detail;
    });

    const dropdown = el.shadowRoot?.querySelector('sc-button-dropdown');
    dropdown?.dispatchEvent(new CustomEvent('sc-select', {
      detail: { value: 'approve' },
      bubbles: true,
      composed: true,
    }));

    expect(emittedDetail).to.deep.equal({ actionType: 'primary', value: 'approve' });
  });

  it('supports single object header action input by normalizing to array', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout banner-title='test'>
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    (el as any).headerPrimaryActions = { label: 'Only action', value: 'only' };
    await el.updateComplete;

    const button = el.shadowRoot?.querySelector('sc-button.landing-header-action-item') as any;
    expect(button).to.exist;
    expect(button.type).to.equal('primary');
  });

  it('uses dropdown for primary action when there are multiple actions', async () => {
    const el = await fixture<ScLandingLayout>(html`
      <sc-landing-layout
        banner-title='test'
        .headerPrimaryActions=${[
          { label: 'Approve', value: 'approve' },
          { label: 'Reject', value: 'reject' },
        ]}
      >
        <div slot='content'>Content</div>
      </sc-landing-layout>
    `);

    const dropdown = el.shadowRoot?.querySelector('sc-button-dropdown[type="primary"]');
    expect(dropdown).to.exist;
  });
});
