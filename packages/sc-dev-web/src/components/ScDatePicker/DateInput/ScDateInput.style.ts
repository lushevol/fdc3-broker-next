import { css } from 'lit';

export const datePickerInputStyling = css`
  :host {
    position: relative;
  }

  sc-date-input-surface.with-label {
    margin-top: 4.25rem;
  }

  sc-date-input-surface.hoist {
    position: fixed;
    height: max-content;
    width: max-content;
    z-index: var(--sl-z-index-dropdown,900)!important;
  }

  sc-date-input-surface.hoist::part(container) {
    position: fixed;
  }
  .sc-form-calendar-icon {
    cursor: pointer;
  }
  .icon-cover {
    width: 90%;
    height: 100%;
    position: absolute;
    top: 0;
    cursor: pointer;
  }
  .more-icons-container, .suffix-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
`;
