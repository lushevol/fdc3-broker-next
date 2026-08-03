import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-overlapping-';

export default css`
  :host {
    position: absolute;
    z-index: 900;
  }

  .sc-data-grid-overlapping-root {
    height: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr;
    font-size: var(--sc-data-grid-body-cell-font-size);
    font-weight: 400;
    line-height: var(--sc-data-grid-cell-line-height);
  }
`;
