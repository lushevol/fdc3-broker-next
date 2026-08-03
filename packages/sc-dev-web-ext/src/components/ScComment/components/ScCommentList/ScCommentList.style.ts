import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .toggle-replies-button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    cursor: pointer;
    margin-top: 1rem;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  .toggle-replies-button:hover {
    text-decoration: underline;
  }

  sc-comment-item {
    display: block;
  }

  /* Remove border from root-level comments */
  :host > sc-comment-item::part(avatar-container) {
    border-left-color: transparent;
  }
  .load-more-container {
    padding-bottom: var(--sc-spacing-20);
  }
  .loading-indicator {
    min-height: 12.5rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sc-comment-reply-edit-input.compact {
    padding-left: 3.5rem;
  }
`;
