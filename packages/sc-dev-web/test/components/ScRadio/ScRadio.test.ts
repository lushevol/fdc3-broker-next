import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRadio } from '../../../src/components/ScRadio/ScRadio.js';
import '../../../elements/sc-radio.js';

describe('ScRadio', () => {
  it('renders default radio', async () => {
    const el = await fixture<ScRadio>(html` <sc-radio></sc-radio>`);

    expect(el.checked).to.equal(false);
    expect(el.disabled).to.equal(false);
  });

  it('renders checked radio', async () => {
    const el = await fixture<ScRadio>(html` <sc-radio checked></sc-radio>`);

    expect(el.checked).to.equal(true);
  });

  it('renders disabled radio', async () => {
    const el = await fixture<ScRadio>(html` <sc-radio disabled></sc-radio>`);

    expect(el.disabled).to.equal(true);
  });
  
  it('renders radio with helptext', async () => {
    const el = await fixture<ScRadio>(html` <sc-radio help-text="help"></sc-radio>`);

    expect(el.checked).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.helpText).to.equal('help');
  });

  it('renders key', async () => {
    const el = await fixture<ScRadio>(html` <sc-radio key=1234></sc-radio>`);

    expect(el.key).to.equal('1234');
  });
});
