import { html, fixture, expect } from '@open-wc/testing';
import { RTEViewer } from '../../../src/components/ScRichTextEditor/ScRteViewer.js';

describe('RTEViewer', () => {
  it('renders the element', async () => {
    const el = await fixture<RTEViewer>(
      html`<sc-rte-viewer .preTag=${true}></sc-rte-viewer>`,
    );
    expect(el.preTag).to.equal(true);
  });

  it('setContent sets innerHTML using sanitizeHTML (covers line 418)', async () => {
    // In jest/jsdom the element is not fully upgraded; use prototype.call to exercise the changed line directly
    const mockContent = { innerHTML: '' };
    const ctx = {
      content: mockContent,
      get updateComplete() { return Promise.resolve(true); },
      placeholder: '<p><br /></p>',
      count: 0,
      updateCount() { this.count = this.content.innerHTML.length; },
    };
    await (RTEViewer.prototype.setContent as any).call(ctx, '<p>Hello World</p>');
    expect(String(mockContent.innerHTML).trim()).to.not.equal('');
  });

  it('setContent with empty string falls back to placeholder via sanitizeHTML', async () => {
    const mockContent = { innerHTML: '' };
    const ctx = {
      content: mockContent,
      get updateComplete() { return Promise.resolve(true); },
      placeholder: '<p><br /></p>',
      count: 0,
      updateCount() { this.count = this.content.innerHTML.length; },
    };
    await (RTEViewer.prototype.setContent as any).call(ctx, '');
    // sanitizeHTML('<p><br /></p>') should produce a non-empty string
    expect(String(mockContent.innerHTML).trim()).to.not.equal('');
  });

  it('resetEditor sets default content via trustHTML when innerHTML is empty (covers line 457)', () => {
    const mockContent = { innerHTML: '' };
    const ctx = { content: mockContent };
    (RTEViewer.prototype.resetEditor as any).call(ctx);
    expect(String(mockContent.innerHTML).trim()).to.not.equal('');
  });

  it('resetEditor does not overwrite content when innerHTML is not empty', () => {
    const mockContent = { innerHTML: '<p>existing</p>' };
    const ctx = { content: mockContent };
    (RTEViewer.prototype.resetEditor as any).call(ctx);
    expect(String(mockContent.innerHTML)).to.equal('<p>existing</p>');
  });
});


