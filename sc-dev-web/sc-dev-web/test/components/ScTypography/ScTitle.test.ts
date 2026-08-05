import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTitle } from '../../../src/components/ScTypography/ScTitle.js';
import '../../../elements/sc-title.js';

describe('ScTitle', () => {
  it('renders default attributes', async () => {
    const el = await fixture<ScTitle>(
      html`<sc-title>Title 1</sc-title>`
    );
    expect(el.level).to.equal(1);
    expect(el.ellipsis).to.equal(false);
    expect(el.rows).to.equal(1);
    expect(el.hero).to.equal(false);
  });

  it('renders custom attributes', async () => {
    const el = await fixture<ScTitle>(
      html`<sc-title level=2 ellipsis hero rows=2>Title 2</sc-title>`
    );
    expect(el.level).to.equal(2);
    expect(el.ellipsis).to.equal(true);
    expect(el.rows).to.equal(2);
    expect(el.hero).to.equal(true);
  });
});
