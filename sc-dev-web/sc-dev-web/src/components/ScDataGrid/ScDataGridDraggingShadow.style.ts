import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-dragging-shadow-';

export default css`
  :host {
    position: relative;
    z-index: 3;
  }
  .sc-data-grid-dragging-shadow-label {
    line-height: var(--sc-data-grid-cell-line-height);
    font-size: var(--sc-data-grid-body-cell-font-size);
    font-weight: 400;
    color: var(--sc-data-grid-body-cell-text-color);
    background: var(--sc-data-grid-body-cell-selected-bg-color);
    box-shadow: 0px 8px 24px 0px rgba(6, 29, 51, 0.12);

    padding-left: var(--sc-data-grid-header-cell-padding-horizontal);
    padding-right: var(--sc-data-grid-header-cell-padding-horizontal);
    padding-top: var(--sc-data-grid-header-cell-padding-vertical);
    padding-bottom: var(--sc-data-grid-header-cell-padding-vertical);
  }
`;
