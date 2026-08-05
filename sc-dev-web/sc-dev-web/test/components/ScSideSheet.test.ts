import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScSideSheet } from '../../src/components/ScSheet/ScSideSheet.js';
import '../../elements/sc-side-sheet.js';

describe('ScSideSheet', () => {
  it('renders default side sheet', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet></sc-side-sheet>`
    );

    expect(el.position).to.equal('right');
    expect(el.label).to.equal('');
    expect(el.noHeader).to.equal(false);
    expect(el.noCloseIcon).to.equal(false);
    expect(el.open).to.equal(false);
    expect(el.noFooter).to.equal(true);
    expect(el.noHeaderBottomBorder).to.equal(false);
    expect(el.noFooterTopBorder).to.equal(false);
  });

  it('renders side sheet with label', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet label="Actions" open></sc-side-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders side sheet with no header', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet no-header></sc-side-sheet>`
    );
    expect(el.noHeader).to.equal(true);
  });

  it('renders side sheet with no close icon', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet no-close-icon></sc-side-sheet>`
    );
    expect(el.noCloseIcon).to.equal(true);
  });

  it('renders left side sheet', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet position="left"></sc-side-sheet>`
    );
    expect(el.position).to.equal('left');
  });

  it('renders width', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet width="200px"></sc-side-sheet>`
    );
    expect(el.width).to.equal('200px');
  });

  it('renders size', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet size="lg"></sc-side-sheet>`
    );
    expect(el.size).to.equal('lg');
  });

  it('trigger sl-hide events', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet size="lg"></sc-side-sheet>`
    );
    await elementUpdated(el);
    const slDrawer: any = el.renderRoot?.querySelector('sl-drawer');
    const slCloseIcon: any = slDrawer.renderRoot?.querySelector('.drawer__close');
    if (slCloseIcon) {
      slCloseIcon.click();
      expect(slDrawer.open).to.equal(false);
    }
  });

  it('renders side sheet with no-footer', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet no-footer></sc-side-sheet>`
    );
    expect(el.noFooter).to.equal(true);
  });
  it('renders side sheet with no-header-bottom-border', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet no-header-bottom-border></sc-side-sheet>`
    );
    expect(el.noHeaderBottomBorder).to.equal(true);
  });
  it('renders side sheet with no-header-bottom-border', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet no-footer-top-border></sc-side-sheet>`
    );
    expect(el.noFooterTopBorder).to.equal(true);
  });
  it('emits sc-action event on button click', async () => {
    const el = await fixture<ScSideSheet>(
      html`<sc-side-sheet></sc-side-sheet>`
    );
    el.noFooter = false;
    el.primaryAction = 'skip';
    el.primaryActionLabel = 'Skip';
    await elementUpdated(el);
    await el.updateComplete;
    const eventSpy = new Promise<CustomEvent>(resolve => {
      el.addEventListener('sc-action', event => {
        resolve(event as CustomEvent);
      });
    });
    const scButton = el.shadowRoot?.querySelector('sc-button');

    scButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    const event = await eventSpy as CustomEvent;
    expect(event.detail).to.have.property('target', scButton);
    expect(event.detail).to.have.property('name', 'skip');
  });
});
