import { css } from 'lit';

export const ScChatInputStyle = css`
    .chat-input-box {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .chat-input-box-item {
      position: relative;
      width: 100%;
    }
  `;

export const ScChatBoxStyle = css`
    .chatbox-size-sm,
    .chatbox-size-md {
      .chatbox-avatar-container {
        img {
          width: var(--sc-chat-avatar-width, 3rem);
          height: var(--sc-chat-avatar-height, 3rem);
        }
      }
    }

    .chatbox-size-sm {
      .chatbox-conversation-msg {
        padding: 0.25rem 0.75rem 0.75rem 0.75rem;
      }

      .user-msg {
        .chatbox-conversation-msg {
          padding: 0.75rem;
        }
      }
    }

    .chatbox-size-sm {
      --sc-chat-avatar-width: 2rem;
      --sc-chat-avatar-height: 2rem;
    }

    .chatbox-size-md {
      --sc-chat-avatar-width: 3rem;
      --sc-chat-avatar-height: 3rem;
    }

    .chatbox {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .chatbox-conversation {
      display: flex;
      width: 100%;
      flex-direction: column;
      margin-bottom: 1.25rem;
    }

    .bot-msg {
      align-items: flex-start;
    }

    .user-msg {
      align-items: flex-end;

      .chatbox-avatar-container {
        margin: 0.53rem 0 0 1.25rem;
      }

      .chatbox-conversation-msg {
        background-color: var(--sc-chat-chatbox-background, var(--sc-color-blue-50));
      }
    }

    .chatbox-conversation-container {
      display: flex;
      flex-direction: row;
    }

    .chatbox-avatar-container {
      width: var(--sc-chat-avatar-width, 3rem);
      min-width: var(--sc-chat-avatar-width, 3rem);
      height: var(--sc-chat-avatar-height, 3rem);
      border-radius: 50%;
      margin: 0.53rem 0 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chatbox-avatar-container img {
      width: 100%;
      height: 100%;
    }

    .chatbox-avatar-fallback {
      font-size: 0.75rem;
      color: var(--sc-chat-avatar-fallback-color, var(--sc-color-grey-600));
    }

    .chatbox-conversation-msg {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
      height: fit-content;
      width: calc(100% - 10rem);
      word-break: keep-all;
      font-size: 1rem;
      color: var(--sc-chat-message-color, var(--sc-card-body-color, var(--sc-color-grey-600)));
      }

      .chatbox-markdown {
        word-break: break-word;
      }

      .chatbox-markdown p,
      .chatbox-markdown pre,
      .chatbox-markdown ul,
      .chatbox-markdown ol,
      .chatbox-markdown blockquote {
        margin: 0 0 0.5rem;
      }

      .chatbox-markdown li {
        margin: 0;
      }

      .chatbox-markdown > :last-child {
        margin-bottom: 0;
      }

      .chatbox-markdown ul,
      .chatbox-markdown ol {
        padding-left: 1.25rem;
      }

      .chatbox-markdown pre {
        border: 1px solid var(--sc-chat-markdown-pre-border-color, var(--sc-color-grey-150));
        border-radius: 0.375rem;
        padding: 0.75rem;
        overflow-x: auto;
      }

      .chatbox-markdown img {
        max-width: 100%;
        max-height: 18.75rem;
      }

      .chatbox-markdown a {
        color: var(--sc-chat-link-color, var(--sc-link-content-color, var(--sc-link-primary-color, var(--sc-color-blue-500))));
        text-decoration: none;
      }

      .chatbox-markdown a:hover {
        color: var(--sc-chat-link-hover-color, var(--sc-link-hover-color, var(--sc-color-blue-400)));
    }

    .chatbox-conversation-actions {
      display: flex;
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .chatbox-conversation-actions .chatbox-conversation-action {
      margin-right: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .chatbox-size-sm .chatbox-conversation-actions {
      flex-direction: column;
    }

    .chatbox-conversation-retry {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .chatbox-conversation-retry sc-icon {
      cursor: pointer;
      color: var(--sc-chat-retry-icon-color, var(--sc-color-blue));
    }
  `;

