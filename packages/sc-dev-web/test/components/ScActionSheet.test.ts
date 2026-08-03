import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScActionSheet } from '../../src/components/ScSheet/ScActionSheet.js';
import '../../elements/sc-action-sheet.js';

describe('ScActionSheet', () => {
  it('renders default action sheet', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet></sc-action-sheet>`
    );

    expect(el.label).to.equal('');
    expect(el.open).to.equal(false);
  });

  it('renders action sheet with label', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet label="Actions"></sc-action-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders action sheet auto open and height', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet label="Actions" open height="100px"></sc-action-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders action sheet with no close icon', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet 
        label="Actions" 
        open 
        no-close-icon 
        disable-outside-click
      ></sc-action-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders action sheet with action', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet 
        primary-action="submit" 
        no-header 
        open 
        primary-action-label="Submit"
      ></sc-action-sheet>`
    );
    expect(el.primaryAction).to.equal('submit');
    expect(el.primaryActionLabel).to.equal('Submit');
  });

  it('trigger sl-show events', async () => {
    const el = await fixture<ScActionSheet>(
      html`<sc-action-sheet 
        primary-action="submit" 
        no-header 
        primary-action-label="Submit"
      ></sc-action-sheet>`
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
