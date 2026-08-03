import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScBottomSheet } from '../../src/components/ScSheet/ScBottomSheet.js';
import '../../elements/sc-bottom-sheet.js';

describe('ScBottomSheet', () => {
  it('renders default bottom sheet', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet></sc-bottom-sheet>`
    );

    expect(el.label).to.equal('');
    expect(el.noCloseIcon).to.equal(false);
    expect(el.open).to.equal(false);
    expect(el.expandable).to.equal(false);
  });

  it('renders bottom sheet with label', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet label="Actions" open></sc-bottom-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders bottom sheet auto open and height', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet label="Actions" open height="100px"></sc-bottom-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders bottom sheet with no close icon', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet no-close-icon disable-outside-click  open></sc-bottom-sheet>`
    );
    expect(el.noCloseIcon).to.equal(true);
  });

  it('renders expandable', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet expandable no-header></sc-bottom-sheet>`
    );
    expect(el.height).to.equal('auto');
  });

  it('trigger sl-hide events', async () => {
    const el = await fixture<ScBottomSheet>(
      html`<sc-bottom-sheet expandable no-header></sc-bottom-sheet>`
    );
    await elementUpdated(el);
    const slDrawer: any = el.renderRoot?.querySelector('sl-drawer');
    const slCloseIcon: any = slDrawer.renderRoot?.querySelector('.drawer__close');
    if (slCloseIcon) {
      slCloseIcon.click();
      expect(slDrawer.open).to.equal(false);
    }
  });
});
