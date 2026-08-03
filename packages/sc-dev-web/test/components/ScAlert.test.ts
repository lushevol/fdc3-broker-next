import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScAlert } from '../../src/components/ScAlert/ScAlert.js';
import '../../elements/sc-alert.js';

describe('ScAlert', () => {
  it('renders info alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="info" open></sc-alert>`
    );

    expect(el.type).to.equal('info');
  });

  it('renders info banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="info" mode="banner" open></sc-alert>`
    );

    expect(el.type).to.equal('info');
  });

  it('renders success closable alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="success" open closable></sc-alert>`
    );

    expect(el.type).to.equal('success');
    expect(el.closable).to.equal(true);
  });

  it('renders success banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="success" mode="banner" open closable></sc-alert>`
    );

    expect(el.type).to.equal('success');
    expect(el.closable).to.equal(true);
  });

  it('renders warning alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="warning" open></sc-alert>`
    );

    expect(el.type).to.equal('warning');
  });

  it('renders warning banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="warning" mode="banner" open></sc-alert>`
    );

    expect(el.type).to.equal('warning');
  });

  it('renders error alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="error" open></sc-alert>`
    );

    expect(el.type).to.equal('error');
  });

  it('renders error banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="error" mode="banner" open></sc-alert>`
    );

    expect(el.type).to.equal('error');
  });

  it('renders disabled alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="disabled" open></sc-alert>`
    );

    expect(el.type).to.equal('disabled');
  });

  it('renders disabled banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="disabled" mode="banner" open></sc-alert>`
    );

    expect(el.type).to.equal('disabled');
  });

  it('renders blank alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="blank" open></sc-alert>`
    );

    expect(el.type).to.equal('blank');
  });

  it('renders blank banner alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="blank" mode="banner" open></sc-alert>`
    );

    expect(el.type).to.equal('blank');
  });

  it('renders collapsible alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="error" title="Toggle me" open></sc-alert>`
    );

    expect(el.type).to.equal('error');
  });

  it('renders full-width alert', async () => {
    const el = await fixture<ScAlert>(
      html`<sc-alert type="error" title="Toggle me" mode="banner" full-width></sc-alert>`
    );

    expect(el.fullWidth).to.equal(true);
  });
});
