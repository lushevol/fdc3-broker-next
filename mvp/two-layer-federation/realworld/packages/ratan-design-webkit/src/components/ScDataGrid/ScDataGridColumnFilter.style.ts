import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-column-filter-';

export default css`
  :host {
    position: relative;
    z-index: 3;

    &:focus {
      outline: none;
    }
  }
  .sc-data-grid-column-filter-content {
    background-color: var(--sc-data-grid-popup-window-bg-color);
    box-shadow: 0px 8px 24px 0px rgba(6, 29, 51, 0.12);
    padding: 0.5rem;
    min-width: 12rem;
  }
`;
