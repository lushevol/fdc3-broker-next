import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSpinner } from '../../src/components/ScSpinner/ScSpinner.js';
import '../../elements/sc-spinner.js';

describe('ScSpinner', () => {
  it('renders lg size spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner size="lg"></sc-spinner>`
    );

    expect(el.size).to.equal('lg');
  });
  it('renders md size spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner size="md"></sc-spinner>`
    );

    expect(el.size).to.equal('md');
  });
  it('renders sm size spinner', async () => {
    const el = await fixture<ScSpinner>(html`<sc-spinner size="sm"></sc-spinner>`);

    expect(el.size).to.equal('sm');
  });
  it('renders white sm spinner', async () => {
    const el = await fixture<ScSpinner>(html`<sc-spinner size="sm" color="white"></sc-spinner>`);

    expect(el.size).to.equal('sm');
  });
  it('renders page with sm spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner type="page" size="sm"></sc-spinner>`
    );

    expect(el.size).to.equal('sm');
  });

  it('renders page with md spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner type="page" size="md"></sc-spinner>`
    );

    expect(el.size).to.equal('md');
  });

  it('renders page with lg spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner type="page" size="lg"></sc-spinner>`
    );

    expect(el.size).to.equal('lg');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScSpinner>(html`<sc-spinner></sc-spinner>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  it('should render message with spinner', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner message="test"></sc-spinner>`
    );
    await expect(el.message).to.equal('test');
  });

  it('should render message using slot', async () => {
    const el = await fixture<ScSpinner>(
      html`<sc-spinner>
        <div slot="message">message</div>
      </sc-spinner>`
    );
  
    const messageSlot = el.querySelector('[slot="message"]');
    expect(messageSlot).to.exist;
    expect(messageSlot?.textContent).to.equal('message');
  });
});
