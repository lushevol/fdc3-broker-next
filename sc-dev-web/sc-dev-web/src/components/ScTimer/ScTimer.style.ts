import { css } from 'lit';

export default css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    gap: 24px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-radius: 0.25rem;
    padding: var(--timer-padding, 12px 16px);
    box-sizing:border-box;

    &.sc-truncate {
      max-width: 100%;
    }
  }

  .container.default {
    background-color: var(--sc-timer-default-background-color);
    color: var(--sc-timer-default-text-color);
  }

  .container.default.no-background {
    background-color: transparent;
    color: var(--sc-timer-default-text-color);
  }

  .container.warning {
    background-color: var(--sc-timer-warning-background-color);
    color: var(--sc-timer-warning-text-color);
  }

  .container.warning.no-background {
    background-color: transparent;
    color: var(--sc-timer-warning-text-color);
  }

  .container.alert {
    background-color: var(--sc-timer-alert-background-color);
    color: var(--sc-timer-alert-text-color);
  }

  .container.alert.no-background {
    background-color: transparent;
    color: var(--sc-timer-alert-text-color);
  }

  .content {
    display:flex;
    align-items:center;
    text-align: center;
    align-self: center;
    color: var(--sc-timer-label-description-color);
    --sc-label-line-height: null;

    .container.sc-truncate & {
      display: block;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .icon-container {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
    align-self: center;
    margin-left:1.5rem;
  }

  .time {
    flex-shrink: 0;
    color: inherit;
    text-align: right;
    font-weight:500;
  }

  .container.sm {
    font-size: 0.75rem;
    height: 1.875rem;
    padding: 4px 8px;
  }

  .container.md {
    font-size: 0.875rem;
    height: 2rem;
    padding: 5px 8px;
  }

  .container.lg {
    font-size: 1rem;
    height: 3rem;
    padding: 12px 16px;
  }
`;
