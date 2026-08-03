import { html } from 'lit';
import { expect, fixture } from '@open-wc/testing';
import { ScChatBox } from '../../../src/components/ScChat/ScChatBox.js';

if (!customElements.get('sc-chat-box-test')) {
  customElements.define('sc-chat-box-test', ScChatBox);
}

describe('ScChatBox markdown rendering', () => {
  it('renders markdown content as HTML elements', async () => {
    const el = await fixture<ScChatBox>(html`
      <sc-chat-box-test
        .conversations=${[
          {
            user: 'bot',
            id: 'msg-1',
            text: '**Bold**\n\n- item 1\n- item 2\n\n[link](https://example.com)',
          },
        ]}
      ></sc-chat-box-test>
    `);

    await el.updateComplete;

    const markdownRoot = el.shadowRoot?.querySelector('.chatbox-markdown') as HTMLElement;
    expect(markdownRoot).to.exist;

    expect(markdownRoot.querySelector('strong')?.textContent).to.equal('Bold');
    expect(markdownRoot.querySelectorAll('li').length).to.equal(2);

    const link = markdownRoot.querySelector('a') as HTMLAnchorElement;
    expect(link).to.exist;
    expect(link.href).to.contain('https://example.com');
  });

  it('sanitizes unsafe HTML inside markdown', async () => {
    const el = await fixture<ScChatBox>(html`
      <sc-chat-box-test
        .conversations=${[
          {
            user: 'bot',
            id: 'msg-2',
            text: '<script>alert("xss")</script>\n\nSafe text',
          },
        ]}
      ></sc-chat-box-test>
    `);

    await el.updateComplete;

    const markdownRoot = el.shadowRoot?.querySelector('.chatbox-markdown') as HTMLElement;
    expect(markdownRoot.querySelector('script')).to.equal(null);
    expect(markdownRoot.textContent).to.contain('Safe text');
  });
});
