import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }

  :host {
    --sc-copy-focus-ring-style: solid;
    --sc-copy-focus-ring-width: 3px;
    --sc-copy-focus-ring: var(--sc-focus-ring-style) var(--sc-focus-ring-width)
      var(--sc-focus-ring-color, var(--sc-color-blue-500));

    display: inline-block;
  }

  .copy-button__button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: 0.25rem;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
    transition: 50ms color;
    color: var(--sc-copy-label-color, var(--sc-color-blue-900));
    font: inherit;
    text-rendering: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
    line-height: inherit;
    text-transform: inherit;
    text-indent: inherit;
    text-shadow: inherit;
    text-align: inherit;
  }

  .copy-button__text {
    padding: 0.5rem 0;
  }

  .copy-button__icon {
    padding: 0 0.5rem;
  }

  .copy-button--success .copy-button__button {
    color: var(--sc-copy-success-color, var(--sc-color-green-500));
  }

  .copy-button--error .copy-button__button {
    color: var(--sc-copy-error-color, var(--sc-color-red-500));
  }

  .copy-button__button:focus-visible {
    outline: var(--sc-copy-focus-ring);
    outline-offset: 1px;
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`;
