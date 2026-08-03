import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-master-cell-';

export default css`
  :host {
    /* not a good animation solution, need use PILF plan */
    transition: height 0.2s;
    height: var(--sc-master-row-height);
    display: block;
    position: absolute;
    width: 100%;
    /* enhance layer */
    transform: translateY(var(--sc-master-row-translateY));
    transition: transform 0.2s;
    pointer-events: all;
    overflow: hidden;
    outline: none;
  }
  
  .sc-data-grid-master-cell-root {
    padding: var(--sc-data-grid-body-cell-padding-vertical) var(--sc-data-grid-body-cell-padding-horizontal);
    display: flow-root;
  }
`;
