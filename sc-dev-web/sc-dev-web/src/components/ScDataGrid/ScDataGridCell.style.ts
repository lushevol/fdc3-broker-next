import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-cell-';
const expanded = css`
  .sc-data-grid-cell-expanded {
    margin-right: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .sc-data-grid-cell-expanded .icon {
    transition: transform 0.3s;
  }
  .sc-data-grid-cell-expanded-active .icon {
    transform: rotate(90deg);
  }
`;
const sort = css`
  .sc-data-grid-cell-sort {
    display: grid;
    place-content: center;
    user-select: none;
    color: var(--sc-color-grey-400);
  }
  .sc-data-grid-cell-sort {
    --sc-sort-asc: var(--sc-color-blue-500);
    --sc-sort-desc: var(--sc-color-blue-500);
  }
`;
const filter = css`
  .sc-data-grid-cell-filter {
    display: grid;
    place-content: center;
    user-select: none;
    color: var(--sc-color-grey-400);
  }
`;

const indicatorBox = css`
  .sc-data-grid-cell-indicator-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  .sc-data-grid-cell-indicator-box:hover {
    /* background-color: var();
    outline: 2px solid var(); */
  }
`;

export default css`
  :host {
    display: block;
    place-self: center;
    overflow: hidden;
  }
  .sc-data-grid-cell-root {
    display: flex;
    align-items: stretch;
    height: 100%;
    box-sizing: border-box;
  }
  .sc-data-grid-cell-of-header {
    padding-left: var(--sc-data-grid-header-cell-padding-horizontal);
    padding-right: var(--sc-data-grid-header-cell-padding-horizontal);
  }
  .sc-data-grid-cell-of-body {
    padding-left: var(--sc-data-grid-body-cell-padding-horizontal);
    padding-right: var(--sc-data-grid-body-cell-padding-horizontal);
  }

  .sc-data-grid-cell-of-header .sc-data-grid-cell-content {
    padding-top: var(--sc-data-grid-header-cell-padding-vertical);
    padding-bottom: var(--sc-data-grid-header-cell-padding-vertical);
    font-size: var(--sc-data-grid-header-cell-font-size);
    font-weight: 600;
    
    color: var(--sc-data-grid-header-cell-text-color);
  }
  .sc-data-grid-cell-of-body .sc-data-grid-cell-content {
    padding-top: var(--sc-data-grid-body-cell-padding-vertical);
    padding-bottom: var(--sc-data-grid-body-cell-padding-vertical);
    font-size: var(--sc-data-grid-body-cell-font-size);
    font-weight: 400;
    
    color: var(--sc-data-grid-body-cell-text-color);
  }
  .sc-data-grid-cell-content {
    box-sizing: border-box;
    flex: 1;
    max-width: 100%;
    min-width: 0;
    height: var(--sc-grid-cell-height);
    max-height: var(--sc-grid-cell-max-height);
    min-height: var(--sc-grid-cell-min-height);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: var(--sc-data-grid-cell-line-height);
  }
  ${indicatorBox}
  ${sort}
  ${expanded}
  ${filter}
`;