export default css`
    :host {
      display: block;
      height: 100%;
      min-height: 28rem;
      --sc-chat-layout-height: 38rem;
    }

    .chat-widget {
      display: flex;
      flex-direction: column;
      height: var(--sc-chat-layout-height, 38rem);
      border: 1px solid var(--sc-chat-widget-border-color, var(--sc-color-grey-150));
      border-radius: 0.5rem;
      overflow: hidden;
      background: var(--sc-chat-widget-background-color, var(--sc-color-white));
    }

    .chat-layout {
      height: 100%;
      min-height: 38rem;
      --sc-layout-top-offset: 0;
      --sc-layout-bottom-offset: 0;
      --sc-layout-right-offset: 0;
      --sc-layout-left-offset: 0;
      --sc-layout-main-content-padding-x: 0;
      --sc-layout-background-color: var(--sc-chat-layout-background-color, var(--sc-color-white));
    }

    .chat-layout-outer {
      height: 100%;
      max-height: var(--sc-chat-layout-height, 38rem);
    }

    .chat-layout-middle {
      height: 100%;
    }

    .chat-header {
      min-height: 3.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      box-sizing: border-box;
      border-bottom: 1px solid var(--sc-chat-header-border-color, var(--sc-color-grey-150));
    }

    .chat-header .sources {
      flex: 1;
      width: 100%;
      max-width: 20rem;
    }

    .chat-header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .chat-header-action-icon {
      color: var(--sc-chat-header-action-icon-color, var(--sc-color-grey-700));
      cursor: pointer;
    }

    .chat-header-action-icon[aria-disabled='true'] {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .chat-content {
      position: relative;
      flex: 1;
      min-height: 0;
      height: 100%;
      box-sizing: border-box;
      padding: 1rem;
      overflow-y: auto;
    }

    .chat-content-scrollbar {
      flex: 1;
      min-height: 0;
      display: block;
    }

    .chat-footer {
      padding: 0.75rem;
    }


    .chat-status {
      margin-left: auto;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 999px;
      padding: 0.125rem 0.5rem;
      white-space: nowrap;
    }

    .chat-status-streaming {
      background: var(--sc-chat-status-streaming-background-color, var(--sc-color-blue-50));
      color: var(--sc-chat-status-streaming-color, var(--sc-color-blue-700));
    }

    .chat-status-success {
      background: var(--sc-chat-status-success-background-color, var(--sc-color-green-50));
      color: var(--sc-chat-status-success-color, var(--sc-color-green-700));
    }

    .chat-status-error {
      background: var(--sc-chat-status-error-background-color, var(--sc-color-red-50));
      color: var(--sc-chat-status-error-color, var(--sc-color-red-600));
    }

    .chat-status-cancelled {
      background: var(--sc-chat-status-cancelled-background-color, var(--sc-color-grey-100));
      color: var(--sc-chat-status-cancelled-color, var(--sc-color-grey-700));
    }

    .runtime-interrupt-panel {
      margin-top: 1rem;
      border: 1px solid var(--sc-chat-runtime-panel-border-color, var(--sc-color-grey-150));
      border-radius: 0.5rem;
      padding: 1rem;
      background: var(--sc-chat-runtime-panel-background-color, var(--sc-color-white));
    }

    .runtime-interrupt-fields {
      display: grid;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }

    .runtime-interrupt-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .runtime-debug-panels {
      display: block;
      overflow: auto;
      box-sizing: border-box;
      height: 100%;
    }

    .runtime-debug-panels-inner {
      display: grid;
      gap: 0.75rem;
    }

    .runtime-debug-float {
      height: calc(var(--sc-chat-layout-height) - var(--column-layout-right-header-height));
      box-sizing: border-box;
      padding: 1rem 1rem 1rem 0;
    }

    .runtime-debug-panels-shell {
      width: min(24rem, 100%);
      min-width: 0;
    }

    .runtime-debug-panels pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.75rem;
      color: var(--sc-chat-runtime-debug-text-color, var(--sc-color-grey-700));
    }
    `;
