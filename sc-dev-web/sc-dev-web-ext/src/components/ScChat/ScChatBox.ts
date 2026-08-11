import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import * as MarkdownItModule from 'markdown-it';
import ScExtElement from '../../shared/sc-ext-element.js';
import { ScChatBoxStyle } from './ScChat.style.js';
import type { ChatConversation } from './types.js';

type MarkdownRenderer = {
  render: (content: string) => string;
};

type MarkdownItCtor = new (options?: {
  html?: boolean;
  linkify?: boolean;
  typographer?: boolean;
  breaks?: boolean;
}) => MarkdownRenderer;

const MarkdownIt =
  (MarkdownItModule as unknown as { default?: MarkdownItCtor }).default ||
  (MarkdownItModule as unknown as MarkdownItCtor);

export class ScChatBox extends ScExtElement {
  @property({ type: Array }) conversations: ChatConversation[] = [];
  @property({ type: String }) size = 'xl';
  @property({ type: String, attribute: 'bot-avatar-image' }) botAvatarImage = '';
  @property({ type: String, attribute: 'user-avatar-image' }) userAvatarImage = '';

  private readonly _markdownIt = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true,
  });

  static styles = [ScChatBoxStyle];


  private getAvatarSize() {
    switch (this.size) {
      case 'sm':
        return 'md';
      case 'md':
        return 'lg';
      default:
        return 'lg';
    }
  }

  private isRetryAction(action: { id: string; title: string }) {
    return action.id.startsWith('retry-') || action.title.trim().toLowerCase() === 'retry';
  }

  private renderMarkdown(content: string) {
    const parsed = this._markdownIt.render(content || '');
    return unsafeHTML(DOMPurify.sanitize(parsed));
  }

  render() {
    return html`
      <div class=${`chatbox ${this.size ? `chatbox-size-${this.size}` : ''}`}>
        ${this.conversations.map((conversation, index, conversations) => {
          const isBot = conversation.user === 'bot';
          const isLastConversation = index === conversations.length - 1;
          const actions = conversation.actions || [];
          const inlineActions = isLastConversation ? actions.filter(action => !this.isRetryAction(action)) : [];
          const retryActions = isLastConversation ? actions.filter(action => this.isRetryAction(action)) : [];
          return html`
            <div class=${`chatbox-conversation ${isBot ? 'bot-msg' : 'user-msg'}`}>
              <div class="chatbox-conversation-container">
                ${isBot
                  ? html`
                      <div class="chatbox-avatar-container">
                        ${this.botAvatarImage
                          ? html`${this.botAvatarImage}`
                          : html`<div class="chatbox-avatar-fallback">AI</div>`}
                      </div>
                      <div class="chatbox-conversation-msg">
                          <div class="chatbox-markdown">${this.renderMarkdown(conversation.text)}</div>
                        ${inlineActions.length > 0
                          ? html`
                              <div class="chatbox-conversation-actions">
                                ${repeat(
                                  inlineActions,
                                  action => action.id,
                                  (action, i) => html`
                                    <div class="chatbox-conversation-action">
                                      <sc-button @click=${action.handler} .type=${i === 0 ? 'primary' : 'secondary'}>
                                        ${action.title}
                                      </sc-button>
                                    </div>
                                  `
                                )}
                              </div>
                            `
                          : null}
                      </div>
                      ${retryActions.length > 0
                        ? html`
                            <div class="chatbox-conversation-retry">
                              ${repeat(
                                retryActions,
                                action => action.id,
                                action => html`
                                  <sc-icon name="refresh" size="xs" @click=${action.handler}></sc-icon>
                                `
                              )}
                            </div>
                          `
                        : null}
                    `
                  : html`
                      <div class="chatbox-conversation-msg">
                          <div class="chatbox-markdown">${this.renderMarkdown(conversation.text)}</div>
                      </div>
                      <div class="chatbox-avatar-container">
                        <sc-avatar
                          size=${this.getAvatarSize()}
                        >
                          ${this._user?.name || 'User'}
                        </sc-avatar>
                      </div>
                    `}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
