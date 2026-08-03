import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScDialog } from '../../src/components/ScDialog.js';
import '../../elements/sc-dialog.js';

describe('ScDialog', () => {
  it('should pass accessibility tests', async () => {
    const el = await fixture<ScDialog>(html`<sc-dialog></sc-dialog>`);
    expect(el).to.be.accessible();
  });

  it('renders default dialog', async () => {
    const el = await fixture<ScDialog>(html`<sc-dialog label='test'></sc-dialog>`);
    expect(el.label).to.equal('test');
  });

  it('renders open dialog', async () => {
    const el = await fixture<ScDialog>(html`<sc-dialog label='test' open></sc-dialog>`);
    expect(el.open).to.equal(true);
  });

  it('trigger sl-show events', async () => {
    const el = await fixture<ScDialog>(html`<sc-dialog label='test'></sc-dialog>`);
    await elementUpdated(el);
    const slDialog: any = el.renderRoot?.querySelector('sl-dialog');
    const slCloseIcon: any = slDialog.renderRoot?.querySelector('.dialog__close');
    await elementUpdated(el);
    if (slCloseIcon) {
      slCloseIcon.click();
      expect(slDialog.open).to.equal(false);
    }
  });
});
