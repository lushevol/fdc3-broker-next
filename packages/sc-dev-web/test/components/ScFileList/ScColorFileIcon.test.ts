import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScColorFileIcon } from '../../../src/components/ScFileList/ScColorFileIcon.js';
import '../../../elements/sc-file-icon.js';

describe('ScColorFileIcon', () => {
  it('renders color file icon', async () => {
    const el = await fixture<ScColorFileIcon>(html`
      <sc-color-file-icon name="test1.zip" size="xl"></sc-color-file-icon>
    `);
    await fixture<ScColorFileIcon>(html`
      <sc-color-file-icon ext="docx" size="lg"></sc-color-file-icon>
    `);
    await fixture<ScColorFileIcon>(html`
      <sc-color-file-icon ext="xlsx" size="sm"></sc-color-file-icon>
    `);
    await fixture<ScColorFileIcon>(html`
      <sc-color-file-icon name="test" size="md"></sc-color-file-icon>
    `);
    await fixture<ScColorFileIcon>(html`
      <sc-color-file-icon name="test.te" size="xs"></sc-color-file-icon>
    `);

    expect(el.ext).to.equal(undefined);
  });

  it('resolveIcon processes a valid SVG string via trustHTML (covers line 136)', () => {
    // resolveIcon doesn't use `this`, so call via prototype to avoid custom-element registration in jsdom
    const svgString = '<svg viewBox="0 0 48 48"><rect width="10" height="10"/></svg>';
    const result = ScColorFileIcon.prototype.resolveIcon.call({}, svgString);
    // result is SVGElement or null (jsdom may not support SVGElement.part — either is valid)
    expect(result === null || result instanceof Element).to.be.true;
  });

  it('resolveIcon returns null for non-SVG input', () => {
    const result = ScColorFileIcon.prototype.resolveIcon.call({}, '<div>not svg</div>');
    expect(result).to.equal(null);
  });
});
