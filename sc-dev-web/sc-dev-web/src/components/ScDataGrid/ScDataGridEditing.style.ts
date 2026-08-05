import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-editing-';

export default css`
  :host {
    position: absolute;
    z-index: 3;
  }
  .sc-data-grid-editing-root {
    height: 100%;
    background-color: transparent;
    
    display: grid;
    align-items: center;
    grid-template-columns: 1fr;
  }
  .sc-data-grid-a11y-only {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
  }
`;
