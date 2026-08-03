import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .left-icon-right-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    sc-tooltip {
      position: relative;
    }
  }
  .reply-username-container {
    display: flex;
    gap: 0.75rem;
  }
  .reply-username {
    color: var(--sc-comment-color, var(--sc-brand-grey));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem;
  }

  .reply-username.compact {
    color: var(--sc-comment-compact-username-color, var(--sc-color-blue-500));
  }


  .reply-time {
    color: var(--sc-comment-reply-time-color, var(--sc-color-grey-700));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    white-space: nowrap;
  }

  .action-button {
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    cursor: pointer;
  }

  .action-button .left-icon-right-text span {
    color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
  }

  .reply-container {
    margin-top: 1rem;
    padding-left: 1rem;
    border-radius: 0;
    border-left: 1px solid var(--sc-color-grey-100);
    background: var(--sc-comment-bg, var(--sc-color-bg));
    box-shadow: none;
    font-size: 0.875rem;
    transition: border-color 0.2s;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    gap: 0.5rem;
  }
  .reply-container.default.show-line:not(.top-level) {
    position: relative;
    &::before {
      content: '';
      display: block;
      height: 1rem;
      width: 0.0625rem;
      background: var(--sc-color-grey-100);
      position: absolute;
      left: -0.0625rem;
      top: -1rem;
    }
  }
  .reply-container.top-level {
    border-left: none;
    margin-bottom: 1rem;
  }
  .reply-container.compact.show-line {
    border-left: none;
    padding: 0;
    margin-top: 1rem;
  }

  .reply-children {
    padding-left: 2.5rem;
    grid-column: 1 / 4;
  }

  .compact .reply-children {
    padding-left: 0rem;
  }

  .reply-children.no-avatar:not(.compact) {
    padding-left: 0.625rem;
  }

  .top-level .reply-children.no-avatar {
    padding-left: 0rem;
  }
  
  .reply-content-container {
    position: relative;
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    color: var(--sc-comment-content-color, var(--sc-color-grey-900));
  }

  .reply-avatar-container {
    box-sizing: border-box;
  }

  .reply-avatar-container.top-level {
    border-left: none;
    padding-left: 0;
  }
  .reply-container.top-level.no-avatar {
    column-gap: 0;
    row-gap: 0.5rem;
  }
  .reply-container.no-avatar {
    padding-left: 0;
  }
  
  .reply-avatar-container.compact {
    padding-left: 1rem;
    border-left: 1px solid var(--sc-color-grey-100);
    &.show-line {
      position: relative;
      &::before {
        content: '';
        display: block;
        height: 2rem;
        width: 0.0625rem;
        background: var(--sc-color-grey-100);
        position: absolute;
        left: -0.0625rem;
        top: -2rem;
      }
    }
  }

  .reply-more-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
    align-items: center;
    font-size: 0.875rem;
    flex-wrap: nowrap;
  }

  .action-container {
    height: 1.25rem;
    display: flex;
    gap: 0.75rem;
    justify-content: start;
    flex: 1;
    padding-right: 0.5rem;
  }
  .action-dropdown {
    display: inline-flex;
    align-items: center;
  }

  .comment-status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1rem;
    white-space: nowrap;
    background: var(--sc-color-blue-100, #e3f2fd);
    color: var(--sc-color-blue-700, #1565c0);
  }

  .comment-status-badge--completed {
    background: var(--sc-color-green-100, #e8f5e9);
    color: var(--sc-color-green-700, #2e7d32);
  }

  .comment-status-badge--closed {
    background: var(--sc-color-red-100, #ffebee);
    color: var(--sc-color-red-700, #c62828);
  }
  .reply-more-hide {
    opacity: 0;
    width: 0;
  }

  .reply-text {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .reply-text sc-employee-name {
    display: inline-block;
  }

  sc-comment-attachments {
    margin-top: 0.5rem;
  }

  .comment-avatar {
  }
  .hide-avatar{
    display: none;
  }

  sc-employee-avatar.comment-avatar::part(wrapper) {
    display: flex;
  }
`;
