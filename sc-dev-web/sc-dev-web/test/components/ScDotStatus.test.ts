import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDotStatus } from '../../src/components/ScDotStatus/ScDotStatus.js';
import '../../elements/sc-dot-status.js';

describe('ScDotStatus', () => {
  it('renders default dot status', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="default" type="error" inline label="Test"></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status type="info"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="warning"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="success"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="disabled"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="test"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="urgent-error"></sc-dot-status>`);

    expect(el.mode).to.equal('default');
  });

  it('renders icon dot status', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="error" inline label="Test"></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="test"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="error"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="minor-error"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="warning"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="success"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="partially-success"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="info"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="pending"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="draft"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="missing-info"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="rejected"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="on-hold"></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="not-started"></sc-dot-status>`);

    expect(el.outline).to.equal(false);
  });

  it('renders icon outline dot status', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="error" inline label="Test" outline></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="test" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="error" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="minor-error" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="warning" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="success" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="partially-success" outline></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="info" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="pending" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="draft" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="missing-info" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="rejected" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="on-hold" outline></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="not-started" outline></sc-dot-status>`);

    expect(el.outline).to.equal(true);
  });

  it('renders default dot status compact', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="default" type="error" inline label="Test"></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status type="info" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="warning" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="success" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="disabled" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status type="test" compact></sc-dot-status>`);

    expect(el.mode).to.equal('default');
  });

  it('renders icon dot status compact', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="error" inline label="Test"></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="test" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="error" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="minor-error" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="warning" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="success" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="partially-success" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="info" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="pending" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="draft" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="missing-info" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="rejected" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="on-hold" compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="not-started" compact></sc-dot-status>`);

    expect(el.outline).to.equal(false);
  });

  it('renders icon outline dot status compact', async () => {
    const el = await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="error" inline label="Test" inline outline compact></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="test" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="error" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="minor-error" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="warning" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="success" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="advanced" status="partially-success" inline outline compact></sc-dot-status>`
    );
    await fixture<ScDotStatus>(html`<sc-dot-status mode="icon" status="info" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="pending" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="draft" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="missing-info" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="rejected" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="on-hold" inline outline compact></sc-dot-status>`);
    await fixture<ScDotStatus>(
      html`<sc-dot-status mode="icon" status="not-started" inline outline compact></sc-dot-status>`);

    expect(el.outline).to.equal(true);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScDotStatus>(html`<sc-dot-status></sc-dot-status>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
