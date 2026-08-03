import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScBadge } from '../../src/components/ScBadge/ScBadge.js';
import '../../elements/sc-badge.js';

describe('ScBadge', () => {
  it('renders number badge', async () => {
    const el = await fixture<ScBadge>(html`<sc-badge ></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="blue" number="0"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="dark-blue" number="10"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="amber" number="100"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="green" number="1000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="grey" number="10000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="red" number="100000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" color="transparent" number="100000"></sc-badge>`);

    expect(el.type).to.equal('number');
  });

  it('renders brand badge', async () => {
    const el = await fixture<ScBadge>(html`<sc-badge type="text"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="blue" label="0"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="dark-blue" label="10"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="amber" label="100"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="green" label="1000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="grey" label="10000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="red" label="100000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" color="transparent" label="100000"></sc-badge>`);

    expect(el.type).to.equal('text');
  });

  it('renders number badge outlined', async () => {
    const el = await fixture<ScBadge>(html`<sc-badge outlined></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="blue" number="0"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="dark-blue" number="10"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="amber" number="100"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="green" number="1000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="grey" number="10000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="red" number="100000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="number" outlined color="transparent" number="100000"></sc-badge>`);

    expect(el.type).to.equal('number');
  });

  it('renders brand badge outlined', async () => {
    const el = await fixture<ScBadge>(html`<sc-badge type="text" outlined></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="blue" label="0"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="dark-blue" label="10"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="amber" label="100"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="green" label="1000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="grey" label="10000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="red" label="100000"></sc-badge>`);
    await fixture<ScBadge>(html`<sc-badge type="text" outlined color="transparent" label="100000"></sc-badge>`);

    expect(el.type).to.equal('text');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScBadge>(html`<sc-badge></sc-badge>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  it('renders size badge', async () => {
    let el;
    el = await fixture<ScBadge>(html`<sc-badge size="lg"></sc-badge>`);
    expect(el.size).to.equal('lg');
    el = await fixture<ScBadge>(html`<sc-badge size="sm"></sc-badge>`);
    expect(el.size).to.equal('sm');
    el = await fixture<ScBadge>(html`<sc-badge size="test"></sc-badge>`);
    expect(el.size).to.equal('test');
    el = await fixture<ScBadge>(html`<sc-badge></sc-badge>`);
    expect(el.size).to.equal('md');
  });
});
