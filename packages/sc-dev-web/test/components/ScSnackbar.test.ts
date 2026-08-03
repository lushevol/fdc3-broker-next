import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSnackbar } from '../../src/components/ScSnackbar/ScSnackbar.js';
import '../../elements/sc-snackbar.js';
import '../../elements/sc-button.js';

describe('ScSnackbar', () => {
  it('renders success snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="success" open></sc-snackbar>`
    );

    expect(el.type).to.equal('success');
  });

  it('renders warning snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="warning" duration=Infinity open closable></sc-snackbar>`
    );

    expect(el.type).to.equal('warning');
    expect(el.closable).to.equal(true);
  });

  it('renders info snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="info" closable></sc-snackbar>`
    );

    expect(el.type).to.equal('info');
    expect(el.closable).to.equal(true);
  });

  it('renders disabled snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="disabled"></sc-snackbar>`
    );

    expect(el.type).to.equal('disabled');
    expect(el.closable).to.equal(false);
  });

  it('renders error snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="error" closable placement='bottom'>
        File upload error
        <sc-button fill slot='action'>Save</sc-button>
        <sc-button slot='action'>Cancel</sc-button>
      </sc-snackbar>`
    );
    expect(el.type).to.equal('error');
  });

  it('renders snackbar without icon', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="warning" duration=Infinity open closable icon-hide></sc-snackbar>`
    );
    expect(el.iconHide).to.equal(true);
  });

  it('renders snackbar that type is loading', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar type="loading" duration=Infinity open closable></sc-snackbar>`
    );
    expect(el.type).to.equal('loading');
  });

  it('renders default type snackbar', async () => {
    const el = await fixture<ScSnackbar>(
      html`<sc-snackbar open></sc-snackbar>`
    );

    expect(el.type).to.equal('success');
  });
  
  it('support multiple snackbar', async () => {
    const wrap = await fixture<HTMLElement>(
      html`<div>
        <sc-snackbar>a0</sc-snackbar>
        <sc-snackbar>a1</sc-snackbar>
        <sc-snackbar>a2</sc-snackbar>
      </div>`
    );
    const [a0, a1, a2] = wrap.querySelectorAll<ScSnackbar>('sc-snackbar');
    await Promise.all([
      a0.updateComplete,
      a1.updateComplete,
      a2.updateComplete,
    ]);
    await Promise.all([a0.show(), a1.show(), a2.show()]);

    expect(a0.open).to.equal(true);
    expect(a1.open).to.equal(true);
    expect(a2.open).to.equal(true);
    expect(a1.stackIndex).to.equal(1);
    expect(a2.stackIndex).to.equal(2);

    await a0.hide();
    expect(a0.open).to.equal(false);
    expect(a1.stackIndex).to.equal(0);
    expect(a2.stackIndex).to.equal(1);
    
    a0.placement = 'bottom';
    await a0.show();
    expect(a0.open).to.equal(true);
    expect(a0.stackIndex).to.equal(0);
  });
});
