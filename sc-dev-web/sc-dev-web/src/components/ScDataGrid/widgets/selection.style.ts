import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-selection-cell-';


export default css`
  :host {
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  :host([disabled]) {
    cursor: default;
    filter: grayscale();
    opacity: 0.5;
  }
  :host([hide]) {
    display: none;
  }
  .sc-data-grid-selection-cell-root {
    display: flex;
  }
  .sc-data-grid-a11y-only {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
  }
`;
