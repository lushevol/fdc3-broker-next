import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScToast } from '../../src/components/ScToast/ScToast.js';
import '../../elements/sc-toast.js';

describe('ScToast', () => {
  it('renders success toast', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="success" open>Test</sc-toast>`
    );
    el.setDuration();
    el.handleDurationChange();
    el.handleMouseOver();
    el.handleMouseOut();

    expect(el.type).to.equal('success');
  });

  it('renders warning toast', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="warning" duration=Infinity open closable 
        placement='bottom-right' title='title'>Test</sc-toast>`
    );
    expect(el.type).to.equal('warning');
    expect(el.closable).to.equal(true);
  });

  it('renders info toast', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="info" open 
        placement='bottom-left' title='title'>Test</sc-toast>`
    );
    expect(el.type).to.equal('info');
    expect(el.closable).to.equal(false);
  });

  it('renders disabled toast', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="disabled" open closable
        placement='top-right'>Test</sc-toast>`
    );
    expect(el.type).to.equal('disabled');
    expect(el.closable).to.equal(true);
  });

  it('renders error toast', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="error" closable placement='top-left'>
        File upload error
        <div slot='title'>test</div>
      </sc-toast>`
    );
    expect(el.type).to.equal('error');
  });

  it('renders rows', async () => {
    const el = await fixture<ScToast>(
      html`<sc-toast type="error" rows='auto' placement='top-left'>
        File upload error
        <div slot='title'>test</div>
      </sc-toast>`
    );
    expect(el.rows).to.equal('auto');
  });
});
