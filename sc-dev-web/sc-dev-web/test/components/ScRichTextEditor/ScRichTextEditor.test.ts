import { html, fixture, expect } from '@open-wc/testing';
import { ScRichTextEditor } from '../../../src/components/ScRichTextEditor/ScRichTextEditor.js';
import  '../../../elements/sc-rich-text-editor.js';

describe('ScRichTextEditor', () => {
  it('renders the element', async () => {
    const el = await fixture<ScRichTextEditor>(
      html`<sc-rich-text-editor></sc-rich-text-editor>`,
    );
    el.publishAnalyticsEvent();
    expect(el._analytics).to.equal(undefined);
  });

  it('renders pre tag', async () => {
    const el = await fixture<ScRichTextEditor>(
      html`<sc-rich-text-editor .preTag=${true}></sc-rich-text-editor>`,
    );
    expect(el.preTag).to.equal(true);
  });
});


