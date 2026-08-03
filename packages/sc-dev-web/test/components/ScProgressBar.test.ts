import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScProgressBar } from '../../src/components/ScProgressBar/ScProgressBar.js';
import '../../elements/sc-progress-bar.js';

describe('ScProgressBar', () => {
  it('renders default progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" />
    `);

    expect(el.value).to.equal('40');
    expect(el.type).to.equal('success');
  });

  it('renders info progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" type='info'/>
    `);

    expect(el.type).to.equal('info');
  });

  it('renders success progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" type='success'/>
    `);

    expect(el.type).to.equal('success');
  });

  it('renders warning progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" type='warning'/>
    `);

    expect(el.type).to.equal('warning');
  });

  it('renders error progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" type='error'/>
    `);

    expect(el.type).to.equal('error');
  });

  it('renders disabled progress bar', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" type='disabled'/>
    `);

    expect(el.type).to.equal('disabled');
  });

  it('renders progress bar in indeterminate state', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" indeterminate />
    `);

    expect(el.indeterminate).to.equal(true);
  });

  it('renders progress bar in showLabel state', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40" show-label />
    `);

    expect(el.showLabel).to.equal(true);
  });

  it('renders progress bar with label', async () => {
    const el = await fixture<ScProgressBar>(html`
      <sc-progress-bar value="40">
        <div slot='label'>40% completed</div>
        <div>The upload progress</div>
      </sc-progress-bar>
    `);

    expect(el).dom.equal(`
      <sc-progress-bar value="40">
        <div slot='label'>40% completed</div>
        <div>The upload progress</div>
      </sc-progress-bar>
    `);
  });
});
