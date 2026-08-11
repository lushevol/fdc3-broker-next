import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSpacer } from '../../src/components/ScSpacer/ScSpacer.js';
import '../../elements/sc-spacer.js';

describe('ScSpacer', () => {
  it('renders spacer horizontal', async () => {
    const el = await fixture<ScSpacer>(html`<sc-spacer size="04"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="04"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="08"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="12"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="16"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="20"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="24"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="32"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="40"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="48"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="56"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="64"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="xxs"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="xs"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="sm"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="md"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="lg"></sc-spacer>`);
    expect(el.size).to.equal('04');
  });

  it('renders spacer vertical', async () => {
    const el = await fixture<ScSpacer>(html`<sc-spacer size="04"></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="04" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="08" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="12" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="16" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="20" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="24" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="32" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="40" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="48" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="56" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="64" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="xxs" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="xs" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="sm" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="md" vertical></sc-spacer>`);
    fixture<ScSpacer>(html`<sc-spacer size="lg" vertical></sc-spacer>`);
    expect(el.size).to.equal('04');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScSpacer>(html`<sc-spacer></sc-spacer>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
