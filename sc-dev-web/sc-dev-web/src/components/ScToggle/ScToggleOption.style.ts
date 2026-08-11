import { css } from 'lit';

export default css`
  :host([truncate]) {
    flex: 1;
    min-width: 0;
    max-width: max-content;
  }

  .sc-toggle-option {
    color: var(--sc-toggle-option-color, var(--sc-color-blue-900));
    font-size: var(--sc-toggle-font-size, 0.875rem);
    line-height: 1.25rem;
    padding: 2px 0.75rem;
    cursor: pointer;
    min-width: 1.25rem;

    &.sc-truncate {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .sc-toggle-option.selected {
    color: var(--sc-toggle-selected-color, var(--sc-color-white));
  }

  .sc-toggle-option.disabled {
    cursor: not-allowed;
  }
`;
