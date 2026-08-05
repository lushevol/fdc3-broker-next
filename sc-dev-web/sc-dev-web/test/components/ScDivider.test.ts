import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDivider } from '../../src/components/ScDivider/ScDivider.js';
import '../../elements/sc-divider.js';

describe('ScDivider', () => {
  it('renders divider', async () => {
    const el = await fixture<ScDivider>(html`<sc-divider></sc-divider>`);
    fixture<ScDivider>(html`<sc-divider vertical></sc-divider>`);

    expect(el.vertical).to.equal(false);
  });

  it('renders divider horizontal', async () => {
    const el = await fixture<ScDivider>(
      html`<sc-divider
        size="xs"
        line-width="xxs"
        line-height="xxs"
      ></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider
        size="xxs"
        line-width="xs"
        line-height="xs"
      ></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider size="sm" line-width="sm" line-height="sm"></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider size="md" line-width="md" line-height="md"></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider size="lg" line-width="lg" line-height="lg"></sc-divider>`
    );

    expect(el.size).to.equal('xs');
    expect(el.lineWidth).to.equal('xxs');
    expect(el.lineHeight).to.equal('xxs');
  });

  it('renders divider vertical', async () => {
    const el = await fixture<ScDivider>(
      html`<sc-divider
        title="test"
        size="xs"
        line-width="xxs"
        line-height="xxs"
        text-align="left"
        vertical
      ></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider title="test" size="xxs" line-width="xs" line-height="xs" vertical>
        <div slot="title">Row 1 (default)</div>
      </sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider
        title="test"
        size="sm"
        line-width="sm"
        line-height="sm"
        text-align="left"
        vertical
      ></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider
        title="test"
        size="md"
        line-width="md"
        line-height="md"
        text-align="center"
        vertical
      ></sc-divider>`
    );
    fixture<ScDivider>(
      html`<sc-divider
        title="test"
        size="lg"
        line-width="lg"
        line-height="lg"
        text-align="right"
        vertical
      ></sc-divider>`
    );

    expect(el.title).to.equal('test');
    expect(el.size).to.equal('xs');
    expect(el.lineWidth).to.equal('xxs');
    expect(el.lineHeight).to.equal('xxs');
    expect(el.textAlign).to.equal('left');
    expect(el.vertical).to.equal(true);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScDivider>(html`<sc-divider></sc-divider>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
