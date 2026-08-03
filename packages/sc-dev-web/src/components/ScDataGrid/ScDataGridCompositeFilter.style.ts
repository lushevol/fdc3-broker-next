import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-composite-filter-';

const scrollerBayStyle = css`
  ::-webkit-scrollbar {
    height: var(--sc-data-grid-faker-scroller);
    width: var(--sc-data-grid-faker-scroller);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--sc-data-grid-scrollbar-color);
    border-radius: 5px;
  }
`;

export default css`
  :host {
    --sc-data-grid-faker-scroller: 0.5rem;
  }
  ${scrollerBayStyle}
  .sc-data-grid-composite-filter-root {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .sc-data-grid-composite-filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--sc-data-grid-outline-color);
    padding: 0.75rem;
  }
  .sc-data-grid-composite-filter-title {
    color: var(--sc-data-grid-basic-text-color);
    font-family: var(--sc-font-family);
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    letter-spacing: 0.16px;
  }
  .sc-data-grid-composite-filter-header sc-icon {
    cursor: pointer;
  }
  .sc-data-grid-composite-filter-content {
    font-family: var(--sc-font-family);
    padding: 0.75rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    row-gap: 1.5rem;
    column-gap: 1.5rem;
    grid-auto-columns: 0;
  }
  .sc-data-grid-composite-filter-field-title {
    color: var(--sc-data-grid-basic-text-color);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.6666;
    margin-bottom: 0.5rem;
  }

  .sc-data-grid-composite-filter-item {
    min-height: 68px;
  }
  .sc-data-grid-composite-filter-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-top: 1px solid var(--sc-data-grid-outline-color);
  }
`;
