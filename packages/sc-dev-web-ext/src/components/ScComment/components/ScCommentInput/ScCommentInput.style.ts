import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .comment-input,
  .root-input,
  .reply-input {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }

  .reply-input {
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: opacity 0.2s ease, height 0.2s ease;
  }

  .reply-input-active {
    opacity: 1;
    height: auto;
  }

  .input-container {
    flex: 1;
    min-width: 0;
  }

  .input-style {
    border: 1px solid var(--sc-color-grey-200);
    border-radius: 0.25rem;
    padding: 0.5rem 0rem;
    background: var(--sc-color-bg);
  }

  .input-buttons {
    padding-right: 0.875rem;
    padding-bottom: 0.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .left-icon-right-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  sc-rich-text-editor-v2 {
    --sc-form-input-border-color: transparent;
    --sc-form-input-focus-border-color: transparent;
  }

  sc-comment-file-upload {
    margin-top: 0.5rem;
  }

  .comment-avatar {
  }

  sc-employee-avatar.comment-avatar::part(wrapper) {
    display: flex;
  }
`;
