import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScParagraph } from '../../../src/components/ScTypography/ScParagraph.js';
import '../../../elements/sc-paragraph.js';

describe('ScParagraph', () => {
  it('renders default attributes', async () => {
    const el = await fixture<ScParagraph>(
      html`<sc-paragraph>Paragraph</sc-paragraph>`
    );
    expect(el.size).to.equal('md');
    expect(el.ellipsis).to.equal(false);
    expect(el.rows).to.equal(1);
  });

  it('renders custom attributes', async () => {
    const el = await fixture<ScParagraph>(
      html`<sc-paragraph size=sm ellipsis rows=2>Paragraph</sc-paragraph>`
    );
    expect(el.size).to.equal('sm');
    expect(el.ellipsis).to.equal(true);
    expect(el.rows).to.equal(2);
  });
});
